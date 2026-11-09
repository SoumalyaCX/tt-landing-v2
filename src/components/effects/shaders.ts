/** GLSL fragment shaders for the assistant orb and the memory orb. */

/* ---- HeroOrb --------------------------------------------------------------- */

/**
 * Assistant orb: four drifting light rings around a dark core, with fine
 * filaments and a halo. Ported verbatim from the original demo.
 * Uniforms: uTime, uSpin (accumulated spin), uThink (0–1), uHover (0–1), uLook (vec2 gaze).
 */
export const heroOrbShader = /* glsl */ `
uniform float uTime; uniform float uThink; uniform float uHover; uniform vec2 uLook; uniform float uSpin;
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
vec3 ring(vec2 p, float rad, float wid, vec2 off, float ph, float spd, vec3 col){
  vec2 q = p - off; float r = length(q), a = atan(q.y, q.x);
  float wob = 0.024*sin(a*2.0 + uSpin*spd*0.7 + ph) + 0.014*sin(a*3.0 - uSpin*spd*0.5 + ph*1.7);
  float d = r - (rad + wob);
  float band = exp(-d*d/(wid*wid));
  float side = pow(0.55 + 0.45*sin(a + uSpin*spd + ph), 1.7);
  float look = 0.7 + 0.55*dot(normalize(q + 1e-4), uLook);
  return col*band*side*look;
}
void main(){
  vec2 p = (vUv - 0.5)*2.0; float t = uTime;
  vec3 c = vec3(0.0);
  c += ring(p, 0.600, 0.052, 0.026*vec2(cos(t*0.7), sin(t*0.9)), 0.0, 0.60, vec3(0.25,0.85,1.00));
  c += ring(p, 0.618, 0.062, 0.036*vec2(cos(t*0.5+2.0), sin(t*0.6+1.0)), 2.1, -0.45, vec3(0.28,0.40,1.00));
  c += ring(p, 0.585, 0.046, 0.030*vec2(cos(t*0.8+4.0), sin(t*0.7+3.0)), 4.2, 0.52, vec3(0.62,0.38,1.00));
  c += ring(p, 0.610, 0.034, 0.022*vec2(cos(t*0.6+1.0), sin(t*0.5+5.0)), 1.3, -0.72, vec3(0.25,0.92,0.55))*0.85;
  float r = length(p), a = atan(p.y, p.x);
  float fil = 0.5 + 0.5*sin((r + 0.02*sin(a*4.0 + t))*260.0);
  float fb = exp(-pow((r - 0.6)/0.065, 2.0));
  c += vec3(0.5,0.8,1.0)*fil*fb*0.2*(0.6 + 0.4*sin(a - uSpin*0.8));
  float core = smoothstep(0.548, 0.522, r);
  vec3 coreC = mix(vec3(0.012,0.025,0.06), vec3(0.025,0.11,0.14), smoothstep(0.55, 0.0, r)*0.85);
  coreC += vec3(0.02,0.07,0.1)*(0.5 + 0.5*sin(a*2.0 + t*0.3))*smoothstep(0.55, 0.15, r);
  coreC += (hash(vUv*640.0 + fract(t)) - 0.5)*0.03;
  coreC += vec3(0.2,0.5,1.0)*exp(-pow((r - 0.522)/0.028, 2.0))*0.4;
  vec3 halo = vec3(0.2,0.35,1.0)*exp(-max(r - 0.6, 0.0)*7.0)*0.2*(1.0 + uHover*0.9 + uThink*0.6)*smoothstep(1.0, 0.6, r);
  vec3 rings = c*(1.0 + uHover*0.45 + uThink*0.35) + halo;
  vec3 col = coreC*core + rings*(1.0 - core*0.5);
  col = 1.0 - exp(-col*1.5);
  float m = max(max(rings.r, rings.g), rings.b);
  float alpha = clamp(max(core*0.97, 1.0 - exp(-m*2.4)), 0.0, 1.0)*smoothstep(1.0, 0.86, r);
  gl_FragColor = vec4(col*smoothstep(1.0, 0.86, r), alpha);
}
`;

/* ---- MemoryOrb ------------------------------------------------------------- */

/**
 * Memory orb: six rings ("memory layers") that appear and sharpen as uDay
 * grows from 0 to 1, signals drifting in from outside, a private dashed
 * boundary and a glowing nucleus. Ported verbatim from the original demo.
 * Uniforms: uTime, uDay (0–1), uLook (vec2 gaze), uHover (0–1).
 */
export const memoryOrbShader = /* glsl */ `
uniform float uTime; uniform float uDay; uniform vec2 uLook; uniform float uHover;
float hash(float n){ return fract(sin(n)*43758.5453); }
float hash2(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
void main(){
  vec2 p = (vUv - 0.5)*2.0; float r = length(p), a = atan(p.y, p.x), t = uTime;
  float sharp = smoothstep(0.0, 1.0, uDay);
  vec3 c = vec3(0.0);
  for (int i = 0; i < 6; i++){
    float fi = float(i);
    float vis = smoothstep(fi/6.8, fi/6.8 + 0.14, uDay);
    float rad = 0.2 + fi*0.115;
    float wob = mix(0.06, 0.014, sharp)*sin(a*2.0 + t*(0.4 + fi*0.12) + fi*1.7) + mix(0.03, 0.006, sharp)*sin(a*3.0 - t*0.3 + fi);
    vec2 off = mix(0.0, 0.018, sharp)*vec2(cos(t*0.5 + fi*1.3), sin(t*0.6 + fi*2.1));
    float rr2 = length(p - off);
    float wid = mix(0.075, 0.02, sharp);
    float d = rr2 - rad - wob;
    float band = exp(-d*d/(wid*wid));
    float side = pow(0.5 + 0.5*sin(a*(fi < 3.0 ? 1.0 : -1.0) + t*(0.35 + fi*0.08) + fi*2.3), 1.4);
    float look = 0.7 + 0.5*dot(normalize(p + 1e-4), uLook);
    float fil = mix(1.0, 0.55 + 0.45*sin((r + 0.01*sin(a*5.0 + t))*320.0), sharp*0.8);
    vec3 col = fi < 0.5 ? vec3(0.62,0.4,1.0) : (fi < 1.5 ? vec3(0.3,0.42,1.0) : (fi < 2.5 ? vec3(0.28,0.85,1.0) : (fi < 3.5 ? vec3(0.4,0.5,1.0) : vec3(0.3,0.88,1.0))));
    col = mix(col, vec3(0.3,0.95,0.55), smoothstep(0.75, 1.0, uDay)*step(4.5, fi));
    c += col*band*vis*(0.3 + 1.1*side)*look*fil*(0.9 + 0.9*sharp);
  }
  for (int j = 0; j < 18; j++){
    float fj = float(j);
    if (fj > 5.0 + uDay*13.0) continue;
    float ang = hash(fj*7.3)*6.2832 + t*(0.12 + hash(fj)*0.15);
    float rr = 0.95 - fract(hash(fj*3.1) + t*(0.05 + hash(fj*1.9)*0.06))*0.8;
    vec2 q = vec2(cos(ang), sin(ang))*rr;
    float g = exp(-dot(p - q, p - q)/0.0007);
    c += mix(vec3(0.6,0.75,1.0), vec3(0.45,1.0,0.7), step(0.6, hash(fj*5.0)))*g*0.9*smoothstep(0.1, 0.3, rr);
  }
  float bd = exp(-pow((r - 0.9)/0.006, 2.0))*step(0.45, fract(a*36.0/6.2832));
  c += vec3(0.4,0.55,1.0)*bd*0.5;
  float nr = 0.07 + 0.05*sharp;
  c += vec3(0.55,0.85,1.0)*exp(-r*r/(nr*nr))*(0.6 + 0.6*sharp)*(1.0 + 0.15*sin(t*2.0));
  c += vec3(0.2,0.35,1.0)*exp(-max(r - 0.3, 0.0)*5.0)*0.1*(1.0 + uHover);
  c += vec3(0.25,0.45,1.0)*exp(-pow((r - 0.8)/0.12, 2.0))*0.22*sharp*(1.0 + uHover*0.8);
  vec3 col = 1.0 - exp(-c*1.6);
  col += (hash2(vUv*512.0 + fract(t)) - 0.5)*0.015;
  float m = max(max(c.r, c.g), c.b);
  float alpha = clamp(1.0 - exp(-m*2.6), 0.0, 1.0)*smoothstep(1.0, 0.93, r);
  gl_FragColor = vec4(col*smoothstep(1.0, 0.93, r), alpha);
}
`;
