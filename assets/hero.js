// AmpAI hero: Ryan's S02 print, scanned flat, then tilted into 3D while each circuit traces out
// from the panel with its wires lifted off the sheet. Data: Ryan's own S02 markup (window.S02).
(function () {
  var stage = document.getElementById("hero-stage");
  if (!stage || !window.S02) return;
  var D = window.S02, W = D.w, H = D.h, NS = "http://www.w3.org/2000/svg";

  // Circuit order, colour and breaker (breakers from Ryan's S02 answer key).
  var CIRCUITS = [
    ["Living", "#2563eb", "15 A AFCI"],
    ["Bed", "#f08a24", "15 A AFCI"],
    ["Kitchen 1", "#e11d74", "20 A"],
    ["Kitchen 2", "#0d9488", "20 A"],
    ["Bath outlets", "#7c3aed", "20 A"],
    ["Range", "#dc2626", "40 A 2-pole"],
    ["Dish/disposal", "#0891b2", "15 A 2-pole"],
    ["Micro", "#65a30d", "20 A"],
    ["Dryer", "#166534", "20 A 2-pole"],
    ["Washer", "#475569", "20 A AFCI"],
    ["Water heater", "#a16207", "30 A 2-pole"],
    ["PTAC", "#78716c", "2-pole"]
  ];
  var color = {}, order = {};
  CIRCUITS.forEach(function (c, i) { color[c[0]] = c[1]; order[c[0]] = i; });

  var pos = {}, panel = null;
  D.marks.forEach(function (m) {
    if (m.kind === "panel") { panel = m; pos.P = m; } else pos[m.n] = m;
  });

  // Order each circuit's wires outward from the panel (breadth-first), so they trace like a pull.
  var byCircuit = {};
  D.wires.forEach(function (w) { (byCircuit[w.circuit] = byCircuit[w.circuit] || []).push(w); });
  var segs = [];
  Object.keys(byCircuit).forEach(function (name) {
    var ws = byCircuit[name], adj = {};
    ws.forEach(function (w, i) {
      [w.from, w.to].forEach(function (k) { (adj[k] = adj[k] || []).push(i); });
    });
    var depth = {}, used = {}, queue = [];
    var start = adj.P ? "P" : String(ws[0].from);
    depth[start] = 0; queue.push(start);
    while (queue.length) {
      var k = queue.shift();
      (adj[k] || []).forEach(function (i) {
        if (used[i]) return;
        used[i] = true;
        var w = ws[i], a = String(w.from) === String(k) ? w.from : w.to, b = a === w.from ? w.to : w.from;
        segs.push({ c: name, a: a, b: b, d: depth[k] });
        if (depth[b] === undefined) { depth[b] = depth[k] + 1; queue.push(String(b)); }
      });
    }
    ws.forEach(function (w, i) { if (!used[i]) segs.push({ c: name, a: w.from, b: w.to, d: 0 }); });
  });

  // Build the scene.
  stage.innerHTML = "";
  var scene = el("div", "scene");
  var board = el("div", "board");
  board.style.width = W + "px"; board.style.height = H + "px";
  var sheet = document.createElement("img");
  sheet.src = "assets/s02.png"; sheet.alt = ""; sheet.className = "sheet"; sheet.width = W; sheet.height = H;
  board.appendChild(sheet);

  var shadow = svg("shadow"), lifted = svg("lifted");
  var pins = el("div", "pins"), rings = svg("rings"), labels = el("div", "labels");
  var scan = el("div", "scan");

  var T0 = 3.6, PER = 0.62, STEP = 0.14; // seconds: tracing starts, gap between circuits, per depth level
  var lastEnd = 0;
  segs.forEach(function (s) {
    var A = pos[s.a], B = pos[s.b];
    if (!A || !B) return;
    var len = Math.hypot(B.x - A.x, B.y - A.y);
    var delay = T0 + order[s.c] * PER + s.d * STEP;
    lastEnd = Math.max(lastEnd, delay + 0.5);
    [shadow, lifted].forEach(function (layer) {
      var p = document.createElementNS(NS, "line");
      p.setAttribute("x1", A.x); p.setAttribute("y1", A.y); p.setAttribute("x2", B.x); p.setAttribute("y2", B.y);
      p.setAttribute("stroke", color[s.c] || "#e8892b");
      p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
      p.style.setProperty("--len", len);
      p.style.animationDelay = delay + "s";
      layer.appendChild(p);
    });
  });

  D.marks.forEach(function (m) {
    var isPanel = m.kind === "panel";
    var c = isPanel ? "#12151b" : color[m.circuit] || "#e8892b";
    var reveal = 0.25 + (m.y / H) * 2.0; // the scan line passes over it
    var lit = isPanel ? T0 - 0.3 : T0 + (order[m.circuit] || 0) * PER + 0.15;
    var r = document.createElementNS(NS, "circle");
    r.setAttribute("cx", m.x); r.setAttribute("cy", m.y); r.setAttribute("r", isPanel ? 13 : 11);
    r.setAttribute("class", "ring");
    r.style.animationDelay = reveal + "s";
    rings.appendChild(r);

    var pin = el("i", "pin" + (isPanel ? " pin-p" : ""));
    pin.style.left = m.x + "px"; pin.style.top = m.y + "px";
    pin.style.setProperty("--c", c);
    pin.style.animationDelay = lit + "s";
    pins.appendChild(pin);

    var dot = document.createElementNS(NS, isPanel ? "rect" : "circle");
    if (isPanel) {
      dot.setAttribute("x", m.x - 12); dot.setAttribute("y", m.y - 12);
      dot.setAttribute("width", 24); dot.setAttribute("height", 24); dot.setAttribute("rx", 4);
    } else {
      dot.setAttribute("cx", m.x); dot.setAttribute("cy", m.y); dot.setAttribute("r", 7.5);
    }
    dot.setAttribute("fill", c); dot.setAttribute("class", "node");
    dot.style.animationDelay = lit + "s";
    lifted.appendChild(dot);
  });

  // A few circuit tags that face the camera, at the circuit's first device.
  [["Living", 25], ["Bed", 33], ["Kitchen 1", 4], ["Range", 11]].forEach(function (t) {
    var m = pos[t[1]];
    if (!m) return;
    var info = CIRCUITS[order[t[0]]];
    var tag = el("span", "tag");
    tag.innerHTML = '<b style="background:' + info[1] + '"></b>' + info[0] + " <em>" + info[2] + "</em>";
    tag.style.left = m.x + "px"; tag.style.top = m.y + "px";
    tag.style.animationDelay = (T0 + order[t[0]] * PER + 0.9) + "s";
    labels.appendChild(tag);
  });

  board.appendChild(rings);
  board.appendChild(shadow);
  board.appendChild(pins);
  board.appendChild(lifted);
  board.appendChild(labels);
  board.appendChild(scan);
  scene.appendChild(board);
  stage.appendChild(scene);

  // Legend: circuits appear as they're drawn.
  var legend = el("ol", "legend");
  CIRCUITS.forEach(function (c, i) {
    var li = el("li", "");
    li.innerHTML = '<b style="background:' + c[1] + '"></b><span>' + c[0] + "</span><em>" + c[2] + "</em>";
    li.style.animationDelay = (T0 + i * PER) + "s";
    legend.appendChild(li);
  });
  var hud = el("div", "hud");
  hud.innerHTML =
    '<div class="hud-top"><span class="rec"></span><span class="hud-status">' +
    '<span class="s1">Reading the print</span><span class="s2">Drawing circuits</span><span class="s3">Ready for your check</span>' +
    '</span><span class="hud-sheet">S02 &middot; 1/4" = 1\'-0"</span></div>';
  stage.appendChild(hud);
  stage.appendChild(legend);

  var total = lastEnd + 4.5;
  stage.style.setProperty("--total", total + "s");

  function fit() {
    // Scale the board so the tilted sheet fills the stage.
    var w = scene.clientWidth, h = scene.clientHeight;
    // Footprint of the sheet turned 28 degrees and tipped back 54 degrees (about 1333 x 760 at scale 1).
    var s = Math.min(w / 1333 * (w < 500 ? 1.35 : 1.08), h / 820);
    stage.style.setProperty("--s", s.toFixed(4));
    stage.style.setProperty("--sflat", Math.min(w / W, h / H * 0.98).toFixed(4));
  }
  fit();
  window.addEventListener("resize", fit);

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { stage.classList.add("done"); return; }

  scan.style.setProperty("--h", H + "px");
  var timers = [], running = false;
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function play() {
    timers.forEach(clearTimeout); timers = [];
    stage.classList.remove("play", "tilt", "done");
    stage.setAttribute("data-phase", "1");
    void stage.offsetWidth; // restart CSS animations
    stage.classList.add("play");
    later(function () { stage.classList.add("tilt"); }, 2600);
    later(function () { stage.setAttribute("data-phase", "2"); }, 2600);
    later(function () { stage.setAttribute("data-phase", "3"); }, lastEnd * 1000);
    later(function () { if (running) play(); }, total * 1000 + 2500);
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !running) { running = true; play(); }
        else if (!e.isIntersecting && running) { running = false; }
      });
    }, { threshold: 0.2 }).observe(stage);
  } else { running = true; play(); }

  function el(tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; }
  function svg(cls) {
    var s = document.createElementNS(NS, "svg");
    s.setAttribute("viewBox", "0 0 " + W + " " + H); s.setAttribute("class", "layer " + cls);
    s.setAttribute("aria-hidden", "true");
    return s;
  }
})();
