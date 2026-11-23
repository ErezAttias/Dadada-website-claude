/* dadada V9 · Bundle & Save: build a nursery piece by piece, the saving grows with every piece */
(function () {
  "use strict";
  var V8 = window.V8, P = V8.P, $ = V8.$, $$ = V8.$$, esc = V8.esc, money = V8.money;
  var KEY = "dd9-bundle";

  var STEPS = [
    { k: "crib", n: "01", t: "The crib", s: "Where every nursery starts.", ids: function () { return V8.list("crib").map(function (p) { return p.id; }); } },
    { k: "dresser", n: "02", t: "The dresser", s: "34 inches tall, so it doubles as a changing table.", ids: function () { return V8.list("dresser").map(function (p) { return p.id; }); } },
    { k: "sleep", n: "03", t: "Sleep", s: "A mattress made for the crib, and the pieces that come after it.", ids: function () { return ["newton", "moonlight", "moses", "kit"]; } },
    { k: "room", n: "04", t: "Finishing touches", s: "Sheets, a changing tray and somewhere to put it all.", ids: function () { return ["sheet-organic", "sheet-muslin", "sheet-knit", "tray-soho", "tray-austin", "baskets"]; } }
  ];

  function load() { try { var v = JSON.parse(sessionStorage.getItem(KEY)); if (Array.isArray(v)) return v.filter(function (x) { return P[x.id]; }); } catch (e) {} return []; }
  function keep(b) { try { sessionStorage.setItem(KEY, JSON.stringify(b)); } catch (e) {} }

  function tile(p) {
    var f0 = p.finishes[0], sw = p.finishes.length > 1 && p.finishes.every(function (f) { return f.sw; });
    return '<li class="bx-item" data-id="' + p.id + '" data-f="0"><div class="bx-im"><img src="' + f0.img + '" alt="' + esc(p.full) + '" loading="lazy"></div>' +
      '<div class="bx-tx"><a class="bx-name" href="' + V8.url(p) + '">' + esc(p.full) + '</a><span class="bx-fin">' + esc(f0.name) + "</span>" +
      (p.finishes.length > 1 ? (sw ? '<div class="bx-sws" role="group" aria-label="' + esc(p.opt || "Finish") + '">' + p.finishes.map(function (f, i) { return '<button type="button" class="bx-sw" aria-pressed="' + !i + '" data-bf="' + i + '" title="' + esc(f.name) + '" aria-label="' + esc(f.name) + '"><i style="background:' + f.sw + '"></i></button>'; }).join("") + "</div>"
        : '<label class="sr" for="bxs-' + p.id + '">' + esc(p.opt || "Option") + '</label><select class="bx-sel" id="bxs-' + p.id + '">' + p.finishes.map(function (f, i) { return '<option value="' + i + '">' + esc(f.name) + " · " + money(f.price) + "</option>"; }).join("") + "</select>") : "") +
      '</div><button type="button" class="bx-add" data-badd><span class="bx-add-l">Add to bundle</span><span class="bx-add-s">Add</span><span class="bx-add-p">' + money(f0.price) + "</span></button></li>";
  }

  V8.route("bundle", function () {
    var html =
      '<section class="bx-hero"><div class="bx-hero-im"><img src="media/life/records.webp" alt="A mother setting a record on a turntable on the nursery floor, a natural Soho crib behind her"></div>' +
      '<div class="bx-hero-tx">' + V8.crumbs([["Home", "#/"], ["Bundle & Save"]]) + '<h1 class="disp d2">Build your nursery.<br><b>Save as you go.</b></h1>' +
      '<p class="lede">Pick the pieces you need, from the crib to the sheets. The more you add, the more comes off every piece.</p>' +
      '<ol class="bx-ladder" role="list">' + V8.TIERS.map(function (t) { return '<li data-n="' + t[0] + '"><b>' + Math.round(t[1] * 100) + "% off</b><span>" + t[0] + (t[0] === V8.TIERS[V8.TIERS.length - 1][0] ? "+ pieces" : " pieces") + "</span></li>"; }).join("") + "</ol></div></section>" +
      '<section class="wrap bx"><div class="bx-steps">' + STEPS.map(function (st) {
        return '<section class="bx-step" aria-labelledby="bx-' + st.k + '"><header class="bx-step-h"><span class="bx-n">' + st.n + '</span><div><h2 class="disp d3" id="bx-' + st.k + '">' + st.t + '</h2><p class="muted">' + st.s + '</p></div></header><ul class="bx-grid" role="list">' + st.ids().map(function (id) { return P[id] ? tile(P[id]) : ""; }).join("") + "</ul></section>";
      }).join("") + "</div>" +
      '<aside class="bx-sum" id="bxSum" aria-label="Your bundle"></aside></section>' +
      '<div class="bx-bar" id="bxBar" aria-hidden="true"></div>';

    return { title: "Bundle & Save", html: html, after: function (root) {
      var bundle = load(), sum = $("#bxSum", root), bar = $("#bxBar", root);
      function quote() { return V8.bundleQuote(bundle.map(function (x) { var p = P[x.id]; return { price: p.finishes[x.f].price, type: p.type, qty: 1 }; })); }
      function nextTier(n) { for (var i = 0; i < V8.TIERS.length; i++) if (n < V8.TIERS[i][0]) return V8.TIERS[i]; return null; }
      function draw() {
        keep(bundle);
        var q = quote(), nt = nextTier(q.n);
        var nudge = !q.n ? "Add your first piece to start." : nt ? "Add " + (nt[0] - q.n) + " more " + (nt[0] - q.n === 1 ? "piece" : "pieces") + " to save " + Math.round(nt[1] * 100) + "%." : "You’re saving the most a bundle can.";
        var pct = q.n ? Math.min(100, q.n / V8.TIERS[V8.TIERS.length - 1][0] * 100) : 0;
        sum.innerHTML = '<div class="bx-sum-in"><h2 class="h4">Your bundle <span class="muted">· ' + q.n + (q.n === 1 ? " piece" : " pieces") + "</span></h2>" +
          '<div class="bx-meter" aria-hidden="true"><i style="width:' + pct + '%"></i>' + V8.TIERS.map(function (t) { return '<span style="left:' + t[0] / V8.TIERS[V8.TIERS.length - 1][0] * 100 + '%" class="' + (q.n >= t[0] ? "on" : "") + '"></span>'; }).join("") + "</div>" +
          '<p class="bx-nudge">' + nudge + "</p>" +
          (bundle.length ? '<ul class="bx-lines" role="list">' + bundle.map(function (x, i) { var p = P[x.id], f = p.finishes[x.f]; return '<li><span class="bx-li-im"><img src="' + f.img + '" alt=""></span><span class="bx-li-tx"><b>' + esc(p.full) + "</b><small>" + esc(f.name) + '</small></span><span class="bx-li-p">' + money(f.price) + '</span><button type="button" class="bx-x" data-bx="' + i + '" aria-label="Remove ' + esc(p.full) + '">×</button></li>'; }).join("") + "</ul>" : '<p class="small muted bx-empty">Your pieces will show up here.</p>') +
          '<div class="sum-row"><span>Subtotal</span><span class="price">' + money(q.sub) + "</span></div>" +
          (q.disc ? '<div class="sum-row bx-save"><span>Bundle saving' + (q.rate && Math.round(q.sub * q.rate * 100) / 100 >= q.disc ? " · " + Math.round(q.rate * 100) + "%" : " · crib + dresser 15%") + "</span><span>−" + money(q.disc) + "</span></div>" : "") +
          '<div class="sum-row total"><span>Bundle total</span><span class="price">' + money(q.sub - q.disc) + "</span></div>" +
          '<button type="button" class="btn btn-primary block lg" id="bxGo"' + (q.n ? "" : " disabled") + ">Add bundle to bag" + (q.n ? " · " + money(q.sub - q.disc) : "") + "</button>" +
          '<p class="small muted" style="text-align:center">Free shipping · 14-day returns</p></div>';
        bar.innerHTML = '<span><b>' + money(q.sub - q.disc) + "</b>" + (q.disc ? ' <s class="muted">' + money(q.sub) + "</s>" : "") + '<br><small class="muted">' + q.n + (q.n === 1 ? " piece" : " pieces") + (q.disc ? " · save " + money(q.disc) : "") + '</small></span><button type="button" class="btn btn-primary" id="bxGo2"' + (q.n ? "" : " disabled") + ">Add bundle to bag</button>";
        bar.classList.toggle("on", q.n > 0); bar.setAttribute("aria-hidden", q.n ? "false" : "true");
        $$(".bx-item", root).forEach(function (li) {
          var on = bundle.some(function (x) { return x.id === li.dataset.id && x.f === +li.dataset.f; });
          li.classList.toggle("in", on);
          $(".bx-add-l", li).textContent = on ? "In your bundle ✓" : "Add to bundle"; $(".bx-add-s", li).textContent = on ? "Added ✓" : "Add";
          $(".bx-add", li).setAttribute("aria-pressed", on);
        });
        $$("[data-bx]", sum).forEach(function (b) { b.addEventListener("click", function () { bundle.splice(+b.dataset.bx, 1); draw(); }); });
        [$("#bxGo", sum), $("#bxGo2", bar)].forEach(function (b) { if (b) b.addEventListener("click", toBag); });
      }
      function toBag() {
        if (!bundle.length) return;
        bundle.forEach(function (x, i) { V8.add(x.id, x.f, 1, { bundle: true, silent: i < bundle.length - 1 }); });
        bundle = []; draw();
      }
      function setF(li, f) {
        var p = P[li.dataset.id], fin = p.finishes[f]; li.dataset.f = f;
        $(".bx-im img", li).src = fin.img; $(".bx-fin", li).textContent = fin.name; $(".bx-add-p", li).textContent = money(fin.price);
        $$(".bx-sw", li).forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.bf === f); });
        draw();
      }
      $$(".bx-item", root).forEach(function (li) {
        $$(".bx-sw", li).forEach(function (b) { b.addEventListener("click", function () { setF(li, +b.dataset.bf); }); });
        var sel = $(".bx-sel", li); if (sel) sel.addEventListener("change", function () { setF(li, +sel.value); });
        $("[data-badd]", li).addEventListener("click", function () {
          var id = li.dataset.id, f = +li.dataset.f, i = bundle.findIndex(function (x) { return x.id === id && x.f === f; });
          if (i > -1) bundle.splice(i, 1); else { bundle.push({ id: id, f: f }); if (V8.toast && matchMedia("(min-width: 1024px)").matches) V8.toast(P[id].full + " added to your bundle"); }
          draw();
        });
      });
      draw();
    } };
  });
})();
