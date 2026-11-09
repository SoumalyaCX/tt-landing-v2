"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type UniformValue = number | readonly [number, number];
export type Uniforms = Record<string, UniformValue>;

export type ShaderCanvasProps = {
  /** GLSL fragment shader body. `precision`, `varying vec2 vUv` (0–1, y up) are prepended. */
  fragment: string;
  /** Mutable uniform values, read every frame. */
  uniforms: React.RefObject<Uniforms>;
  /** Called before each frame with elapsed seconds and the (capped) frame delta. */
  onFrame?: (time: number, dt: number) => void;
  /** Run a continuous loop (false = render single frames, e.g. reduced motion). */
  animate?: boolean;
  /** Bump to force a redraw when not animating. */
  version?: number;
  /** `true` once the first frame is on screen (again after a lost GPU context is restored), `false` if WebGL is unavailable. */
  onReady?: (ok: boolean) => void;
  className?: string;
};

const VERTEX = `attribute vec2 aPos; varying vec2 vUv;
void main(){ vUv = aPos*0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

/**
 * Renders a fragment shader on a full-size quad with plain WebGL.
 * Sizes itself to its CSS box (DPR capped at 2) and pauses while off-screen.
 * Renders nothing (transparent) when WebGL is unavailable, and rebuilds itself
 * if the browser drops and restores the GPU context (e.g. iOS after backgrounding).
 */
export function ShaderCanvas({
  fragment,
  uniforms,
  onFrame,
  animate = true,
  version = 0,
  onReady,
  className,
}: ShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<(() => void) | null>(null);
  const onFrameRef = useRef(onFrame);
  const onReadyRef = useRef(onReady);
  // Bumped when a lost WebGL context is restored, to rebuild the program.
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    onFrameRef.current = onFrame;
    onReadyRef.current = onReady;
  }, [onFrame, onReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });
    if (!gl) {
      onReadyRef.current?.(false);
      return;
    }

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
      }
      return sh;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(
      program,
      compile(gl.FRAGMENT_SHADER, `precision highp float;\nvarying vec2 vUv;\n${fragment}`),
    );
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      onReadyRef.current?.(false);
      return;
    }
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.clearColor(0, 0, 0, 0);

    const locations = new Map<string, WebGLUniformLocation | null>();
    const loc = (name: string) => {
      if (!locations.has(name)) locations.set(name, gl.getUniformLocation(program, name));
      return locations.get(name)!;
    };

    const start = performance.now();
    let last = 0;
    let announced = false;
    const draw = () => {
      const t = (performance.now() - start) / 1000;
      const dt = Math.min(0.05, t - last);
      last = t;
      onFrameRef.current?.(t, dt);
      for (const [name, value] of Object.entries(uniforms.current ?? {})) {
        const l = loc(name);
        if (!l) continue;
        if (typeof value === "number") gl.uniform1f(l, value);
        else gl.uniform2f(l, value[0], value[1]);
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!announced) {
        announced = true;
        // Next frame = the first drawn frame has been composited.
        requestAnimationFrame(() => onReadyRef.current?.(true));
      }
    };
    drawRef.current = draw;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      if (!animate) draw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let raf = 0;
    let visible = true;
    const loop = () => {
      if (!visible) {
        raf = 0;
        return;
      }
      draw();
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && animate && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    if (animate) raf = requestAnimationFrame(loop);

    const onLost = (e: Event) => {
      e.preventDefault(); // allow the browser to restore the context
      cancelAnimationFrame(raf);
      visible = false;
    };
    const onRestored = () => setGeneration((g) => g + 1);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      ro.disconnect();
      io.disconnect();
      drawRef.current = null;
      // Free GPU objects but keep the context: React may re-run this effect on the same canvas.
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
    };
  }, [fragment, uniforms, animate, generation]);

  // Static mode: redraw when asked.
  useEffect(() => {
    if (!animate) drawRef.current?.();
  }, [version, animate]);

  return <canvas ref={canvasRef} aria-hidden className={cn("block size-full", className)} />;
}
