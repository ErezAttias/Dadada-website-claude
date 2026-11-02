/* dadada V9.1 · image swap: click (or drop a file on) any picture to try another one in its place.
   Choices live in this browser (IndexedDB) and replace that picture everywhere on the site;
   "Export picks" downloads a ZIP of the new images plus a CSV saying what replaces what. */
(function () {
  "use strict";
  var map = {}, on = false, target = null, persist = true;

  // ---------- storage ----------
  var dbp = new Promise(function (res) {
    try {
      var rq = indexedDB.open("dadada-swap", 1);
      rq.onupgradeneeded = function () { rq.result.createObjectStore("swaps"); };
      rq.onsuccess = function () { res(rq.result); };
      rq.onerror = function () { persist = false; res(null); };
    } catch (e) { persist = false; res(null); }
  });
  function idb(mode, fn) { return dbp.then(function (db) { if (!db) return null; return new Promise(function (res, rej) { var tx = db.transaction("swaps", mode), st = tx.objectStore("swaps"), r = fn(st); tx.oncomplete = function () { res(r && r.result); }; tx.onerror = function () { rej(tx.error); }; }); }); }
  var put = function (k, v) { return idb("readwrite", function (s) { return s.put(v, k); }).catch(function () { persist = false; }); };
  var del = function (k) { return idb("readwrite", function (s) { return s.delete(k); }).catch(function () {}); };
  var clearAll = function () { return idb("readwrite", function (s) { return s.clear(); }).catch(function () {}); };
  function loadAll() {
    return dbp.then(function (db) {
      if (!db) return;
      return new Promise(function (res) {
        var out = [], tx = db.transaction("swaps", "readonly"), cur = tx.objectStore("swaps").openCursor();
        cur.onsuccess = function () { var c = cur.result; if (c) { out.push([c.key, c.value]); c.continue(); } else res(out); };
        cur.onerror = function () { res(out); };
      }).then(function (rows) { rows.forEach(function (r) { if (r[1] && r[1].blob) map[r[0]] = { blob: r[1].blob, name: r[1].name, url: URL.createObjectURL(r[1].blob) }; }); });
    });
  }

  // ---------- which picture is which: the file path inside the site, e.g. media/hero.webp ----------
  function keyOf(u) {
    if (!u || /^(blob|data):/.test(u)) return null;
    try { var p = new URL(u, location.href).pathname; } catch (e) { return null; }
    var m = p.match(/\/9(?:\.1)?\/(.+)$/); return m ? decodeURIComponent(m[1]) : null;
  }
  function origOf(el) {
    if (el.tagName === "VIDEO") { if (el.dataset.swapOrig) return el.dataset.swapOrig; return el.getAttribute("poster") || ""; }
    return el.dataset.swapOrig || el.getAttribute("src") || el.getAttribute("data-src") || "";
  }

  // ---------- apply swaps to the page ----------
  function applyEl(el) {
    var orig = origOf(el), k = keyOf(orig), m = k && map[k];
    if (el.tagName === "IMG") {
      if (m) { if (!el.dataset.swapOrig) el.dataset.swapOrig = orig; if (el.getAttribute("src") !== m.url) { el.removeAttribute("srcset"); el.setAttribute("src", m.url); } el.classList.add("swapped"); }
      else if (el.dataset.swapOrig) { var o = el.dataset.swapOrig; delete el.dataset.swapOrig; el.classList.remove("swapped"); el.setAttribute("src", o); }
    } else if (el.tagName === "VIDEO") {
      if (m) {
        if (!el.dataset.swapOrig) el.dataset.swapOrig = orig;
        if (el.getAttribute("poster") !== m.url) el.setAttribute("poster", m.url);
        el.classList.add("swapped");
        var had = false; el.querySelectorAll("source[src]").forEach(function (s) { s.dataset.swapSrc = s.getAttribute("src"); s.removeAttribute("src"); had = true; });
        if (had || el.currentSrc) { try { el.pause(); el.load(); } catch (e) {} }
      } else if (el.dataset.swapOrig) {
        el.setAttribute("poster", el.dataset.swapOrig); delete el.dataset.swapOrig; el.classList.remove("swapped");
        var back = false; el.querySelectorAll("source").forEach(function (s) { if (s.dataset.swapSrc) { s.setAttribute("src", s.dataset.swapSrc); delete s.dataset.swapSrc; back = true; } });
        if (back) { try { el.load(); el.play().catch(function () {}); } catch (e) {} }
      }
    }
  }
  var raf = 0;
  function applyAll() { raf = 0; document.querySelectorAll("img, video").forEach(applyEl); bar(); }
  function soon() { if (!raf) raf = requestAnimationFrame(applyAll); }
  new MutationObserver(function (list) {
    for (var i = 0; i < list.length; i++) { var r = list[i]; if (r.type === "childList" ? r.addedNodes.length : true) { soon(); return; } }
  }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["src", "poster"] });

  // ---------- UI ----------
  var css = document.createElement("style");
  css.textContent = [
    ".sw-bar{position:fixed;z-index:2147483000;left:max(12px,env(safe-area-inset-left,0px));bottom:max(12px,env(safe-area-inset-bottom,0px));display:flex;flex-wrap:wrap;align-items:center;gap:8px;max-width:calc(100vw - 24px);padding:8px;border-radius:14px;background:#111827;color:#fff;font:600 13px/1.2 Inter,system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.25)}",
    ".sw-bar button{appearance:none;border:0;border-radius:9px;padding:9px 12px;font:inherit;cursor:pointer;background:#273244;color:#fff}",
    ".sw-bar button:hover{background:#334158}.sw-bar button:focus-visible{outline:2px solid #8fb0ff;outline-offset:2px}",
    ".sw-bar .sw-tog[aria-pressed=true]{background:#4f6bed}",
    ".sw-bar .sw-n{padding:0 6px;color:#c7cfdb;font-weight:500}",
    ".sw-bar .sw-help{flex-basis:100%;padding:2px 6px 0;color:#9aa6b8;font-weight:500;font-size:12px}",
    ".sw-bar [hidden],.sw-pop[hidden],.sw-hi[hidden]{display:none!important}",
    ".sw-hi{position:fixed;z-index:2147482999;pointer-events:none;border:3px solid #4f6bed;border-radius:4px;box-shadow:0 0 0 9999px rgba(17,24,39,.18);transition:all .08s}",
    ".sw-hi span{position:absolute;left:-3px;top:-3px;transform:translateY(-100%);background:#4f6bed;color:#fff;font:600 12px/1 Inter,system-ui,sans-serif;padding:6px 8px;border-radius:4px 4px 0 0;white-space:nowrap}",
    ".sw-hi.drop{border-color:#22a06b}.sw-hi.drop span{background:#22a06b}",
    "html.sw-on img, html.sw-on video{pointer-events:auto!important;cursor:copy!important}",
    ".sw-pop{position:fixed;z-index:2147483001;right:max(12px,env(safe-area-inset-right,0px));bottom:max(76px,calc(env(safe-area-inset-bottom,0px) + 76px));width:min(320px,calc(100vw - 24px));padding:14px;border-radius:14px;background:#fff;color:#111827;font:500 13px/1.4 Inter,system-ui,sans-serif;box-shadow:0 18px 50px rgba(0,0,0,.28);display:grid;gap:10px}",
    ".sw-pop img{width:100%;height:150px;object-fit:contain;background:#f3f4f6;border-radius:8px}",
    ".sw-pop b{font-weight:700;word-break:break-all}.sw-pop small{color:#6b7280}",
    ".sw-pop .row{display:flex;gap:8px;flex-wrap:wrap}",
    ".sw-pop button{appearance:none;border:1px solid #e5e7eb;border-radius:9px;padding:9px 12px;font:600 13px Inter,system-ui,sans-serif;cursor:pointer;background:#fff;color:#111827}",
    ".sw-pop button.pri{background:#111827;border-color:#111827;color:#fff}",
    ".sw-pop button:focus-visible{outline:2px solid #4f6bed;outline-offset:2px}",
    ".sw-pop .x{position:absolute;right:8px;top:8px;border:0;padding:4px 8px;font-size:16px}"
  ].join("");
  document.head.appendChild(css);

  var barEl = document.createElement("div"); barEl.className = "sw-bar"; barEl.setAttribute("role", "region"); barEl.setAttribute("aria-label", "Image swap");
  barEl.innerHTML = '<button type="button" class="sw-tog" aria-pressed="false">Swap images</button><span class="sw-n"></span><button type="button" class="sw-exp">Export picks</button><button type="button" class="sw-rst">Reset all</button><span class="sw-help" hidden>Click any picture to replace it, or drag an image file onto it. It changes everywhere that picture is used. Menus and links keep working, so you can move between pages.</span>';
  var tog = barEl.querySelector(".sw-tog"), nEl = barEl.querySelector(".sw-n"), help = barEl.querySelector(".sw-help");
  var hi = document.createElement("div"); hi.className = "sw-hi"; hi.hidden = true; hi.innerHTML = "<span>Click to replace</span>";
  var pop = document.createElement("div"); pop.className = "sw-pop"; pop.hidden = true; pop.setAttribute("role", "dialog"); pop.setAttribute("aria-label", "Replace picture");
  var file = document.createElement("input"); file.type = "file"; file.accept = "image/*"; file.hidden = true;
  function mount() { document.body.appendChild(barEl); document.body.appendChild(hi); document.body.appendChild(pop); document.body.appendChild(file); bar(); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);

  function bar() {
    var n = Object.keys(map).length;
    nEl.textContent = n ? n + " replaced" + (persist ? "" : " (not saved after refresh)") : "";
    barEl.querySelector(".sw-exp").hidden = !n; barEl.querySelector(".sw-rst").hidden = !n;
  }
  function setOn(v) { on = v; tog.setAttribute("aria-pressed", v); tog.textContent = v ? "Done swapping" : "Swap images"; help.hidden = !v; document.documentElement.classList.toggle("sw-on", v); if (!v) { hi.hidden = true; closePop(); } }
  tog.addEventListener("click", function () { setOn(!on); });

  // the picture under the pointer: the top visible <img> or <video> at that point
  function mediaAt(x, y) {
    var els = document.elementsFromPoint(x, y);
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (barEl.contains(el) || pop.contains(el)) return null;
      if (el.tagName !== "IMG" && el.tagName !== "VIDEO") continue;
      var cs = getComputedStyle(el), r = el.getBoundingClientRect();
      if (cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05 || r.width < 12 || r.height < 12) continue;
      if (!keyOf(origOf(el))) continue;
      return el;
    }
    return null;
  }
  function show(el, drop) {
    if (!el) { hi.hidden = true; return; }
    var r = el.getBoundingClientRect();
    hi.hidden = false; hi.classList.toggle("drop", !!drop);
    hi.style.left = r.left + "px"; hi.style.top = r.top + "px"; hi.style.width = r.width + "px"; hi.style.height = r.height + "px";
    hi.firstChild.textContent = drop ? "Drop to replace" : (map[keyOf(origOf(el))] ? "Replaced · click to change" : "Click to replace");
  }
  var lastMove = 0;
  document.addEventListener("pointermove", function (e) { if (!on || e.pointerType === "touch") return; var t = Date.now(); if (t - lastMove < 40) return; lastMove = t; show(mediaAt(e.clientX, e.clientY)); }, true);
  addEventListener("scroll", function () { if (on) hi.hidden = true; }, true);

  // clicks in swap mode pick a picture instead of following links
  // only when there is a picture under the pointer; everything else (menus, links, tabs) keeps working
  function swallow(e) { if (!on || barEl.contains(e.target) || pop.contains(e.target) || !mediaAt(e.clientX, e.clientY)) return; e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); }
  ["pointerdown", "mousedown", "pointerup", "mouseup"].forEach(function (t) { document.addEventListener(t, swallow, true); });
  document.addEventListener("click", function (e) {
    if (!on || barEl.contains(e.target) || pop.contains(e.target)) return;
    var el = mediaAt(e.clientX, e.clientY); if (!el) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); openPop(el);
  }, true);

  // drag an image file from the desktop straight onto a picture
  document.addEventListener("dragover", function (e) {
    if (!e.dataTransfer || [].indexOf.call(e.dataTransfer.types || [], "Files") < 0) return;
    var el = mediaAt(e.clientX, e.clientY); if (!el) { hi.hidden = true; return; }
    e.preventDefault(); e.dataTransfer.dropEffect = "copy"; show(el, true);
  }, true);
  document.addEventListener("dragleave", function (e) { if (!e.relatedTarget) hi.hidden = true; }, true);
  document.addEventListener("drop", function (e) {
    var el = mediaAt(e.clientX, e.clientY), f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    hi.hidden = true; if (!el || !f) return;
    e.preventDefault(); e.stopPropagation();
    if (!/^image\//.test(f.type)) return;
    swap(keyOf(origOf(el)), f);
  }, true);

  function uses(k) { var n = 0; document.querySelectorAll("img, video").forEach(function (el) { if (keyOf(origOf(el)) === k) n++; }); return n; }
  function openPop(el) {
    target = keyOf(origOf(el)); var m = map[target], orig = origOf(el);
    pop.innerHTML = '<button type="button" class="x" aria-label="Close">×</button><img alt="" src="' + (m ? m.url : orig) + '">' +
      "<div><b>" + esc(target) + "</b><br><small>" + (m ? "Replaced with " + esc(m.name) : "Original picture") + " · used " + uses(target) + "× on this page" + (el.tagName === "VIDEO" ? " · this is a film; a picture will show in its place" : "") + "</small></div>" +
      '<div class="row"><button type="button" class="pri up">' + (m ? "Choose another image" : "Upload new image") + "</button>" + (m ? '<button type="button" class="rs">Back to original</button>' : "") + "</div>";
    pop.hidden = false;
    pop.querySelector(".x").onclick = closePop;
    pop.querySelector(".up").onclick = function () { file.value = ""; file.click(); };
    if (m) pop.querySelector(".rs").onclick = function () { reset(target); closePop(); };
    pop.querySelector(".up").focus();
  }
  function closePop() { pop.hidden = true; target = null; }
  file.addEventListener("change", function () { var f = file.files && file.files[0]; if (f && target) { swap(target, f); closePop(); } });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { if (!pop.hidden) closePop(); else if (on) setOn(false); } });

  function swap(k, f) {
    if (!k || !f) return;
    if (map[k]) URL.revokeObjectURL(map[k].url);
    map[k] = { blob: f, name: f.name || "image", url: URL.createObjectURL(f) };
    put(k, { blob: f, name: f.name || "image", at: Date.now() });
    applyAll();
  }
  function reset(k) { var m = map[k]; if (!m) return; delete map[k]; del(k); applyAll(); setTimeout(function () { URL.revokeObjectURL(m.url); }, 1000); }
  barEl.querySelector(".sw-rst").addEventListener("click", function () {
    var b = this; if (b.dataset.sure !== "1") { b.dataset.sure = "1"; b.textContent = "Reset all? Click again"; setTimeout(function () { b.dataset.sure = ""; b.textContent = "Reset all"; }, 3000); return; }
    b.dataset.sure = ""; b.textContent = "Reset all";
    var old = map; map = {}; clearAll(); applyAll(); setTimeout(function () { Object.keys(old).forEach(function (k) { URL.revokeObjectURL(old[k].url); }); }, 1000);
  });

  // ---------- export: a ZIP (stored, no compression) with the new images + picks.csv ----------
  var CRC = (function () { var t = new Uint32Array(256); for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(u8) { var c = 0xffffffff; for (var i = 0; i < u8.length; i++) c = CRC[(c ^ u8[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
  function zip(files) {
    var enc = new TextEncoder(), parts = [], central = [], off = 0;
    files.forEach(function (f) {
      var name = enc.encode(f.name), d = f.data, crc = crc32(d), h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
      h.setUint32(14, crc, true); h.setUint32(18, d.length, true); h.setUint32(22, d.length, true); h.setUint16(26, name.length, true);
      parts.push(new Uint8Array(h.buffer), name, d);
      var c = new DataView(new ArrayBuffer(46));
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true);
      c.setUint32(16, crc, true); c.setUint32(20, d.length, true); c.setUint32(24, d.length, true); c.setUint16(28, name.length, true); c.setUint32(42, off, true);
      central.push(new Uint8Array(c.buffer), name);
      off += 30 + name.length + d.length;
    });
    var csize = central.reduce(function (s, a) { return s + a.length; }, 0), e = new DataView(new ArrayBuffer(22));
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, csize, true); e.setUint32(16, off, true);
    return new Blob(parts.concat(central, [new Uint8Array(e.buffer)]), { type: "application/zip" });
  }
  barEl.querySelector(".sw-exp").addEventListener("click", function () {
    var keys = Object.keys(map); if (!keys.length) return;
    var rows = [["picture on the site", "replace with"]], jobs = keys.map(function (k, i) {
      var m = map[k], ext = (m.name.match(/\.[a-z0-9]+$/i) || [".jpg"])[0].toLowerCase();
      var nm = String(i + 1).padStart(2, "0") + "-" + k.replace(/^.*\//, "").replace(/\.[a-z0-9]+$/i, "") + ext;
      rows.push([k, nm + " (was " + m.name + ")"]);
      return m.blob.arrayBuffer().then(function (b) { return { name: "picks/" + nm, data: new Uint8Array(b) }; });
    });
    Promise.all(jobs).then(function (files) {
      var csv = rows.map(function (r) { return r.map(function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(","); }).join("\r\n");
      files.push({ name: "picks/picks.csv", data: new TextEncoder().encode("﻿" + csv) });
      var a = document.createElement("a"), u = URL.createObjectURL(zip(files));
      a.href = u; a.download = "dadada-image-picks.zip"; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
    });
  });

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  loadAll().then(applyAll, applyAll);
})();
