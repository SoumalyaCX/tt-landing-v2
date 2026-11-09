/* ==========================================================================
   TeamTrace — main.js
   Shared behavior for every page of the TeamTrace website.

   Load on EVERY page, at the end of <body>, before any page script:
     <script src="js/main.js"></script>
     <script src="js/home.js"></script>   <- page-specific

   CONTENTS
     1. Navigation: mobile menu toggle + "scrolled" state
     2. Navigation: dropdown menus (hover on desktop, click/tap everywhere)
     3. Navigation: Product & Solutions mega flyouts (category rail swaps the link panel)
     4. Scroll progress bar
     5. Footer: "Show more" on long link columns
   ========================================================================== */
(function(){
"use strict";

var nav = document.getElementById("nav");
var hoverable = window.matchMedia("(hover: hover)");

/* ==========================================================================
   1. Navigation: mobile menu + scrolled state
   Expects <header class="nav" id="nav"> with a .menu-btn and a .mobile-panel.
   ========================================================================== */
if (nav) (function(){
  var menuBtn = nav.querySelector(".menu-btn");

  /* open / close the mobile menu, keep the button's ARIA state in sync,
     and lock the page behind the panel while it is open */
  function setMobile(open){
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.documentElement.style.overflow = open ? "hidden" : "";
  }
  menuBtn.addEventListener("click", function(){ setMobile(!nav.classList.contains("open")); });

  /* close the mobile menu when one of its links is followed */
  nav.querySelectorAll(".mobile-panel a").forEach(function(a){ a.addEventListener("click", function(){ setMobile(false); }); });

  /* close it if the window grows back to the desktop layout */
  window.addEventListener("resize", function(){ if (window.innerWidth > 1060 && nav.classList.contains("open")) setMobile(false); });

  /* darken the bar once the page has scrolled past 40px */
  function onScrollNav(){ nav.classList.toggle("scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScrollNav, {passive:true}); onScrollNav();
})();

/* ==========================================================================
   2. Navigation: dropdown menus
   Markup: <li class="nav-item" data-dd><button class="nav-link">…</button><div class="dropdown">…</div></li>
   Desktop pointer: opens on hover. Touch / keyboard: opens on click.
   Closes on outside click or Escape. Only one menu is open at a time.
   ========================================================================== */
var ddItems = Array.prototype.slice.call(document.querySelectorAll("[data-dd]"));

/* a short grace period before a hovered menu closes, so a slightly off-course
   pointer (or the gap under the bar) never snaps the menu shut */
var CLOSE_DELAY = 180;
function cancelClose(item){ if (item._ddTimer) { clearTimeout(item._ddTimer); item._ddTimer = null; } }
function setItem(item, open){
  cancelClose(item);
  item.classList.toggle("open", open);
  item.querySelector(".nav-link").setAttribute("aria-expanded", String(open));
}
function closeLater(item){
  cancelClose(item);
  item._ddTimer = setTimeout(function(){ item._ddTimer = null; setItem(item, false); }, CLOSE_DELAY);
}
function closeAll(except){ ddItems.forEach(function(i){ if (i !== except) setItem(i, false); }); }

ddItems.forEach(function(item){
  var btn = item.querySelector(".nav-link");

  btn.addEventListener("click", function(e){
    e.stopPropagation();
    /* with a mouse the menu is already open from hover, so a click keeps it open;
       taps and keyboard presses (e.detail === 0) toggle it */
    var open = (hoverable.matches && e.detail > 0) ? true : !item.classList.contains("open");
    closeAll(item); setItem(item, open);
  });
  item.addEventListener("mouseenter", function(){ if (hoverable.matches) { cancelClose(item); closeAll(item); setItem(item, true); } });
  item.addEventListener("mouseleave", function(){ if (hoverable.matches) closeLater(item); });
  /* after Escape the pointer may still be inside the item, so mouseenter will not
     fire again; mouseover on the button re-opens the menu */
  btn.addEventListener("mouseover", function(){ if (hoverable.matches && !item.classList.contains("open")) { closeAll(item); setItem(item, true); } });

  /* Escape closes the menu and returns focus to its button */
  item.addEventListener("keydown", function(e){
    if (e.key === "Escape" && item.classList.contains("open")) { setItem(item, false); btn.focus(); e.stopPropagation(); }
  });
  /* tabbing out of the menu closes it */
  item.addEventListener("focusout", function(e){ if (!item.contains(e.relatedTarget)) setItem(item, false); });
});

/* a click anywhere outside the menus closes them */
document.addEventListener("click", function(e){ if (!e.target.closest("[data-dd]")) closeAll(); });

/* ==========================================================================
   3. Navigation: mega flyouts (Product, Solutions)
   Each .sol-fly has a rail of tabs (.sol-cat) and one .sol-panel per tab,
   linked by aria-controls. Hovering, focusing or clicking a tab shows its
   panel (class "on"). Arrow keys / Home / End move between tabs.
   ========================================================================== */
document.querySelectorAll(".sol-fly").forEach(function(fly){
  var cats = Array.prototype.slice.call(fly.querySelectorAll(".sol-cat"));

  function setCat(i, focus){
    cats.forEach(function(b, k){
      var on = k === i, panel = document.getElementById(b.getAttribute("aria-controls"));
      b.setAttribute("aria-selected", String(on));
      b.setAttribute("tabindex", on ? "0" : "-1");
      if (panel) panel.classList.toggle("on", on);
      if (on && focus) b.focus();
    });
  }

  cats.forEach(function(b, i){
    b.addEventListener("mouseenter", function(){ setCat(i); });
    b.addEventListener("focus", function(){ setCat(i); });
    b.addEventListener("click", function(e){ e.stopPropagation(); setCat(i); });
    b.addEventListener("keydown", function(e){
      var n = null;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") n = (i + 1) % cats.length;
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = (i - 1 + cats.length) % cats.length;
      if (e.key === "Home") n = 0;
      if (e.key === "End") n = cats.length - 1;
      if (n !== null) { e.preventDefault(); setCat(n, true); }
    });
  });
});

/* ==========================================================================
   4. Scroll progress bar
   Markup: <div class="scroll-progress" id="scroll-progress"><i></i></div>
   Sets the bar width to how far the page has been scrolled (0-100%).
   ========================================================================== */
var bar = document.getElementById("scroll-progress");
if (bar) (function(){
  var fill = bar.querySelector("i"), ticking = false;

  function update(){
    ticking = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    fill.style.width = (p * 100).toFixed(2) + "%";
    bar.classList.toggle("on", p > 0.002);
  }
  /* at most one update per animation frame */
  function request(){ if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  window.addEventListener("scroll", request, {passive:true});
  window.addEventListener("resize", request);
  window.addEventListener("load", request);
  update();
})();


/* ==========================================================================
   5. Footer: "Show more" on long link columns
   Any .f-col with more than LIMIT links shows only the first LIMIT and gets a
   toggle button. To add links, just add <li>s to the column's list.
   ========================================================================== */
var LIMIT = 4;
var CHEVRON = window.TTIcon ? TTIcon("caret-down") : "";
document.querySelectorAll(".f-col").forEach(function(col, i){
  var list = col.querySelector("ul");
  if (!list || list.children.length <= LIMIT) return;
  if (!list.id) list.id = "f-list-" + i;
  var btn = document.createElement("button");
  btn.type = "button"; btn.className = "f-more";
  btn.setAttribute("aria-controls", list.id);
  function set(open){
    col.classList.toggle("collapsed", !open);
    btn.setAttribute("aria-expanded", String(open));
    btn.innerHTML = (open ? "Show less" : "Show more") + " " + CHEVRON;
  }
  btn.addEventListener("click", function(){
    var open = btn.getAttribute("aria-expanded") !== "true";
    set(open);
    /* move keyboard focus to the first newly shown link */
    if (open) { var first = list.children[LIMIT].querySelector("a"); if (first) first.focus({preventScroll:true}); }
  });
  set(false);
  col.appendChild(btn);
});

})();
