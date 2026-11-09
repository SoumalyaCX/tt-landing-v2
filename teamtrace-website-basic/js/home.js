/* ==========================================================================
   TeamTrace — home.js
   Interactive sections of the homepage (teamtrace-homepage.html).
   Requires: three.js r128 (loaded before this file) for the WebGL orbs,
             js/main.js for the shared navigation.

   CONTENTS
     1.  Hero: product readout bars
     2.  Hero: TraceAI console (instruction -> dashboard change demo)
     3.  Hero: TraceAI orb (WebGL; eyes follow the cursor, then it speaks)
     4.  Barbell: every person plotted between burnout and drift
     5.  Lifecycle: stages advance as you scroll
     6.  Questions: module tabs + mini dashboards
     7.  Siloed -> unified: circuit board
     8.  TraceAI memory: orb of rings driven by the day slider
     9.  Analytics: altitude switch + sample dashboards
     10. Profit cards: reveal on scroll
   ========================================================================== */
(function(){
"use strict";

/* ---------- Shared flags ---------- */
/* reduce: user prefers reduced motion -> skip animations; fine: mouse/trackpad (not touch) */
var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var fine = window.matchMedia("(pointer: fine)").matches;

/* ==========================================================================
   1. Hero: product readout
   The readout card beside the headline (Individual / Team / Organization).
   ========================================================================== */
var scene3d = null;
/* animate the readout's bars from 0 to their data-w width */
function fillBars(view){
  view.querySelectorAll(".rd-track i").forEach(function(i){
    i.style.width = "0";
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ i.style.width = i.dataset.w + "%"; }); });
  });
}

/* ==========================================================================
   2. Hero: TraceAI console
   Give an instruction, see the dashboard change. Sample data only:
   typed prompts are matched against the keywords of the AI[] instructions.
   ========================================================================== */
var aiPanel = document.getElementById("ai-panel"), aiForm = document.getElementById("ai-form"), aiInput = document.getElementById("ai-input");
var aiSugs = document.getElementById("ai-sugs"), aiSteps = document.getElementById("ai-steps"), aiMsg = document.getElementById("ai-msg"), aiSub = document.getElementById("ai-sub");
var aiTag = document.getElementById("ai-tag"), aiStatus = document.getElementById("ai-status");
var readoutEl = document.querySelector(".readout");
var ttView = document.querySelector('.rd-view[data-for="teamtrace"]');
var IDLE_STATUS = fine ? "Click me to ask" : "Tap me to ask";
aiStatus.textContent = IDLE_STATUS;
/* console icons (Phosphor, from js/icons.js) */
var ICON = { arrow: TTIcon("arrow-right"), bell: TTIcon("bell-simple"), mail: TTIcon("envelope-simple") };
/* sample instructions: the words that trigger each one, the steps shown, and how it changes the dashboard */
var AI = [
  {text:"Count Figma as productive for the Design team", keys:["figma"],
   steps:["Opening the Design team’s app rules","Moving Figma from Neutral to Productive","Recalculating today’s scores"],
   apply:function(st){ st.deep += 25; st.shallow -= 25; st.score += 3; return {changed:["score","deep","shallow"], note:"Figma now counts as productive for Design, so today’s score rose by 3 points."}; }},
  {text:"Ignore idle breaks shorter than 5 minutes", keys:["idle","break","5 min"],
   steps:["Opening idle time settings","Setting the idle threshold to 5 minutes","Recalculating today’s scores"],
   apply:function(st){ st.idle -= 25; st.score += 2; return {changed:["score","idle"], note:"Short pauses no longer count as idle, so 25 minutes moved out of idle time."}; }},
  {text:"Alert me if anyone’s focus drops 3 days in a row", keys:["alert","notify","drop"],
   steps:["Creating a new alert rule","Watching focus scores across your teams","Sending alerts by email and in the app"],
   apply:function(st){ st.extras.push({icon:"bell", t:"Alert when focus drops 3 days in a row", s:"Active"}); return {changed:["extra"], note:"Your new alert rule is live and watching every team."}; }},
  {text:"Email me this report every Friday", keys:["report","email","friday"],
   steps:["Saving this view as a report","Scheduling it for Fridays at 5 PM","Adding your email as the recipient"],
   apply:function(st){ st.extras.push({icon:"mail", t:"Report emailed every Friday at 5 PM", s:"Scheduled"}); return {changed:["extra"], note:"This report will land in your inbox every Friday."}; }}
];
/* demo state: the starting dashboard values, current values and run state */
var BASE = {score:78, deep:230, shallow:155, idle:75, extras:[]};
var st = JSON.parse(JSON.stringify(BASE)), applied = {}, aiBusy = false, aiTimers = [];
var BASE_NOTE = "Longest focused session ran from 10:00 to 11:42 AM. Focus broke at 2:40 PM.";
/* minutes -> "3h 50m" */
function fmt(m){ return Math.floor(m/60) + "h " + (m%60 < 10 ? "0" : "") + (m%60) + "m"; }
/* set one readout bar (width relative to a 460-minute day) */
function setBar(row, val){ var i = document.querySelector("#" + row + " .rd-track i"); var w = Math.round(val/460*100); i.dataset.w = w; i.style.width = w + "%"; }
/* redraw the readout from the current state; highlight what changed */
function renderDash(changed, note){
  document.getElementById("rd-score").textContent = st.score;
  document.getElementById("v-deep").textContent = fmt(st.deep);
  document.getElementById("v-shallow").textContent = fmt(st.shallow);
  document.getElementById("v-idle").textContent = fmt(st.idle);
  setBar("row-deep", st.deep); setBar("row-shallow", st.shallow); setBar("row-idle", st.idle);
  var ex = document.getElementById("rd-extra");
  ex.innerHTML = st.extras.map(function(x, i){ return '<li class="' + (changed.indexOf("extra") > -1 && i === st.extras.length-1 ? "changed" : "") + '">' + ICON[x.icon] + '<span>' + x.t + '</span><em>' + x.s + '</em></li>'; }).join("");
  var map = {score:"rd-score-row", deep:"row-deep", shallow:"row-shallow", idle:"row-idle"};
  Object.keys(map).forEach(function(k){
    var el = document.getElementById(map[k]), on = changed.indexOf(k) > -1;
    el.classList.toggle("changed", on);
    var tag = el.querySelector(".by-ai"); if (tag) tag.remove();
    if (on) { var t = document.createElement("span"); t.className = "by-ai"; t.textContent = "TraceAI"; (el.querySelector(":scope > span") || el).appendChild(t); }
  });
  var n = document.getElementById("rd-note");
  n.innerHTML = note ? note + (Object.keys(applied).length ? ' <button type="button" id="ai-reset">Reset demo</button>' : "") : BASE_NOTE;
  var r = document.getElementById("ai-reset"); if (r) r.addEventListener("click", resetDemo);
  aiTimers.push(setTimeout(function(){
    document.querySelectorAll(".rd-readout .changed, #rd-extra .changed, .rd-view .changed").forEach(function(el){ el.classList.remove("changed"); });
  }, 6000));
}
/* back to the starting values */
function resetDemo(){ st = JSON.parse(JSON.stringify(BASE)); applied = {}; renderSugs(); renderDash([], null); }
/* render the suggestion buttons (already-applied ones are disabled) */
function renderSugs(){
  aiSugs.innerHTML = AI.map(function(a, i){ return '<button type="button" data-ai="' + i + '"' + (applied[i] ? " disabled" : "") + '>' + ICON.arrow + '<span>' + a.text + (applied[i] ? " (done)" : "") + '</span></button>'; }).join("");
  aiSugs.querySelectorAll("button").forEach(function(b){ b.addEventListener("click", function(){ runAI(Number(b.dataset.ai)); }); });
}
/* status text on the hero's TraceAI tag */
function status(text, working){ aiStatus.textContent = text; aiTag.classList.toggle("working", !!working); }
/* show the console in place of the readout view */
function openTraceAI(focus){
  if (aiBusy) return;
  ttView.hidden = true; aiPanel.hidden = false; readoutEl.classList.add("ai-open");
  aiSub.hidden = false; aiSugs.hidden = false; aiSteps.hidden = true; aiMsg.hidden = true;
  renderSugs();
  if (focus && window.innerWidth <= 900) readoutEl.scrollIntoView({behavior: reduce ? "auto" : "smooth", block:"center"});
  if (focus && fine) aiInput.focus({preventScroll:true});
}
/* hide the console and return to the readout view */
function closeTraceAI(){
  if (aiBusy) return;
  readoutEl.classList.remove("ai-open");
  aiPanel.hidden = true; ttView.hidden = false;
}
/* run sample instruction i: show the steps one by one, then apply its change */
function runAI(i){
  if (aiBusy || applied[i]) return;
  var a = AI[i];
  openTraceAI(false);
  aiBusy = true; aiInput.value = ""; aiInput.disabled = true;
  aiSub.hidden = true; aiSugs.hidden = true; aiMsg.hidden = true; aiSteps.hidden = false;
  aiSteps.innerHTML = '<li class="ai-q">“' + a.text + '”</li>' + a.steps.map(function(s){ return '<li><i></i><span>' + s + '</span></li>'; }).join("");
  var lis = aiSteps.querySelectorAll("li:not(.ai-q)");
  status("Working on it", true);
  if (scene3d) scene3d.setThinking(true);
  var stepMs = reduce ? 250 : 850;
  lis.forEach(function(li, k){
    aiTimers.push(setTimeout(function(){ li.className = "run"; }, k*stepMs));
    aiTimers.push(setTimeout(function(){ li.className = "done"; }, (k+1)*stepMs - 60));
  });
  aiTimers.push(setTimeout(function(){
    aiMsg.hidden = false; aiMsg.className = "ai-msg ok"; aiMsg.textContent = "Done. Here’s the change in your dashboard.";
    if (scene3d) scene3d.setThinking(false);
    status("Done", false);
  }, lis.length*stepMs + 100));
  aiTimers.push(setTimeout(function(){
    aiBusy = false; aiInput.disabled = false;
    applied[i] = true;
    var res = a.apply(st);
    aiPanel.hidden = true; ttView.hidden = false; readoutEl.classList.remove("ai-open");
    renderDash(res.changed, res.note);
    setTimeout(function(){ status(IDLE_STATUS, false); }, 2500);
  }, lis.length*stepMs + (reduce ? 400 : 1300)));
}
/* typed prompt: run the first matching sample instruction, otherwise explain the preview */
aiForm.addEventListener("submit", function(e){
  e.preventDefault();
  var q = aiInput.value.trim().toLowerCase();
  if (!q) { openTraceAI(true); return; }
  var hit = -1;
  AI.forEach(function(a, i){ if (hit < 0 && !applied[i] && a.keys.some(function(k){ return q.indexOf(k) > -1; })) hit = i; });
  if (hit > -1) { runAI(hit); return; }
  openTraceAI(false);
  aiMsg.hidden = false; aiMsg.className = "ai-msg";
  aiMsg.textContent = "In this preview, TraceAI runs the sample instructions above. Start a free trial to give it your own.";
});
/* wiring: focus, close button, Escape key and the hero tag */
aiInput.addEventListener("focus", function(){ if (aiPanel.hidden && !aiBusy) openTraceAI(false); });
document.getElementById("ai-close").addEventListener("click", closeTraceAI);
aiPanel.addEventListener("keydown", function(e){ if (e.key === "Escape") closeTraceAI(); });
aiTag.addEventListener("click", function(){ openTraceAI(true); });

/* ==========================================================================
   3. Hero: TraceAI orb
   WebGL orb behind the hero. Eyes follow the cursor, then it speaks.
   Pauses when the hero is off-screen; static when reduced motion is on.
   ========================================================================== */
/* builds the WebGL orb (needs three.js); returns {setFocus, setThinking} or null */
function initScene(){
  if (!window.THREE) return null;
  var canvas = document.getElementById("scene"), hint = document.getElementById("ai-tag");
  var ui = document.getElementById("orb-ui"), eyesEl = ui.querySelector(".orb-eyes"), textEl = document.getElementById("orb-text");
  var renderer;
  try { renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true, alpha:true, premultipliedAlpha:true}); } catch(e){ return null; }
  renderer.setClearColor(0, 0); renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  var scene = new THREE.Scene(), camera = new THREE.OrthographicCamera(0, 1, 0, -1, -10, 10);
  var U = {uTime:{value:0}, uThink:{value:0}, uHover:{value:0}, uLook:{value:new THREE.Vector2()}, uSpin:{value:0}};
  var FS = [
    "uniform float uTime; uniform float uThink; uniform float uHover; uniform vec2 uLook; uniform float uSpin;",
    "varying vec2 vUv;",
    "float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }",
    "vec3 ring(vec2 p, float rad, float wid, vec2 off, float ph, float spd, vec3 col){",
    "  vec2 q = p - off; float r = length(q), a = atan(q.y, q.x);",
    "  float wob = 0.024*sin(a*2.0 + uSpin*spd*0.7 + ph) + 0.014*sin(a*3.0 - uSpin*spd*0.5 + ph*1.7);",
    "  float d = r - (rad + wob);",
    "  float band = exp(-d*d/(wid*wid));",
    "  float side = pow(0.55 + 0.45*sin(a + uSpin*spd + ph), 1.7);",
    "  float look = 0.7 + 0.55*dot(normalize(q + 1e-4), uLook);",
    "  return col*band*side*look;",
    "}",
    "void main(){",
    "  vec2 p = (vUv - 0.5)*2.0; float t = uTime;",
    "  vec3 c = vec3(0.0);",
    "  c += ring(p, 0.600, 0.052, 0.026*vec2(cos(t*0.7), sin(t*0.9)), 0.0, 0.60, vec3(0.25,0.85,1.00));",
    "  c += ring(p, 0.618, 0.062, 0.036*vec2(cos(t*0.5+2.0), sin(t*0.6+1.0)), 2.1, -0.45, vec3(0.28,0.40,1.00));",
    "  c += ring(p, 0.585, 0.046, 0.030*vec2(cos(t*0.8+4.0), sin(t*0.7+3.0)), 4.2, 0.52, vec3(0.62,0.38,1.00));",
    "  c += ring(p, 0.610, 0.034, 0.022*vec2(cos(t*0.6+1.0), sin(t*0.5+5.0)), 1.3, -0.72, vec3(0.25,0.92,0.55))*0.85;",
    "  float r = length(p), a = atan(p.y, p.x);",
    "  float fil = 0.5 + 0.5*sin((r + 0.02*sin(a*4.0 + t))*260.0);",
    "  float fb = exp(-pow((r - 0.6)/0.065, 2.0));",
    "  c += vec3(0.5,0.8,1.0)*fil*fb*0.2*(0.6 + 0.4*sin(a - uSpin*0.8));",
    "  float core = smoothstep(0.548, 0.522, r);",
    "  vec3 coreC = mix(vec3(0.012,0.025,0.06), vec3(0.025,0.11,0.14), smoothstep(0.55, 0.0, r)*0.85);",
    "  coreC += vec3(0.02,0.07,0.1)*(0.5 + 0.5*sin(a*2.0 + t*0.3))*smoothstep(0.55, 0.15, r);",
    "  coreC += (hash(vUv*640.0 + fract(t)) - 0.5)*0.03;",
    "  coreC += vec3(0.2,0.5,1.0)*exp(-pow((r - 0.522)/0.028, 2.0))*0.4;",
    "  vec3 halo = vec3(0.2,0.35,1.0)*exp(-max(r - 0.6, 0.0)*7.0)*0.2*(1.0 + uHover*0.9 + uThink*0.6)*smoothstep(1.0, 0.6, r);",
    "  vec3 rings = c*(1.0 + uHover*0.45 + uThink*0.35) + halo;",
    "  vec3 col = coreC*core + rings*(1.0 - core*0.5);",
    "  col = 1.0 - exp(-col*1.5);",
    "  float m = max(max(rings.r, rings.g), rings.b);",
    "  float alpha = clamp(max(core*0.97, 1.0 - exp(-m*2.4)), 0.0, 1.0)*smoothstep(1.0, 0.86, r);",
    "  gl_FragColor = vec4(col*smoothstep(1.0, 0.86, r), alpha);",
    "}"].join("\n");
  var mat = new THREE.ShaderMaterial({uniforms:U, transparent:true, premultipliedAlpha:true, depthWrite:false,
    vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }", fragmentShader:FS});
  var orb = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat); scene.add(orb);

  /* layout in screen pixels */
  var w = 1, h = 1, R = 160, C = {x:0, y:0};
  function layout(){
    w = canvas.clientWidth; h = canvas.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.left = 0; camera.right = w; camera.top = 0; camera.bottom = -h; camera.updateProjectionMatrix();
    var mobile = w < 900;
    R = mobile ? Math.min(w*0.3, 130) : Math.min(h*0.21, w*0.13);
    C = {x: mobile ? w*0.5 : w*0.67, y: mobile ? 110 + R*1.15 : h*0.37};
    var S = R/0.6*2;
    orb.position.set(C.x, -C.y, 0); orb.scale.set(S, S, 1);
    ui.style.left = C.x + "px"; ui.style.top = C.y + "px"; ui.style.setProperty("--R", R.toFixed(1) + "px");
    if (hint) { hint.style.left = C.x + "px"; hint.style.transform = "translate(-50%,0)"; hint.style.top = (mobile ? C.y + R*1.25 : Math.max(104, C.y - R*1.32 - 44)) + "px"; }
    if (reduce) render(0);
  }

  /* gaze and hover */
  var look = {x:0, y:0}, lookT = {x:0, y:0}, hover = 0, hoverT = 0, lastMove = -99;
  function aim(cx, cy){
    var r = canvas.getBoundingClientRect(), dx = cx - r.left - C.x, dy = cy - r.top - C.y;
    var d = Math.sqrt(dx*dx + dy*dy) || 1, k = Math.min(1, d/(R*2.2));
    lookT.x = dx/d*k; lookT.y = dy/d*k;
    hoverT = d < R*1.05 ? 1 : 0; canvas.classList.toggle("over", d < R*1.05);
    lastMove = clock.getElapsedTime();
    if (d < R*2.4) wake();
  }
  window.addEventListener("pointermove", function(e){ if (e.pointerType === "mouse") aim(e.clientX, e.clientY); }, {passive:true});
  canvas.addEventListener("click", function(e){
    aim(e.clientX, e.clientY);
    var r = canvas.getBoundingClientRect(), dx = e.clientX - r.left - C.x, dy = e.clientY - r.top - C.y;
    if (dx*dx + dy*dy < R*R*1.2 && typeof openTraceAI === "function") { say(["Hi!"], function(){ mode("eyes"); }); openTraceAI(true); }
  });

  /* what the orb shows: eyes, or words in place of its eyes */
  var LINES = ["Hi", "I’m TraceAI", "Tell me what to do"], timers = [], busy = false, current = "eyes";
  function clear(){ timers.forEach(clearTimeout); timers = []; }
  function later(fn, ms){ timers.push(setTimeout(fn, ms)); }
  function mode(m){
    current = m; ui.dataset.mode = m;
    if (m === "eyes" && !busy) { clear(); later(talk, 5200); }
  }
  function say(lines, done){
    clear(); ui.dataset.mode = "text"; current = "text";
    var i = 0;
    (function next(){
      if (i >= lines.length) { textEl.classList.remove("in"); later(function(){ if (done) done(); }, 450); return; }
      textEl.classList.remove("in"); 
      later(function(){ textEl.textContent = lines[i]; textEl.classList.toggle("big", lines[i].length < 5); textEl.classList.add("in"); i++; later(next, lines[i-1].length < 5 ? 1500 : 2100); }, i ? 420 : 300);
    })();
  }
  function talk(){ if (busy || hoverT) { mode("eyes"); return; } say(LINES, function(){ mode("eyes"); }); }
  function wake(){ if (busy) return; if (current !== "eyes") { textEl.classList.remove("in"); mode("eyes"); } }
  /* blinking */
  (function blink(){ if (!reduce) { if (current === "eyes") { eyesEl.classList.add("blink"); setTimeout(function(){ eyesEl.classList.remove("blink"); }, 130); } setTimeout(blink, 2600 + Math.random()*2800); } })();

  var clock = new THREE.Clock(), raf = null, visible = true, last = 0, think = 0, thinkT = 0, spin = 0, scrollP = 0;
  function render(t){
    var dt = Math.min(0.05, t - last); last = t;
    if (t - lastMove > 4 && !reduce) { lookT.x = Math.sin(t*0.5)*0.5; lookT.y = Math.sin(t*0.37)*0.25; }
    look.x += (lookT.x - look.x)*(1 - Math.exp(-dt*8)); look.y += (lookT.y - look.y)*(1 - Math.exp(-dt*8));
    hover += (hoverT - hover)*(1 - Math.exp(-dt*6));
    think += (thinkT - think)*(1 - Math.exp(-dt*3));
    spin += dt*(1 + think*4 + hover*0.6);
    U.uTime.value = t; U.uSpin.value = spin; U.uThink.value = think; U.uHover.value = hover;
    U.uLook.value.set(look.x, -look.y);
    var bob = reduce ? 0 : Math.sin(t*1.3)*R*0.03;
    orb.position.y = -C.y - bob;
    ui.style.setProperty("--ex", (look.x*R*0.2).toFixed(1) + "px");
    ui.style.setProperty("--ey", (look.y*R*0.14 + bob).toFixed(1) + "px");
    renderer.render(scene, camera);
  }
  function frame(){ if (!visible) { raf = null; return; } render(clock.getElapsedTime()); raf = requestAnimationFrame(frame); }
  var hero = document.querySelector(".hero");
  new IntersectionObserver(function(es){ visible = es[0].isIntersecting; if (visible && !raf && !reduce) raf = requestAnimationFrame(frame); }).observe(hero);
  window.addEventListener("scroll", function(){ scrollP = Math.min(1, Math.max(0, window.scrollY/(hero.offsetHeight || 1))); canvas.style.opacity = ui.style.opacity = String(1 - scrollP*0.6); }, {passive:true});
  window.addEventListener("resize", layout);
  layout();
  if (reduce) { ui.dataset.mode = "eyes"; render(0); }
  else { raf = requestAnimationFrame(frame); ui.dataset.mode = "eyes"; later(function(){ say(["Hi", "I’m TraceAI"], function(){ mode("eyes"); }); }, 1600); }
  return {
    setFocus: function(){},
    setThinking: function(on){
      thinkT = on ? 1 : 0;
      if (on) { busy = true; clear(); ui.dataset.mode = "text"; current = "text"; textEl.textContent = "Working on it"; textEl.classList.remove("big"); textEl.classList.add("in", "dots"); }
      else { busy = false; textEl.classList.remove("dots"); say(["Done"], function(){ mode("eyes"); ui.dataset.mode = "happy"; setTimeout(function(){ if (current === "eyes") ui.dataset.mode = "eyes"; }, 1600); }); }
      if (reduce) render(clock.getElapsedTime());
    }
  };
}

/* start the hero */
scene3d = initScene();
fillBars(document.querySelector(".rd-view"));

/* ==========================================================================
   4. Barbell
   Every person plotted between burnout and drift. Click a pin or a name to
   see their signals and the suggested play.
   ========================================================================== */
/* sample people: name, zone index, position on the bar, signals and suggested plays */
var PEOPLE = [
  {n:"Arjun M.", z:0, x:-4.25, sig:["After-hours load 34h/month","Weekend pings 6 in 4 weeks","Focus decay −38% over 6 weeks"], play:["Break reminders on","After-hours boundary at 19:00","Lead 1:1 prompt (sustained 3+ weeks)"]},
  {n:"Alex K.", z:0, x:-3.6, sig:["Meeting density 64% of week","Break skipping 6 days running","Focus decay −29% over 6 weeks"], play:["Auto break reminders","Meeting-load cap suggested for next sprint"]},
  {n:"Pat R.", z:0, x:-2.95, sig:["After-hours load 27h/month","Weekend pings 4 in 4 weeks","Focus decay −31% over 6 weeks"], play:["Break reminders on","After-hours boundary at 18:30","Lead 1:1 prompt"]},
  {n:"Dev V.", z:1, x:-1.95, sig:["After-hours load 22h/month","Meeting density 58% of week","Break skipping 4 days running"], play:["Early warning at 3 weeks","Workload handoff suggested"]},
  {n:"Ravi M.", z:2, x:-0.95, sig:["After-hours load 9h/month","Deep work 12h/week","Output at baseline"], play:["Maintenance only — no intervention needed"]},
  {n:"Neha K.", z:2, x:-0.32, sig:["Deep work 14h/week","Standup attendance 5 of 5","Output at baseline"], play:["Maintenance only — no intervention needed"]},
  {n:"Kaysha S.", z:2, x:0.32, sig:["Deep work 11h/week","Focus blocks matched to tracked work","Output +6%"], play:["Maintenance only — no intervention needed"]},
  {n:"Vikram S.", z:2, x:0.95, sig:["Deep work 10h/week","Standup attendance 4 of 5","Output at baseline"], play:["Maintenance only — no intervention needed"]},
  {n:"Arun P.", z:3, x:1.95, sig:["Deep work 7h/week","Output −22% from baseline","Focus blocks with no tracked work"], play:["Re-engagement nudge","Check for a blocker before capacity is raised"]},
  {n:"Solomon K.", z:4, x:2.95, sig:["Deep work 5h/week","Output −48% from baseline","1:1s canceled twice"], play:["Re-engagement nudge","Anonymous blockers surfaced to lead"]},
  {n:"Kimmy R.", z:4, x:3.6, sig:["Deep work 4h/week","Standup attendance 2 of 5","Output −55% from baseline"], play:["Re-engagement nudge","Anonymous blockers surfaced to lead","Consent check before individual data"]},
  {n:"Mohan V.", z:5, x:4.25, sig:["Deep work 3h/week","Output −58% from baseline","Calendar ghosting on 1:1s"], play:["Re-engagement nudge","Consent check before individual data is shown"]}
];
/* the six zones from burnout to drift: [label, color] */
var ZONES = [["Burnout risk","#EE6A5E"],["Approaching burnout","#F2A43C"],["Balanced","#38CC63"],["Approaching drift","#4CC2F0"],["Drift","#3A63FF"],["Drift risk","#6E5BFF"]];
var bbSel = 0, bbScene = null;
/* show person i in the side panel and highlight their pin */
function bbPick(i){
  bbSel = i; var p = PEOPLE[i], z = ZONES[p.z];
  document.getElementById("bp-name").textContent = p.n;
  var pos = document.getElementById("bp-pos"); pos.textContent = z[0]; pos.style.color = z[1]; pos.style.setProperty("--lg-tint", z[1] + "2e");
  document.getElementById("bp-sig").innerHTML = p.sig.map(function(s){ return "<li>" + s + "</li>"; }).join("");
  document.getElementById("bp-play").innerHTML = p.play.map(function(s){ return "<li>" + s + "</li>"; }).join("");
  var card = document.querySelector(".bb-person"); card.classList.remove("swap"); void card.offsetWidth; card.classList.add("swap");
  if (bbScene) bbScene.select(i);
}

/* draws the barbell and its pins; returns {select(i)} */
function initBarbell(){
  /* 2D barbell: two plate stacks, a gradient bar from burnout to drift, every person pinned at their place */
  var stage = document.getElementById("bb-stage");
  function initials(n){ var p = n.replace(".", "").split(" "); return (p[0][0] + (p[1] ? p[1][0] : "")).toUpperCase(); }
  var pos = [], acc = 0;
  PEOPLE.forEach(function(p, i){ if (i && p.z !== PEOPLE[i-1].z) acc += 0.9; pos.push(acc); acc += 1; });
  var span = pos[pos.length - 1];
  pos = pos.map(function(v){ return 5 + v/span*90; });
  var zonesUsed = [];
  PEOPLE.forEach(function(p, i){ var z = zonesUsed[zonesUsed.length - 1]; if (!z || z.z !== p.z) zonesUsed.push({z:p.z, a:pos[i], b:pos[i]}); else z.b = pos[i]; });
  var html = '<div class="bb2">' +
    '<div class="bb2-plates l" aria-hidden="true"><i></i><i></i><i></i><span>Burnout end</span></div>' +
    '<div class="bb2-track"><div class="bb2-bar" aria-hidden="true"></div>' +
    PEOPLE.map(function(p, i){
      var pct = pos[i], c = ZONES[p.z][1];
      return '<button type="button" class="bb2-pin ' + (i % 2 ? "dn" : "up") + '" data-i="' + i + '" style="left:' + pct.toFixed(2) + '%;--c:' + c + '" aria-label="' + p.n + ', ' + ZONES[p.z][0] + '"><b>' + initials(p.n) + '</b><em>' + p.n + '</em></button>';
    }).join("") +
    '<div class="bb2-scale" aria-hidden="true">' + zonesUsed.map(function(z){ var one = z.b - z.a < 1, short = ["Burnout risk","Approaching","Balanced","Approaching","Drift","Drift risk"][z.z]; return '<span class="' + (one ? "one" : "") + '" style="left:' + (z.a - 2.6).toFixed(2) + '%;width:' + (z.b - z.a + 5.2).toFixed(2) + '%;--c:' + ZONES[z.z][1] + '"><small>' + short + '</small></span>'; }).join("") + '</div>' +
    '</div>' +
    '<div class="bb2-plates r" aria-hidden="true"><i></i><i></i><i></i><span>Drift end</span></div>' +
    '</div>';
  stage.insertAdjacentHTML("beforeend", html);
  var pins = stage.querySelectorAll(".bb2-pin");
  pins.forEach(function(b){ b.addEventListener("click", function(){ bbPick(Number(b.dataset.i)); }); });
  return { select: function(i){ pins.forEach(function(b, j){ b.classList.toggle("on", j === i); b.setAttribute("aria-pressed", j === i); }); } };
}

/* start the barbell */
bbScene = initBarbell();
bbPick(0);

/* ==========================================================================
   5. Lifecycle
   Desktop: the section is pinned and the five stages advance as you scroll,
   so none are skipped. Mobile (<= 760px): panels are simply stacked.
   ========================================================================== */
(function(){
  var tabs = document.querySelectorAll(".life-track [role=tab]"), panels = document.querySelectorAll(".life-panel"), fill = document.getElementById("life-fill");
  var box = document.getElementById("life-scroll"), stepEl = document.getElementById("life-step"), cur = -1;
  var pinned = function(){ return window.innerWidth > 760; };
  function pick(i, focus){
    if (i === cur && !focus) return; cur = i;
    tabs.forEach(function(t, j){ var on = j === i; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; t.classList.toggle("past", j < i); });
    panels.forEach(function(p, j){ p.hidden = j !== i; });
    stepEl.textContent = i + 1;
    if (focus) tabs[i].focus({preventScroll:true});
  }
  function range(){ var r = box.getBoundingClientRect(), top = r.top + window.scrollY; return {top:top, len:Math.max(1, box.offsetHeight - window.innerHeight)}; }
  function onScroll(){
    if (!pinned()) return;
    var g = range(), p = Math.min(1, Math.max(0, (window.scrollY - g.top)/g.len));
    fill.style.width = (p*100) + "%";
    pick(Math.min(4, Math.floor(p*5)));
  }
  function goTo(i){
    if (!pinned()) { pick(i); return; }
    var g = range(); window.scrollTo({top:g.top + (i + 0.5)/5*g.len, behavior: reduce ? "auto" : "smooth"});
  }
  tabs.forEach(function(t, i){
    t.addEventListener("click", function(){ goTo(i); });
    t.addEventListener("keydown", function(e){
      var n = null;
      if (e.key === "ArrowRight") n = Math.min(4, i+1); if (e.key === "ArrowLeft") n = Math.max(0, i-1);
      if (e.key === "Home") n = 0; if (e.key === "End") n = 4;
      if (n !== null) { e.preventDefault(); pick(n, true); goTo(n); }
    });
  });
  window.addEventListener("scroll", onScroll, {passive:true});
  window.addEventListener("resize", onScroll);
  pick(0); onScroll();
  /* live timer in the Monitor stage */
  var tick = document.getElementById("live-tick"), secs = 24*60 + 12;
  setInterval(function(){ if (document.getElementById("lp-2").hidden) return; secs++; var h = Math.floor(secs/3600), m = Math.floor(secs/60)%60, s = secs%60; tick.textContent = (h<10?"0":"")+h+":"+(m<10?"0":"")+m+":"+(s<10?"0":"")+s; }, 1000);
})();

/* ==========================================================================
   6. Questions
   WHAT / WHY / WHEN ... tabs; each shows a module answer and a sample dashboard.
   ========================================================================== */
(function(){
  var Q = [
    {w:"WHAT", m:"Productivity Management", q:"What is my team’s productivity? How does Alex compare to his team?", h:"Productivity management gives you the what.", b:"TeamTrace’s productivity management software answers both with focus, deep work and on-time delivery, not keyboard noise, then gives you the tools to compare, coach and act."},
    {w:"WHY", m:"Employee Monitoring", q:"Why do some employees show high productivity while others show low?", h:"Employee monitoring gives you the why.", b:"TeamTrace’s employee monitoring software shows the apps, sites, idle stretches and work patterns behind every score, across remote, hybrid and office teams, with privacy controls you set."},
    {w:"WHEN", m:"Insider Risk Monitoring", q:"Seeing warning signs in employee monitoring? That is when you switch this on.", h:"Warning signs in employee monitoring? Switch on insider risk monitoring.", b:"When employee monitoring surfaces a warning sign, switch on insider risk monitoring for that person, a team or the whole company. TeamTrace’s insider risk management then runs insider threat detection and data loss prevention at the device, so a risk is stopped while it is still a signal, not found after the data has gone."},
    {w:"WHERE", m:"Project & Task Management", q:"Where does every project, task and budget stand right now?", h:"Project status you never have to chase.", b:"Most project tools only know what people remember to update. In TeamTrace, every task is linked to the time and activity behind it, so progress is evidence, not opinion. Plan sprints, assign work and watch budgets in task management software that already knows the effort."},
    {w:"HOW LONG", m:"Time Tracking & Attendance", q:"How long did the work take, and who was in, out or on leave?", h:"Timesheets that fill themselves. Attendance that runs itself.", b:"Every working hour lands on the right project, task and activity as it happens. With time and attendance software built into the same platform, payroll, client billing and utilization all start from one verified number, and nobody rebuilds their week from memory."},
    {w:"WHO", m:"Resource Management", q:"Who is free, who is stretched, and who has the skills?", h:"The right people on the right projects, before work runs late.", b:"TeamTrace’s resource management software answers from real hours instead of guesses, so workforce planning happens now, not in next month’s firefight."},
    {w:"HOW", m:"Workforce Analytics", q:"How is the organization performing, from one person to the whole company?", h:"One version of the truth, from team lead to boardroom.", b:"Every module shares the same data, so every report agrees with every other report. TeamTrace’s workforce analytics software takes you from one person to a team, a department or the whole organization, with numbers nobody argues with."}
  ];
  var list = document.getElementById("qs-list"), panel = document.getElementById("qs-panel");
  var tag = document.getElementById("qs-tag"), body = document.getElementById("qs-body"), link = document.getElementById("qs-link"), dash = document.getElementById("qs-dash");
  /* ---------- product-screen dashboards (recreated from the real TeamTrace app, sample data) ---------- */
  function av(t, h){ return '<i class="av" style="--h:' + h + '">' + t + '</i>'; }
  function who(t, h, label){ return '<b class="qd-who">' + av(t, h) + label + '</b>'; }
  function kpis(list, cls){ return '<div class="qd-kpis' + (cls ? " " + cls : "") + '">' + list.map(function(k){ return '<div><small>' + k[0] + '</small><b>' + k[1] + '</b></div>'; }).join("") + '</div>'; }
  function card(title, inner, cls){ return '<div class="qd-card' + (cls ? " " + cls : "") + '"><p class="qd-ct">' + title + '</p>' + inner + '</div>'; }
  /* half-circle gauge: p = 0..1 */
  function gauge(p, label, c){ return '<div class="qd-gauge" style="--p:' + p + ';--c:' + c + '"><div class="arc"><i></i></div><b>' + label + '</b><small>' + Math.round(p * 100) + '%</small></div>'; }
  /* pie / donut from [label, value text, share %, color] */
  function ring(parts, center, sub, donut){
    var acc = 0, stops = parts.map(function(x){ var a = acc; acc += x[2]; return x[3] + " " + a + "% " + acc + "%"; }).join(",");
    return '<div class="qd-ringrow"><div class="qd-ring' + (donut ? " donut" : "") + '" style="--g:conic-gradient(' + stops + ')">' + (center ? '<b>' + center + '</b><small>' + sub + '</small>' : "") + '</div>' +
      '<ul class="qd-legend">' + parts.map(function(x){ return '<li><i style="background:' + x[3] + '"></i>' + x[0] + '<b>' + x[1] + '</b></li>'; }).join("") + '</ul></div>';
  }
  /* small line chart, values 40..100 */
  function line(series, labels){
    function pts(v){ return v.map(function(y, i){ return (i * 200 / (v.length - 1)).toFixed(1) + "," + ((100 - y) / 60 * 74 + 3).toFixed(1); }).join(" "); }
    return '<svg class="qd-line" viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40H200M0 77H200" stroke="rgba(255,255,255,.08)" stroke-width="1" vector-effect="non-scaling-stroke"/>' +
      series.map(function(s){ return '<polyline points="' + pts(s[0]) + '" fill="none" stroke="' + s[1] + '" stroke-width="2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>'; }).join("") + '</svg>' +
      '<div class="qd-x">' + labels.map(function(l){ return "<span>" + l + "</span>"; }).join("") + '</div>';
  }
  /* table: head = [labels], rows = [[cells]]; a cell starting with "@" is a person "@INITIALS|hue|Name" */
  function table(head, rows, numFrom){
    return '<div class="qd-tbl"><table class="qd-table"><thead><tr>' + head.map(function(h, i){ return '<th' + (i >= numFrom ? ' class="num"' : '') + '>' + h + '</th>'; }).join("") + '</tr></thead><tbody>' +
      rows.map(function(r){ return '<tr>' + r.map(function(c, i){
        var html = typeof c === "string" && c.charAt(0) === "@" ? (function(p){ return '<span class="pp">' + av(p[0], p[1]) + p[2] + '</span>'; })(c.slice(1).split("|")) : c;
        return '<td' + (i >= numFrom ? ' class="num"' : '') + '>' + html + '</td>'; }).join("") + '</tr>'; }).join("") + '</tbody></table></div>';
  }
  function kbCard(id, kind, title, date, people, comments, pri, tag){
    var icon = {High:"arrow-up", Medium:"equals", Low:"arrow-down"};
    return '<article class="kb-card"><p class="kb-id"><i class="kb-type ' + kind + '"></i><b>' + id + '</b>' + TTIcon("dots-three-vertical", "kb-more") + '</p><h5>' + title + '</h5>' +
      '<p class="kb-date">' + TTIcon("calendar-blank") + date + '</p><div class="kb-foot"><span class="kb-avs">' + people.map(function(p){ return '<i style="--h:' + p[1] + '">' + p[0] + '</i>'; }).join("") + '</span>' +
      '<span class="kb-cm">' + TTIcon("chat-circle") + comments + '</span>' + (pri ? '<span class="kb-pri ' + pri.toLowerCase() + '">' + TTIcon(icon[pri]) + pri + '</span>' : "") + '</div>' +
      (tag ? '<span class="kb-tag' + (tag === "Done" ? " ok" : "") + '">' + tag + '</span>' : "") + '</article>';
  }
  function hourRows(rows){ return '<div class="eng-rows">' + rows.map(function(r){ return '<div class="eng-row"><span>' + r[0] + '</span><div class="eng-seg">' + r[1].map(function(s){ return '<i class="' + s[0] + '" style="flex:' + s[1] + '"></i>'; }).join("") + '</div></div>'; }).join("") + '</div>'; }
  var LEG = '<div class="ux-leg"><span><i class="f"></i>Focused</span><span><i class="a"></i>Active</span><span><i class="i"></i>Idle</span><span><i class="b"></i>Break</span></div>';

  var DASH = [
    /* Productivity Management: the person Overview screen */
    '<div class="db-h">' + who("AK", 205, "Alex K. &middot; Overview") + '<span class="db-chip">Last week</span></div>' +
    kpis([["Work hours", "38h 12m"], ["Activity", "74%"], ["Idle", "3h 02m"], ["Breaks", "2h 12m"]]) +
    '<div class="qd-two">' +
      card("Work hours vs department", '<div class="qd-gauges">' + gauge(.84, "Alex K.", "#4CC2F0") + gauge(.76, "Department", "#3A63FF") + '</div>') +
      card('Activity level<span class="ux-leg"><span><i class="me"></i>Alex</span><span><i class="dep"></i>Dept</span></span>',
           line([[[62, 70, 66, 76, 74, 81, 78], "#4CC2F0"], [[60, 63, 64, 66, 63, 68, 67], "#6E8DFF"]], ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])) +
    '</div>',

    /* Employee Monitoring: the Engagement screen */
    '<div class="db-h">' + who("AK", 205, "Alex K. &middot; Engagement") + '<span class="db-chip">Today</span></div>' +
    kpis([["Daily mood", TTIcon("smiley") + "Good"], ["Check in", "09:02 AM"], ["Check out", "06:10 PM"], ["Avg. activity", "78%"]]) +
    '<div class="qd-two">' +
      card("Active vs idle", ring([["Active", "82%", 82, "#4CC2F0"], ["Idle", "18%", 18, "rgba(242,164,60,.85)"]], "82%", "active", true)) +
      card("Applications used", ring([["VS Code", "2h 18m", 44, "#4CC2F0"], ["Teams", "1h 01m", 20, "#3A63FF"], ["Chrome", "48m", 15, "#9B6BFF"], ["Figma", "32m", 11, "#38CC63"], ["Others", "29m", 10, "#5E6A8E"]])) +
    '</div>' +
    hourRows([["09&ndash;10 AM", [["f", 38], ["a", 14], ["i", 8]]], ["10&ndash;11 AM", [["a", 8], ["f", 26], ["i", 6], ["b", 8], ["f", 12]]], ["11&ndash;12 PM", [["f", 30], ["a", 16], ["i", 5], ["f", 9]]]]) + LEG,

    /* Insider Risk Monitoring */
    '<div class="db-h"><b>Insider risk</b><span class="db-tog"><i></i>On for Sales team</span></div>' +
    '<ul class="db-alerts"><li class="hi"><i></i><span>Bulk file copy to USB blocked<small>Laptop SL-14, 2 min ago</small></span><em>High</em></li><li class="md"><i></i><span>Upload to personal cloud drive<small>Chrome, 18 min ago</small></span><em>Medium</em></li><li class="lo"><i></i><span>After-hours access to client folder<small>Yesterday, 23:12</small></span><em>Low</em></li></ul>',

    /* Project & Task Management: the Board screen */
    '<div class="db-h"><span class="ux-tabs"><span>' + TTIcon("list") + 'List</span><span class="on">' + TTIcon("kanban") + 'Board</span><span>' + TTIcon("calendar-blank") + 'Calendar</span><span>' + TTIcon("chart-bar-horizontal") + 'Gantt</span></span><span class="db-chip">Billing revamp</span></div>' +
    '<div class="kb qd-board">' +
      '<div class="kb-col"><p class="kb-h"><i style="--c:#F2A43C"></i>To Do<em>34</em></p>' + kbCard("#TT-8410", "bug", "Invoice totals round incorrectly", "No date", [["AK", 205], ["NK", 160]], 0, "Medium") + '</div>' +
      '<div class="kb-col"><p class="kb-h"><i style="--c:#4CC2F0"></i>In Progress<em>93</em></p>' + kbCard("#TT-8408", "task", "Payout reconciliation job", "Thu, 07:00 PM", [["KS", 280]], 1, "High") + '</div>' +
      '<div class="kb-col"><p class="kb-h"><i style="--c:#9B6BFF"></i>Testing<em>53</em></p>' + kbCard("#TT-8378", "task", "Usage alerts API", "Fri, 07:00 PM", [["AK", 205]], 1, "High", "Done") + '</div>' +
    '</div>',

    /* Time Tracking & Attendance: the Time & Activity Summary report */
    '<div class="db-h"><b>Time &amp; activity summary</b><span class="db-chip">Last week</span></div>' +
    '<div class="qd-filters">' + ["Branch", "Department", "Project", "People"].map(function(f){ return '<span>' + f + TTIcon("caret-down") + '</span>'; }).join("") + '</div>' +
    table(["People", "Leaves", "Allocated", "Logged", "Idle", "Days"], [
      ["@AK|205|Alex K.", "0", "40h", "38h 12m", "1h 14m", "5"],
      ["@NR|330|Neha R.", "1", "32h", "31h 40m", "52m", "4"],
      ["@RM|30|Ravi M.", "0", "40h", "41h 05m", "2h 08m", "5"],
      ["@TS|280|Tara S.", "0.5", "36h", "34h 22m", "1h 31m", "4.5"],
      ["@AP|160|Arun P.", "0", "40h", "36h 48m", "3h 02m", "5"]
    ], 1) +
    '<div class="qd-foot"><span>Showing 1&ndash;5 of 114</span><span class="qd-pager"><i class="on">1</i><i>2</i><i>3</i><i>&hellip;</i><i>23</i></span></div>',

    /* Resource Management: the Skill Search screen */
    '<div class="db-h"><b>Skill search</b><span class="db-chip">' + TTIcon("sliders-horizontal") + 'Filter</span></div>' +
    '<div class="qd-search">' + TTIcon("magnifying-glass") + 'Skills<span class="tok">React</span><span class="tok">AWS</span></div>' +
    table(["Employee", "Job title", "Skills", "Projects", "Hrs/wk"], [
      ["@NR|330|Neha R.", "Sr. Frontend Developer", '<span class="qd-skill">React, TypeScript<em>+9</em></span>', "3", '<span class="hot">38</span>'],
      ["@RM|30|Ravi M.", "Full Stack Developer", '<span class="qd-skill">React, Node.js<em>+12</em></span>', "2", "32"],
      ["@AP|160|Arun P.", "DevOps Engineer", '<span class="qd-skill">AWS, Terraform<em>+7</em></span>', "4", '<span class="hot">40</span>'],
      ["@TS|280|Tara S.", "Product Designer", '<span class="qd-skill">Figma, React<em>+6</em></span>', "1", '<span class="free">20</span>'],
      ["@KT|120|Kabir T.", "Jr. ML Engineer", '<span class="qd-skill">Python, AWS<em>+5</em></span>', "1", '<span class="free">12</span>']
    ], 3) +
    '<div class="qd-foot"><span>Showing 1&ndash;5 of 110</span><span class="ux-leg"><span><i style="background:#4CC2F0"></i>Free</span><span><i style="background:#F2A43C"></i>Stretched</span></span></div>',

    /* Workforce Analytics: the Consolidated Work Summary report */
    '<div class="db-h"><b>Consolidated work summary</b><span class="db-chip">Today &middot; by work</span></div>' +
    kpis([["Total time", "80h 14m"], ["Average activity", "76%"]], "two") +
    '<div class="qd-two">' +
      card("Activity", ring([["Activity ex. idle", "91%", 91, "#4CC2F0"], ["Idle", "9%", 9, "rgba(242,164,60,.85)"]])) +
      card("Project / task / activity", ring([["Project", "40%", 40, "#3A63FF"], ["Task", "2%", 2, "#F2A43C"], ["Activity", "58%", 58, "#4CC2F0"]], "", "", true)) +
    '</div>' +
    card("Total hours by person", '<div class="qd-hbars">' + [3.0, 2.6, 2.4, 2.0, 2.0, 1.9, 1.8, 1.8, 1.7, 1.5].map(function(v, i){ return '<span style="--h:' + Math.round(v / 3 * 100) + '%;--n:' + i + '"><i></i><em>' + v.toFixed(1) + '</em></span>'; }).join("") + '</div>' +
      '<div class="qd-hx">' + ["Alex", "Neha", "Ravi", "Tara", "Arun", "Maya", "Dev", "Omar", "Ella", "Kabir"].map(function(n){ return "<span>" + n + "</span>"; }).join("") + '</div>')
  ];

  list.innerHTML = Q.map(function(x, i){ return '<button role="tab" id="qt-' + i + '" aria-controls="qs-panel" aria-selected="' + (i===0) + '" tabindex="' + (i===0?0:-1) + '"><span class="w">' + x.w + '</span><span class="m">' + x.m.replace("&","&amp;") + '</span><span class="q">' + x.q + '</span></button>'; }).join("");
  var btns = list.querySelectorAll("button");
  function pick(i, focus){
    btns.forEach(function(b, j){ var on = j === i; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; });
    var x = Q[i];
    tag.textContent = x.m; body.textContent = x.b; dash.innerHTML = DASH[i]; link.textContent = "Explore " + x.m.replace("&", "and").toLowerCase() + " →";
    panel.setAttribute("aria-labelledby", "qt-" + i);
    panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap");
    if (focus) btns[i].focus();
  }
  btns.forEach(function(b, i){
    b.addEventListener("click", function(){ pick(i); });
    b.addEventListener("keydown", function(e){
      var n = null;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") n = (i+1)%7; if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = (i+6)%7;
      if (n !== null) { e.preventDefault(); pick(n, true); }
    });
  });
  pick(0);
})();

/* ==========================================================================
   7. Siloed -> unified: circuit board
   Draws the SVG wiring between the four source systems, the hub and the outputs,
   and toggles data-state 0 (siloed) / 1 (unified). Connects itself once when first seen.
   ========================================================================== */
(function(){
  var stage = document.getElementById("silo"), svg = document.getElementById("circ-svg"), status = document.getElementById("silo-status"), btns = document.querySelectorAll(".silo-seg button");
  var HUB = {x:600, y:320, w:200, h:168};
  var SRC = [{x:300,y:130,s:1,v:-1},{x:300,y:510,s:1,v:1},{x:900,y:130,s:-1,v:-1},{x:900,y:510,s:-1,v:1}];
  var SW = 220, OW = 230;
  var OUT = [{x:140,y:320,s:-1},{x:1060,y:320,s:1}];
  function P(deg){ var a = deg*Math.PI/180; return {x:HUB.x + HUB.r*Math.cos(a), y:HUB.y + HUB.r*Math.sin(a), nx:Math.cos(a), ny:Math.sin(a)}; }
  var wires = "", pulses = "", pins = "", n = 0;
  function f(v){ return v.toFixed(1); }
  function add(d, p0, p1){
    wires += '<path class="wire" d="' + d + '"/>';
    pulses += '<path class="pulse" pathLength="100" d="' + d + '" style="--d:' + (2.2 + (n*0.37)%1.4).toFixed(2) + 's;--dl:-' + ((n*0.61)%2.4).toFixed(2) + 's"/>';
    pins += '<circle class="pin" cx="' + f(p0.x) + '" cy="' + f(p0.y) + '" r="3"/><circle class="pin" cx="' + f(p1.x) + '" cy="' + f(p1.y) + '" r="3"/>';
    n++;
  }
  /* circuit-trace routing: straight runs joined by rounded 45° bends, bundles stay parallel */
  function route(pts, radii){
    var d = "M" + f(pts[0].x) + " " + f(pts[0].y);
    for (var i = 1; i < pts.length - 1; i++){
      var p = pts[i-1], c = pts[i], q = pts[i+1];
      var l1 = Math.hypot(c.x - p.x, c.y - p.y), l2 = Math.hypot(q.x - c.x, q.y - c.y);
      var u1 = {x:(c.x - p.x)/l1, y:(c.y - p.y)/l1}, u2 = {x:(q.x - c.x)/l2, y:(q.y - c.y)/l2};
      var th = Math.acos(Math.max(-1, Math.min(1, u1.x*u2.x + u1.y*u2.y)));
      if (th < 1e-3) continue;
      var r = typeof radii === "number" ? radii : radii[i-1], tt = Math.tan(th/2), t = Math.min(r*tt, l1*0.48, l2*0.48); r = t/tt;
      var A = {x:c.x - u1.x*t, y:c.y - u1.y*t}, B = {x:c.x + u2.x*t, y:c.y + u2.y*t};
      var sweep = (u1.x*u2.y - u1.y*u2.x) > 0 ? 1 : 0;
      d += " L" + f(A.x) + " " + f(A.y) + " A" + f(r) + " " + f(r) + " 0 0 " + sweep + " " + f(B.x) + " " + f(B.y);
    }
    var e = pts[pts.length - 1];
    return d + " L" + f(e.x) + " " + f(e.y);
  }

  /* four systems feed the record: each wire runs out flat, then turns 90° on a rounded corner
     and drops straight into the hub. The bundle stays evenly spaced and nested through the turn. */
  SRC.forEach(function(c){
    var s = c.s, dy = -c.v, sx = c.x + s*SW/2, X0 = HUB.x - s*52, edge = HUB.y + c.v*HUB.h/2;
    for (var k=0;k<4;k++){
      var L = (k - 1.5)*15, y = c.y + L, x = X0 - dy*s*L;
      var start = {x:sx, y:y}, end = {x:x, y:edge};
      add(route([start, {x:x, y:y}, end], 30), start, end);
    }
  });
  /* the record produces the organization-level answers: flat, a rounded step outwards, flat again */
  OUT.forEach(function(o){
    var hs = [-33, -11, 11, 33], es = [-64, -42, 42, 64], order = [0, 1, 1, 0];
    for (var k=0;k<4;k++){
      var sy = HUB.y + hs[k], sxh = HUB.x + o.s*HUB.w/2, ex = o.x - o.s*OW/2, ey = o.y + es[k];
      var jx = (sxh + ex)/2 + o.s*(order[k] - 0.5)*22;
      add(route([{x:sxh, y:sy}, {x:jx, y:sy}, {x:jx, y:ey}, {x:ex, y:ey}], 14), {x:sxh, y:sy}, {x:ex, y:ey});
    }
  });
  svg.innerHTML = wires + pulses + pins;

  function scale(){ stage.style.setProperty("--u", Math.max(0.6, stage.clientWidth/1200).toFixed(3)); }
  window.addEventListener("resize", scale); scale();

  var STAT = ["Four systems. Zero shared context. · Every answer requires a manual join", "One platform. One continuous trace. · Every answer without a manual join"];
  function count(el, to, suf){
    if (reduce) { el.textContent = to + suf; return; }
    var t0 = performance.now();
    (function step(now){ if (stage.dataset.state !== "1") return; var p = Math.min(1, (now - t0)/1100), e = 1 - Math.pow(1-p, 3); el.textContent = Math.round(to*e) + suf; if (p < 1) requestAnimationFrame(step); })(t0);
  }
  function set(v){
    btns.forEach(function(b){ b.setAttribute("aria-pressed", b.dataset.silo === String(v)); });
    stage.dataset.state = v; status.textContent = STAT[v];
    stage.querySelectorAll(".cn.out").forEach(function(o){
      var b = o.querySelector("b"), s = o.querySelector("span");
      s.textContent = v ? s.dataset.b : s.dataset.a;
      if (v) count(b, Number(b.dataset.u), b.dataset.suf); else b.textContent = "— unknown —";
    });
  }
  btns.forEach(function(b){ b.addEventListener("click", function(){ set(Number(b.dataset.silo)); }); });
  /* it connects itself once, shortly after the board scrolls into view:
     as soon as its top edge passes 70% of the screen height (rootMargin -30% at the bottom),
     after a brief 350ms pause so the siloed state is seen first */
  if (!reduce && "IntersectionObserver" in window) {
    new IntersectionObserver(function(es, ob){ if (es[0].isIntersecting) { ob.disconnect(); setTimeout(function(){ if (stage.dataset.state === "0") set(1); }, 350); } }, {rootMargin:"0px 0px -30% 0px", threshold:0}).observe(stage);
  }
})();

/* ==========================================================================
   8. TraceAI memory
   An orb of rings (WebGL shader) that grows sharper with every day of use.
   The day slider (1-180) drives the orb and the sample answer.
   ========================================================================== */
(function(){
  var wrap = document.getElementById("mem-orb"), canvas = document.getElementById("mem-canvas"), range = document.getElementById("mem-range"), dayEl = document.getElementById("mem-day");
  var st = document.getElementById("mem-st"), txt = document.getElementById("mem-txt"), out = document.getElementById("mem-out");
  var STAGES = [
    [1, "Learning your patterns", "Not enough history yet. Collecting how your teams actually work."],
    [15, "Pattern found", "The Design team’s focus dips every Thursday afternoon."],
    [60, "Drift spotted early", "Arun P.’s deep work fell 22% over three weeks, before anyone raised it."],
    [120, "Remedy prescribed", "Suggested for Arun P.: a re-engagement nudge, and a check for a blocker before his capacity is raised."]
  ];
  var dayT = 1/180, view = null;

  if (window.THREE) try {
    var renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true, alpha:true, premultipliedAlpha:true});
    renderer.setClearColor(0, 0); renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    var scene = new THREE.Scene(), camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
    var U = {uTime:{value:0}, uDay:{value:0}, uLook:{value:new THREE.Vector2()}, uHover:{value:0}};
    var FS = [
      "uniform float uTime; uniform float uDay; uniform vec2 uLook; uniform float uHover; varying vec2 vUv;",
      "float hash(float n){ return fract(sin(n)*43758.5453); }",
      "float hash2(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }",
      "void main(){",
      "  vec2 p = (vUv - 0.5)*2.0; float r = length(p), a = atan(p.y, p.x), t = uTime;",
      "  float sharp = smoothstep(0.0, 1.0, uDay);",
      "  vec3 c = vec3(0.0);",
      /* six memory layers: each appears as days accumulate, starting blurry and wobbly, ending crisp */
      "  for (int i = 0; i < 6; i++){",
      "    float fi = float(i);",
      "    float vis = smoothstep(fi/6.8, fi/6.8 + 0.14, uDay);",
      "    float rad = 0.2 + fi*0.115;",
      "    float wob = mix(0.06, 0.014, sharp)*sin(a*2.0 + t*(0.4 + fi*0.12) + fi*1.7) + mix(0.03, 0.006, sharp)*sin(a*3.0 - t*0.3 + fi);",
      "    vec2 off = mix(0.0, 0.018, sharp)*vec2(cos(t*0.5 + fi*1.3), sin(t*0.6 + fi*2.1));",
      "    float rr2 = length(p - off);",
      "    float wid = mix(0.075, 0.02, sharp);",
      "    float d = rr2 - rad - wob;",
      "    float band = exp(-d*d/(wid*wid));",
      "    float side = pow(0.5 + 0.5*sin(a*(fi < 3.0 ? 1.0 : -1.0) + t*(0.35 + fi*0.08) + fi*2.3), 1.4);",
      "    float look = 0.7 + 0.5*dot(normalize(p + 1e-4), uLook);",
      "    float fil = mix(1.0, 0.55 + 0.45*sin((r + 0.01*sin(a*5.0 + t))*320.0), sharp*0.8);",
      "    vec3 col = fi < 0.5 ? vec3(0.62,0.4,1.0) : (fi < 1.5 ? vec3(0.3,0.42,1.0) : (fi < 2.5 ? vec3(0.28,0.85,1.0) : (fi < 3.5 ? vec3(0.4,0.5,1.0) : vec3(0.3,0.88,1.0))));",
      "    col = mix(col, vec3(0.3,0.95,0.55), smoothstep(0.75, 1.0, uDay)*step(4.5, fi));",
      "    c += col*band*vis*(0.3 + 1.1*side)*look*fil*(0.9 + 0.9*sharp);",
      "  }",
      /* signals drifting in from outside and being absorbed */
      "  for (int j = 0; j < 18; j++){",
      "    float fj = float(j);",
      "    if (fj > 5.0 + uDay*13.0) continue;",
      "    float ang = hash(fj*7.3)*6.2832 + t*(0.12 + hash(fj)*0.15);",
      "    float rr = 0.95 - fract(hash(fj*3.1) + t*(0.05 + hash(fj*1.9)*0.06))*0.8;",
      "    vec2 q = vec2(cos(ang), sin(ang))*rr;",
      "    float g = exp(-dot(p - q, p - q)/0.0007);",
      "    c += mix(vec3(0.6,0.75,1.0), vec3(0.45,1.0,0.7), step(0.6, hash(fj*5.0)))*g*0.9*smoothstep(0.1, 0.3, rr);",
      "  }",
      /* private boundary: a fine dashed circle, no data crosses it */
      "  float bd = exp(-pow((r - 0.9)/0.006, 2.0))*step(0.45, fract(a*36.0/6.2832));",
      "  c += vec3(0.4,0.55,1.0)*bd*0.5;",
      /* nucleus: grows and brightens as memory accumulates */
      "  float nr = 0.07 + 0.05*sharp;",
      "  c += vec3(0.55,0.85,1.0)*exp(-r*r/(nr*nr))*(0.6 + 0.6*sharp)*(1.0 + 0.15*sin(t*2.0));",
      "  c += vec3(0.2,0.35,1.0)*exp(-max(r - 0.3, 0.0)*5.0)*0.1*(1.0 + uHover);",
      "  c += vec3(0.25,0.45,1.0)*exp(-pow((r - 0.8)/0.12, 2.0))*0.22*sharp*(1.0 + uHover*0.8);",
      "  vec3 col = 1.0 - exp(-c*1.6);",
      "  col += (hash2(vUv*512.0 + fract(t)) - 0.5)*0.015;",
      "  float m = max(max(c.r, c.g), c.b);",
      "  float alpha = clamp(1.0 - exp(-m*2.6), 0.0, 1.0)*smoothstep(1.0, 0.93, r);",
      "  gl_FragColor = vec4(col*smoothstep(1.0, 0.93, r), alpha);",
      "}"].join("\n");
    var mat = new THREE.ShaderMaterial({uniforms:U, transparent:true, premultipliedAlpha:true, depthWrite:false,
      vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }", fragmentShader:FS});
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
    var look = {x:0, y:0}, lookT = {x:0, y:0}, hov = 0, hovT = 0, day = 1/180, clock = new THREE.Clock(), last = 0, visible = false, raf = null;
    function size(){ var s = wrap.clientWidth; if (s) renderer.setSize(s, s, false); }
    window.addEventListener("resize", size); size();
    window.addEventListener("pointermove", function(e){
      if (!visible) return;
      var r = wrap.getBoundingClientRect(), dx = e.clientX - (r.left + r.width/2), dy = e.clientY - (r.top + r.height/2), d = Math.sqrt(dx*dx + dy*dy) || 1;
      var k = Math.min(1, d/(r.width*0.9)); lookT.x = dx/d*k; lookT.y = -dy/d*k; hovT = d < r.width*0.5 ? 1 : 0;
    }, {passive:true});
    function frame(){
      if (!visible) { raf = null; return; }
      var t = clock.getElapsedTime(), dt = Math.min(0.05, t - last); last = t;
      day += (dayT - day)*(1 - Math.exp(-dt*4));
      look.x += (lookT.x - look.x)*(1 - Math.exp(-dt*6)); look.y += (lookT.y - look.y)*(1 - Math.exp(-dt*6));
      hov += (hovT - hov)*(1 - Math.exp(-dt*5));
      U.uTime.value = reduce ? 4 : t; U.uDay.value = day; U.uLook.value.set(look.x, look.y); U.uHover.value = hov;
      renderer.render(scene, camera);
      raf = reduce ? null : requestAnimationFrame(frame);
    }
    view = function(){ if (!raf) raf = requestAnimationFrame(frame); };
    new IntersectionObserver(function(es){ visible = es[0].isIntersecting; if (visible) view(); }).observe(wrap);
  } catch(e) { view = null; }

  function render(d){
    dayEl.textContent = d; dayT = d/180;
    var s = STAGES[0]; STAGES.forEach(function(x){ if (d >= x[0]) s = x; });
    if (st.textContent !== s[1]) { st.textContent = s[1]; txt.textContent = s[2]; out.classList.remove("swap"); void out.offsetWidth; out.classList.add("swap"); }
    out.style.filter = "blur(" + Math.max(0, 3 - d/20) + "px)"; out.style.opacity = 0.55 + Math.min(0.45, d/120);
    if (view) view();
  }
  range.addEventListener("input", function(){ range.dataset.touched = 1; render(Number(range.value)); });
  render(1);
  if (!reduce && "IntersectionObserver" in window) {
    new IntersectionObserver(function(es, ob){
      if (!es[0].isIntersecting) return; ob.disconnect();
      var t0 = performance.now();
      (function step(now){ if (range.dataset.touched) return; var p = Math.min(1, (now - t0)/3600), d = Math.max(1, Math.round(130*(1 - Math.pow(1-p, 2)))); range.value = d; render(d); if (p < 1) requestAnimationFrame(step); })(t0);
    }, {threshold:.5}).observe(wrap);
  } else { range.value = 130; render(130); }
})();

/* ==========================================================================
   9. Analytics
   One metric system at four altitudes. The switch (#levels) picks an altitude
   and renders its sample dashboard into #an: KPI tiles, a chart panel and a
   detail panel. data-l: 3 = Individual, 2 = Team, 1 = Department, 0 = Organization.
   All numbers are sample data.
   ========================================================================== */
(function(){
  var an = document.getElementById("an");
  if (!an) return;
  var title = document.getElementById("an-title"), chips = document.getElementById("an-chips"), body = document.getElementById("an-body");
  var levelBtns = document.querySelectorAll("#levels button"), pill = document.getElementById("lv-pill");

  /* sample dashboards, one per altitude */
  var VIEWS = {
    3: {
      who:"Alex M.", what:"Individual analytics", chips:[["Role-based"], ["Sprint 14", "g"]],
      kpis:[["Focus index", "74", "+9 vs personal baseline", "up"], ["On-time completion", "92%", "11 of 12 tasks"], ["Deep work", "3.1h", "per day, average"], ["Shallow hours", "2.4h", "+0.6 this week", "dn"]],
      chart:{t:"Focus index by day", chip:["Last 12 days", "b"], v:[42, 55, 28, 61, 70, 33, 48, 82, 64, 57, 30, 72], low:40,
             x:["M","T","W","T","F","M","T","W","T","F","M","T"]},
      side:{t:"Work mix", chip:["This week"], donut:[46, 68, "68%", "in the zone"],
            rows:[["Focused sessions", "19.4h", null, "#4CC2F0"], ["Shallow hours", "12.1h", null, "#3A63FF"], ["Negative work", "2.2h", null, "#5E6A8E"]]}
    },
    2: {
      who:"Platform team", what:"Team analytics", chips:[["System"], ["12 members", "g"]],
      kpis:[["In the zone", "8/12", "+2 this sprint", "up"], ["Burning out", "1", "Priya, 62h last week", "", "red"], ["Drifting", "3", "below their own baseline", "", "blue"], ["Sprint completion", "78%", "+10 pts", "up"]],
      chart:{t:"Focus index by member", chip:["vs team median", "b"], v:[88, 74, 62, 34, 70, 58, 66, 82, 52, 28, 64, 60], low:40, median:true,
             x:["MS","PR","AK","DV","RM","NK","TS","AJ","VS","KP","SR","LB"]},
      side:{t:"Workload spread", chip:["Allocated hours"],
            rows:[["Priya R.", "62h", 92, "#EE6A5E", "red"], ["Arun K.", "58h", 84, "#F2A43C", "amber"], ["Mohan S.", "41h", 60], ["Devika V.", "38h", 52, "#38CC63"]]}
    },
    1: {
      who:"Engineering", what:"Department analytics", chips:[["Custom"], ["6 squads", "g"]],
      kpis:[["Focus index", "68", "+6 vs last quarter", "up"], ["On-time delivery", "84%", "+4 pts", "up"], ["Capacity used", "91%", "above plan", "dn"], ["Squads at risk", "2", "Support, Data"]],
      chart:{t:"Squad comparison", chip:["Focus index", "b"], v:[72, 86, 64, 38, 58, 70], low:45,
             x:["Core","Platform","Mobile","Support","Data","Infra"]},
      side:{t:"Capacity by squad", chip:["This quarter"],
            rows:[["Core", "86%", 86], ["Platform", "97%", 97, "#F2A43C", "amber"], ["Support", "74%", 74, "#EE6A5E", "red"], ["Data", "69%", 69]]}
    },
    0: {
      who:"Your organization", what:"Org-wide analytics", chips:[["System"], ["4 departments", "g"]],
      kpis:[["Org focus index", "71", "+11 since Q1", "up"], ["On-time delivery", "82%", "+7 pts", "up"], ["Hours lost to drift", "−38%", "vs last quarter", "up"], ["Departments at risk", "1", "Customer Ops"]],
      heat:{t:"Focus index, department × week", chip:["12 weeks", "b"], rows:["Engineering", "Design", "Customer Ops", "Sales"], risk:2},
      side:{t:"Top signals", chip:["Live", "g"],
            rows:[["Customer Ops · drift", "+9 pts", null, null, "red", "#EE6A5E"], ["Engineering · deep work", "+2.4h", null, null, "green", "#38CC63"], ["Platform · sprint slip", "2 tasks", null, null, "", "#F2A43C"], ["Support · tenure cohort", "New hires", null, null, "", "#6E8DFF"], ["Sales · meeting load", "34%", null, null, "", "#6E8DFF"]]}
    }
  };

  function chip(c){ return '<span class="an-chip' + (c[1] ? " " + c[1] : "") + '">' + c[0] + "</span>"; }

  /* KPI tiles: [label, value, note, note class, value class] */
  function kpis(list){
    return '<div class="an-kpis">' + list.map(function(k){
      return '<div class="an-kpi"><small>' + k[0] + '</small><b' + (k[4] ? ' class="' + k[4] + '"' : "") + ">" + k[1] + "</b><em" + (k[3] ? ' class="' + k[3] + '"' : "") + ">" + k[2] + "</em></div>";
    }).join("") + "</div>";
  }

  /* bar chart: tallest bar highlighted, bars under `low` dimmed, optional median line */
  function bars(c){
    var max = Math.max.apply(null, c.v), sorted = c.v.slice().sort(function(a, b){ return a - b; });
    var med = (sorted[Math.floor((sorted.length - 1)/2)] + sorted[Math.ceil((sorted.length - 1)/2)]) / 2;
    var html = '<div class="an-bars">' + c.v.map(function(v, i){
      var cls = v === max ? "hi" : v < c.low ? "lo" : "";
      return '<span class="' + cls + '" style="--h:' + v + '%;--n:' + i + '"><i></i><em>' + v + "</em></span>";
    }).join("");
    if (c.median) html += '<div class="an-med" style="--m:calc((100% - 22px) * ' + (med/100) + ')"></div>';
    html += '</div><div class="an-x">' + c.x.map(function(x){ return "<span>" + x + "</span>"; }).join("") + "</div>";
    return html + '<div class="an-leg"><span><i style="background:#4CC2F0"></i>Best</span><span><i style="background:#3A63FF"></i>On track</span><span><i style="background:#5E6A8E"></i>Below baseline</span>' +
      (c.median ? '<span><i class="dash"></i>Team median ' + med + '</span>' : "") + '</div>';
  }

  /* heatmap: one row per department, one cell per week (seeded, so it is the same every time) */
  function heat(h){
    var seed = 7;
    function rnd(){ seed = (seed*1103515245 + 12345) & 0x7fffffff; return seed/0x7fffffff; }
    var n = 0, html = '<div class="an-heat">';
    h.rows.forEach(function(name, r){
      html += "<div><span>" + name + "</span>";
      for (var c = 0; c < 12; c++){
        var v = Math.min(.95, .25 + rnd()*.4 + c*.025), risk = r === h.risk && c > 7;
        html += '<i class="' + (risk ? "risk" : "") + '" style="--v:' + v.toFixed(2) + ";--n:" + (n++) + '" title="' + name + ", week " + (c + 1) + '"></i>';
      }
      html += "</div>";
    });
    html += '<div class="wk"><span></span>' + [1,2,3,4,5,6,7,8,9,10,11,12].map(function(w){ return "<em>" + (w === 1 || w % 4 === 0 ? "W" + w : "") + "</em>"; }).join("") + "</div></div>";
    return html + '<div class="an-leg"><span><i style="background:rgba(76,194,240,.85)"></i>High focus</span><span><i style="background:rgba(76,194,240,.3)"></i>Low focus</span><span><i style="background:#C9564C"></i>Drift risk</span></div>';
  }

  /* detail panel: optional donut, then rows [label, value, meter %, meter color, value class, signal color] */
  function side(s){
    var html = "";
    if (s.donut) html += '<div class="an-donut" style="--a:' + s.donut[0] + "%;--b:" + s.donut[1] + '%"><div><b>' + s.donut[2] + "</b><small>" + s.donut[3] + "</small></div></div>";
    html += '<ul class="an-rows">' + s.rows.map(function(r){
      var label = r[5] ? '<span class="sig" style="--c:' + r[5] + '">' + r[0] + "</span>" : r[3] && !r[2] ? '<span class="sig" style="--c:' + r[3] + '">' + r[0] + "</span>" : "<span>" + r[0] + "</span>";
      return "<li>" + label + "<b" + (r[4] ? ' class="' + r[4] + '"' : "") + ">" + r[1] + "</b>" + (r[2] ? '<i style="--w:' + r[2] + "%" + (r[3] ? ";--c:" + r[3] : "") + '"></i>' : "") + "</li>";
    }).join("") + "</ul>";
    return html;
  }

  function panel(t, chipDef, inner, cls){ return '<div class="an-panel' + (cls ? " " + cls : "") + '"><div class="an-ph"><b>' + t + "</b>" + chip(chipDef) + "</div>" + inner + "</div>"; }

  var cur = null;
  function render(l){
    var v = VIEWS[l];
    cur = l;
    title.innerHTML = v.who + " <small>· " + v.what + "</small>";
    chips.innerHTML = v.chips.map(chip).join("");
    var main = v.heat ? panel(v.heat.t, v.heat.chip, heat(v.heat)) : panel(v.chart.t, v.chart.chip, bars(v.chart), "chart");
    body.innerHTML = kpis(v.kpis) + '<div class="an-cols">' + main + panel(v.side.t, v.side.chip, side(v.side)) + "</div>" +
      '<p class="an-note"><span class="dot" aria-hidden="true"></span>Same metric, same formula, from one person to the whole organization.</p>';
    /* replay the entrance animation */
    body.style.animation = "none"; void body.offsetWidth; body.style.animation = "";
    levelBtns.forEach(function(b){ b.setAttribute("aria-pressed", Number(b.dataset.l) === l); });
    movePill();
    /* light up the Dashboards / Analytics / Reports items that apply to this altitude */
    document.querySelectorAll(".alt-col li[data-l]").forEach(function(li){ li.classList.toggle("hl", li.dataset.l.split(" ").indexOf(String(l)) > -1); });
  }

  /* slide the highlight pill under the selected altitude */
  function movePill(){ var on = document.querySelector('#levels button[aria-pressed="true"]'); if (on) { pill.style.left = on.offsetLeft + "px"; pill.style.width = on.offsetWidth + "px"; } }

  levelBtns.forEach(function(b){ b.addEventListener("click", function(){ var l = Number(b.dataset.l); if (l !== cur) render(l); }); });
  var rt; window.addEventListener("resize", function(){ clearTimeout(rt); rt = setTimeout(movePill, 150); });
  render(3);
})();

/* ==========================================================================
   10. Profit cards
   Cards fade in one after another as they scroll into view.
   ========================================================================== */
(function(){
  var cards = document.querySelectorAll(".pf");
  if (reduce || !("IntersectionObserver" in window)) { cards.forEach(function(c){ c.classList.add("in"); }); return; }
  var ob = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting) { var i = Array.prototype.indexOf.call(cards, e.target); e.target.style.transitionDelay = (i*60) + "ms"; e.target.classList.add("in"); ob.unobserve(e.target); } });
  }, {threshold:.2});
  cards.forEach(function(c){ ob.observe(c); });
})();

})();
