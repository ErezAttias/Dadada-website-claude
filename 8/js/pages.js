/* dadada V8 · content pages: story, safety, sustainability, support, journal, stockists, wishlist, account, legal, 404 */
(function () {
  "use strict";
  var V8 = window.V8, D = window.DD, P = V8.P, $ = V8.$, $$ = V8.$$, esc = V8.esc, money = V8.money;
  var head = V8.pageHead, crumbs = V8.crumbs;
  var EMAIL = "service@dadadababy.com";

  function hero(o) { return '<section class="page-hero"><img src="' + o.img + '" alt="' + esc(o.alt || "") + '" style="object-position:' + (o.pos || "50% 50%") + '"><div class="wrap">' + (o.kick ? '<span class="label" style="color:var(--lime)">' + o.kick + "</span>" : "") + '<h1 class="disp d1">' + o.h1 + "</h1>" + (o.lede ? '<p class="lede" style="color:rgba(255,255,255,.9)">' + o.lede + "</p>" : "") + "</div></section>"; }
  function aboutNav(cur) { return '<nav class="wrap" aria-label="About dadada" style="padding-top:24px"><div class="filters">' + [["story", "Our story"], ["safety", "Safety"], ["sustainability", "Sustainability"], ["stockists", "Stockists"]].map(function (x) { return '<a class="filter" style="display:inline-flex;align-items:center" href="#/' + x[0] + '"' + (x[0] === cur ? ' aria-pressed="true" aria-current="page"' : "") + ">" + x[1] + "</a>"; }).join("") + "</div></nav>"; }

  /* ---------- our story ---------- */
  V8.route("story", function () {
    return { title: "Our story", html: hero({ img: "../img/story-workshop.jpg", alt: "Hands sanding a solid beech crib in a small Italian workshop", kick: "Our story · Heritage since 1932", h1: "Made in Italy. <b>Made to be passed down.</b>", lede: "A young brand with an old family trade. dadada was founded by the Segal Group, whose furniture heritage goes back to 1932, to make the first pieces your child will ever own." }) +
      aboutNav("story") +
      '<section class="sec"><div class="wrap"><ul class="facts" role="list">' + [["1932", "Where the family’s furniture heritage begins"], ["100%", "Solid European beechwood in every crib, kiln-dried"], ["Gold", "GREENGUARD Gold certified, every crib"], ["2 yrs", "Limited warranty on every crib"]].map(function (f, i) { return '<li class="rv" style="--d:' + i * .06 + 's"><b>' + f[0] + '</b><span class="muted">' + f[1] + "</span></li>"; }).join("") + "</ul></div></section>" +
      '<section class="sec joined"><div class="wrap split"><div class="im rv"><img src="../img/story-joint.jpg" alt="A beech joint being fitted by hand" loading="lazy"></div><div class="stack rv" style="--s:20px"><h2 class="disp d2 c-orange">Family workshops, <b>not factories.</b></h2><p class="lede">Our cribs are handcrafted in family-owned Italian workshops, from locally sourced beech. We keep full control over how they’re made, with safety specialists overseeing the process.</p><p class="body">Clean, modern lines with a sense of calm. Nothing loud, nothing that will look dated by the time a second child sleeps in it.</p></div></div></section>' +
      '<section class="sec bg-paper"><div class="wrap split rev"><div class="im rv"><img src="../img/room-soho-brownstone.jpg" alt="A natural Soho crib in a Brooklyn brownstone parlor" loading="lazy"></div><div class="stack rv" style="--s:20px"><h2 class="disp d2 c-orange">What’s not in it <b>matters.</b></h2><ul class="pills" role="list">' + ["Lead-free", "Phthalate-free", "Formaldehyde-free", "No added PFAS"].map(function (x) { return '<li class="chip lime">' + x + "</li>"; }).join("") + '</ul><p class="lede">Every crib is GREENGUARD Gold certified, tested for thousands of chemicals and VOCs against some of the strictest emission standards in the world.</p><p class="body">Air indoors can be two to five times more polluted than outside, so the room where your baby sleeps is where it counts.</p><a class="link" href="#/safety">How we test for safety <span class="ar" aria-hidden="true">→</span></a></div></div></section>' +
      '<section class="sec"><div class="wrap split"><div class="im rv"><img src="../img/mom-soho-walnut.jpg" alt="A mother beside a walnut Soho crib" loading="lazy"></div><div class="stack rv" style="--s:20px"><h2 class="disp d2 c-orange">Buy once. <b>Hand it down.</b></h2><p class="lede">Renewable beech, low-impact production and craftspeople working under fair labor conditions. And a crib built to see more than one childhood.</p><p class="body">When it’s finally time to let go, our partnership with REBEL gives dadada furniture a second home instead of a landfill.</p><a class="link" href="#/sustainability">Sustainability <span class="ar" aria-hidden="true">→</span></a></div></div></section>' +
      '<section class="bg-orange quizband"><span class="label" style="color:var(--lime)">Room to be you</span><h2 class="disp d2" style="max-width:20ch">A nursery is the first room you design <b>for someone else.</b></h2><p>It should still feel like you.</p><div class="row" style="--s:12px;justify-content:center"><a class="btn btn-lime lg" href="#/cribs">Shop cribs</a><a class="btn btn-light lg" href="#/quiz">Find your fit</a></div></section>' };
  });
  V8.route("story/italy", function () { return { redirect: "#/story" }; });

  /* ---------- safety ---------- */
  V8.route("safety", function () {
    var tests = [["GREENGUARD Gold", "Every crib is certified for low chemical emissions, tested against more than 10,000 chemicals and VOCs."], ["CPSC and ASTM", "Meets U.S. mandatory crib standards, and exceeds CPSC, ASTM and Health Canada requirements."], ["Certified to 50 lb", "Our cribs are tested to 50 lb in daybed mode, so the bed keeps up with them."], ["Non-toxic finishes", "Water-based, VOC-free, lead-free and phthalate-free paints and oils."], ["Solid wood", "Kiln-dried European beech. No MDF, particleboard or plastic fillers."], ["Anti-tip on every dresser", "An anti-tip kit is included in the box with every dresser we make."]];
    return { title: "Safety", html: hero({ img: "../img/mom-spirit.jpg", alt: "A mother beside a Spirit crib", kick: "Safety", h1: "Tested by people <b>whose job is to be picky.</b>", lede: "What goes into a dadada crib, what stays out of it, and the standards it meets." }) + aboutNav("safety") +
      '<section class="sec"><div class="wrap"><ul class="sup-cards" role="list">' + tests.map(function (t, i) { return '<li class="rv" style="--d:' + i * .05 + 's"><b>' + t[0] + "</b><span>" + t[1] + "</span></li>"; }).join("") + "</ul></div></section>" +
      '<section class="sec bg-paper"><div class="wrap split"><div class="stack rv" style="--s:20px"><h2 class="disp d2 c-orange">Sleep-safe <b>setup.</b></h2><ul class="body" style="display:grid;gap:10px;padding-left:1.1em"><li>Use a U.S. standard crib mattress, 52″ × 27.75″. Leave no more than two fingers’ width (about one inch) between mattress and side.</li><li>Lower the platform as soon as your baby can sit up, and again before they can stand.</li><li>Keep the crib clear: no bumpers, pillows or loose blankets for babies under 12 months.</li><li>Fit the anti-tip kit on every dresser before you fill it.</li><li>Register your crib so we can reach you with any safety update.</li></ul><a class="btn btn-primary" href="#/support/register">Register your crib</a></div><div class="im rv"><img src="../img/room-lala-uws.jpg" alt="A LaLa crib in a nursery" loading="lazy"></div></div></section>' +
      '<section class="sec"><div class="wrap"><div class="sec-head"><h2 class="disp d2 c-orange">Read <b>the guide.</b></h2></div><div class="jgrid">' + D.journal.filter(function (j) { return /safety|mini|convertible/.test(j.id); }).map(function (j, i) { return V8.jcard(j, i); }).join("") + "</div></div></section>" };
  });
  V8.route("story/safety", function () { return { redirect: "#/safety" }; });

  /* ---------- sustainability ---------- */
  V8.route("sustainability", function () {
    return { title: "Sustainability", html: hero({ img: "../img/g-soho-tribeca.jpg", alt: "A walnut Soho crib against whitewashed brick", kick: "Sustainability", h1: "The greenest crib is <b>the one you keep.</b>", lede: "Built to last more than one childhood, from wood that grows back." }) + aboutNav("sustainability") +
      '<section class="sec"><div class="wrap"><ul class="facts" role="list">' + [["Beech", "Renewable European hardwood, locally sourced in Italy"], ["1 crib", "Crib, toddler bed and daybed: one piece instead of three"], ["Fair", "Craftspeople working under fair labor conditions"], ["REBEL", "A second home for dadada furniture, instead of a landfill"]].map(function (f, i) { return '<li class="rv" style="--d:' + i * .06 + 's"><b>' + f[0] + '</b><span class="muted">' + f[1] + "</span></li>"; }).join("") + "</ul></div></section>" +
      '<section class="sec bg-paper"><div class="wrap split"><div class="im rv"><img src="../img/story-workshop.jpg" alt="An Italian workshop" loading="lazy"></div><div class="stack rv" style="--s:20px"><h2 class="disp d2 c-orange">Low-impact, <b>by design.</b></h2><p class="lede">Renewable beech, low-impact production and water-based finishes. Every crib converts, so one piece does the work of three.</p><p class="body">When it’s finally time to let go, our partnership with REBEL gives dadada furniture a second home instead of a landfill.</p><a class="btn btn-primary" href="#/cribs">Shop convertible cribs</a></div></div></section>' };
  });
  V8.route("story/sustainability", function () { return { redirect: "#/sustainability" }; });

  /* ---------- support ---------- */
  var SUP = [
    ["shipping", "Shipping", [["Where we ship", "The contiguous 48 states."], ["Where we can’t, yet", "Alaska, Hawaii, Puerto Rico, U.S. territories, P.O. boxes and APO/FPO addresses."], ["When it ships", "Within one business day, free. You’ll get tracking by email as soon as it leaves."], ["After you order", "You’ll get a confirmation email. From that point the order can’t be changed or cancelled."]]],
    ["returns", "Returns", [["14 days", "From delivery, in new, unused condition, in the original packaging with every part."], ["20% restocking fee", "Deducted from every refund. Refunds land 7 to 10 business days after we receive the item."], ["Damaged in transit?", "Tell us within 3 days, with photos of the item and the box. Keep the packaging until it’s resolved."], ["Final sale", "Sale and bundle items, mattresses and replacement parts. Bought from a retailer? Return it there."]]],
    ["assembly", "Assembly", [["Printed and online", "Instructions come in the box and live on our assembly page, model by model."], ["Watch it built", "Step-by-step videos on the dadada YouTube channel."], ["Stuck on a step?", "Email " + EMAIL + " with your model and a photo. We’ll talk you through it."]]],
    ["warranty", "Warranty", [["Cribs", "Two-year limited warranty from the date of purchase."], ["Everything else", "One-year limited warranty, for purchases from dadada or an authorized retailer."]]],
    ["register", "Register", null],
    ["care", "Care", [["Clean", "A soft cloth, slightly damp. No detergents or cleaning products; they’re hard on natural wood and baby-safe finishes."], ["Spills", "Dry them straight away."], ["Mattress fit", "Standard 52″ × 27.75″, with no more than one inch between the mattress and the crib side."]]],
    ["contact", "Contact", null],
    ["faq", "FAQ", null]
  ];
  function supSection(s) {
    var id = s[0], t = s[1], body;
    if (id === "register") body = '<form class="co-grid" id="regForm" novalidate style="max-width:720px"><div class="field"><label for="rgName">Name</label><input class="input" id="rgName" required autocomplete="name"></div><div class="field"><label for="rgEmail">Email</label><input class="input" id="rgEmail" type="email" required autocomplete="email"></div><div class="field"><label for="rgProd">Product</label><select class="select" id="rgProd" required><option value="">Select</option>' + D.order.cribs.concat(D.order.dressers).map(function (k) { return "<option>" + esc(P[k].full) + "</option>"; }).join("") + '</select></div><div class="field"><label for="rgDate">Purchase date</label><input class="input" id="rgDate" type="date" required></div><div class="full row"><button class="btn btn-primary" type="submit">Register</button><span class="small muted">So we can reach you with safety updates about your product.</span></div><p class="full ok h4" role="status" hidden>Registered. Thank you, we’ll only email you about safety.</p></form>';
    else if (id === "contact") body = '<ul class="sup-cards" role="list"><li><b>Email</b><span><a class="link" href="mailto:' + EMAIL + '">' + EMAIL + '</a></span><span class="small muted">We answer within one business day.</span></li><li><b>Assembly help</b><span>Send your model and a photo of the step you’re on.</span></li><li><b>Damaged delivery</b><span>Write within 3 days of delivery, with photos of the item and the box.</span></li></ul>';
    else if (id === "faq") body = D.faqs.map(function (g) { return '<h3 class="label muted" style="margin-top:8px">' + esc(g.group) + '</h3><div class="acc">' + g.items.map(function (x) { return "<details><summary>" + esc(x.q) + '</summary><div class="acc-body">' + esc(x.a) + "</div></details>"; }).join("") + "</div>"; }).join("");
    else body = '<ul class="sup-cards" role="list">' + s[2].map(function (r) { return "<li><b>" + esc(r[0]) + "</b><span>" + esc(r[1]) + "</span></li>"; }).join("") + "</ul>";
    return '<section class="sup-sec" id="s-' + id + '" aria-labelledby="sh-' + id + '"><h2 class="disp d3 c-orange" id="sh-' + id + '">' + t + ".</h2>" + body + "</section>";
  }
  function support(sec) {
    var html = head({ crumbs: [["Home", "#/"], ["Help"]], h1: "Little questions. <b>Straight answers.</b>", lede: "Shipping, returns, assembly and the rest. Still stuck? Write to us at " + EMAIL + "." }) +
      '<div class="wrap sup" style="padding-bottom:var(--sec)"><nav class="sup-nav" aria-label="Help topics">' + SUP.map(function (s) { return '<a href="#/support/' + s[0] + '" data-sec="' + s[0] + '">' + s[1] + "</a>"; }).join("") + "</nav><div>" + SUP.map(supSection).join("") + "</div></div>";
    return { title: "Help", html: html, keepScroll: !!sec, after: function (root) {
      if (sec) { var el = $("#s-" + sec, root); if (el) setTimeout(function () { el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }, 30); else scrollTo(0, 0); } else scrollTo(0, 0);
      var links = $$(".sup-nav a", root), secs = $$(".sup-sec", root);
      var sio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) links.forEach(function (a) { a.setAttribute("aria-current", a.dataset.sec === e.target.id.slice(2)); }); }); }, { rootMargin: "-30% 0px -60% 0px" });
      secs.forEach(function (s) { sio.observe(s); }); V8.onLeave(function () { sio.disconnect(); });
      var rf = $("#regForm", root); rf.addEventListener("submit", function (e) { e.preventDefault(); var bad = $$("[required]", rf).filter(function (i) { var ok = i.value.trim() && (i.type !== "email" || /^\S+@\S+\.\S+$/.test(i.value)); i.setAttribute("aria-invalid", !ok); return !ok; }); if (bad.length) { bad[0].focus(); V8.toast("Fill in every field to register"); return; } $(".ok", rf).hidden = false; $$("input, select, button", rf).forEach(function (x) { x.disabled = true; }); });
    } };
  }
  V8.route("support", function () { return support(null); });
  V8.route("support/:sec", support);

  /* ---------- journal ---------- */
  V8.route("journal", function () {
    var f = D.journal[0];
    return { title: "Journal", html: head({ crumbs: [["Home", "#/"], ["Journal"]], h1: "The dadada <b>Daily.</b>", lede: "Buying guides, safety explainers, sleep advice and the stories behind our designs." }) +
      '<section class="wrap" style="padding-bottom:var(--sec)"><article class="split rv" style="margin-bottom:clamp(40px,5vw,80px);position:relative"><div class="im" style="aspect-ratio:4/3"><img src="' + f.hero + '" alt="' + esc(f.alt) + '" style="object-position:' + f.pos + '"></div><div class="stack" style="--s:16px"><div class="row"><span class="chip lime">' + esc(f.cat) + '</span><span class="small muted">' + f.read + " min read · " + esc(f.date) + '</span></div><h2 class="disp d2 c-orange"><a href="#/journal/' + f.id + '">' + esc(f.title) + '</a></h2><p class="lede">' + esc(f.ex) + '</p><a class="link" href="#/journal/' + f.id + '">Read the guide <span class="ar" aria-hidden="true">→</span></a></div></article>' +
      '<div class="jgrid">' + D.journal.slice(1).map(function (j, i) { return V8.jcard(j, i); }).join("") + "</div></section>" };
  });
  V8.route("journal/:id", function (id) {
    var j = D.journal.find(function (x) { return x.id === id; }); if (!j) return V8.pages.notFound();
    var shop = (j.shop || []).map(function (s) { var p = P[s[1]]; if (!p) return null; var f = 0; if (s[2]) p.finishes.forEach(function (x, i) { if (x.k === s[2]) f = i; }); return { p: p, f: f }; }).filter(Boolean);
    if (!shop.length) shop = [{ p: P.soho, f: 0 }, { p: P.bliss, f: 0 }];
    var toc = (j.toc || []).map(function (t) { return Array.isArray(t) ? { id: t[0], t: t[1] } : t; });
    var html = '<div class="art-prog" id="artProg"></div><header class="wrap art-hero">' + crumbs([["Home", "#/"], ["Journal", "#/journal"], [j.cat]]) + '<div class="row"><span class="chip lime">' + esc(j.cat) + '</span><span class="small muted">' + j.read + " min read · " + esc(j.date) + '</span></div><h1 class="disp d2">' + esc(j.title) + (j.sub ? ' <b class="nowrap">' + esc(j.sub) + "</b>" : "") + '</h1><div class="im"><img src="' + j.hero + '" alt="' + esc(j.alt) + '" style="object-position:' + j.pos + '"></div></header>' +
      '<div class="wrap art">' + (toc.length ? '<nav class="toc" aria-label="On this page"><span class="label muted">On this page</span>' + toc.map(function (t) { return '<a href="#' + esc(t.id) + '" data-toc="' + esc(t.id) + '">' + esc(t.t) + "</a>"; }).join("") + "</nav>" : "<div></div>") +
      '<article class="prose" id="artBody">' + j.body + "</article>" +
      '<aside class="art-shop" aria-label="Shop this story"><span class="label muted">Shop the story</span>' + shop.map(function (s) { return '<a class="line-item" style="grid-template-columns:72px 1fr;border:0;padding:0" href="' + V8.url(s.p) + '"><span class="li-img" style="width:72px;height:72px"><img src="' + s.p.finishes[s.f].img + '" alt=""></span><span><b class="li-name">' + esc(s.p.full) + '</b><span class="li-meta" style="display:block">' + esc(s.p.finishes[s.f].name) + " · " + money(s.p.finishes[s.f].price) + "</span></span></a>"; }).join("") + "</aside></div>" +
      '<section class="sec bg-paper"><div class="wrap"><div class="sec-head"><h2 class="disp d2 c-orange">Keep <b>reading.</b></h2><a class="link" href="#/journal">All stories</a></div><div class="jgrid">' + D.journal.filter(function (x) { return x.id !== j.id; }).slice(0, 3).map(function (x, i) { return V8.jcard(x, i); }).join("") + "</div></div></section>";
    return { title: j.title, html: html, after: function (root) {
      // in-article anchor links must not trigger the router
      $$('a[href^="#"]:not([href^="#/"])', root).forEach(function (a) { a.addEventListener("click", function (e) { var t = document.getElementById(a.getAttribute("href").slice(1)); if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth" }); } }); });
      var body = $("#artBody", root), prog = $("#artProg", root), links = $$("[data-toc]", root);
      function onS() { var r = body.getBoundingClientRect(), k = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight))); prog.style.transform = "scaleX(" + k + ")"; var curId = null; links.forEach(function (a) { var h = document.getElementById(a.dataset.toc); if (h && h.getBoundingClientRect().top < innerHeight * .3) curId = a.dataset.toc; }); links.forEach(function (a) { a.classList.toggle("on", a.dataset.toc === curId); }); }
      addEventListener("scroll", onS, { passive: true }); onS(); V8.onLeave(function () { removeEventListener("scroll", onS); });
    } };
  });

  /* ---------- stockists ---------- */
  V8.route("stockists", function () {
    var S = [["brand-1", "Babylist", "https://www.babylist.com", "Add dadada to your registry."], ["brand-2", "Target", "https://www.target.com", "Online across the U.S."], ["brand-3", "Amazon", "https://www.amazon.com", "Selected cribs and dressers."], ["brand-4", "Wayfair", "https://www.wayfair.com", "Online across the U.S."], ["brand-5", "Albee Baby", "https://www.albeebaby.com", "Online and in store, New York."], ["brand-6", "Modern Nursery", "https://www.modernnursery.com", "Online and in store."], ["brand-7", "Macklem’s", "https://www.macklems.com", "In store, since 1945."]];
    return { title: "Stockists", html: head({ crumbs: [["Home", "#/"], ["Stockists"]], h1: "Where to <b>find us.</b>", lede: "Buy direct for free shipping and the 15% nursery-set saving, or find dadada at these retailers." }) + aboutNav("stockists") +
      '<section class="sec"><div class="wrap"><ul class="stores" role="list">' + S.map(function (s, i) { return '<li class="store rv" style="--d:' + i * .04 + 's"><img src="assets/' + s[0] + '.png" alt="' + s[1] + '"><span class="muted">' + s[3] + '</span><a class="link" href="' + s[2] + '" target="_blank" rel="noopener">Visit ' + s[1] + " ↗</a></li>"; }).join("") + '</ul><p class="small muted mt-m">Bought from a retailer? Returns go back to that retailer. Warranty and safety registration are with us.</p></div></section>' };
  });

  /* ---------- wishlist ---------- */
  V8.route("wishlist", function () {
    function draw() { var w = V8.store.wish.map(function (id) { return P[id]; }).filter(Boolean); return w.length ? '<div class="pgrid">' + w.map(function (p, i) { return V8.card(p, { d: i * .04 }); }).join("") + "</div>" : '<div class="empty">' + V8.doodle("dd-heart-o") + '<p class="h4" style="color:var(--ink)">Nothing saved yet.</p><p>Tap the heart on any piece to keep it here.</p><a class="btn btn-primary" href="#/cribs">Shop cribs</a></div>'; }
    return { title: "Wishlist", html: head({ crumbs: [["Home", "#/"], ["Wishlist"]], h1: "Your <b>wishlist.</b>", lede: "Saved on this device. Share it with whoever is doing the registry." }) + '<section class="wrap" style="padding-bottom:var(--sec)" id="wl">' + draw() + "</section>",
      after: function (root) { var fn = function () { var el = $("#wl", root); if (el && el.isConnected) { el.innerHTML = draw(); V8.reveal(el); } }; V8.on("wish", fn); } };
  });

  /* ---------- account ---------- */
  V8.route("account", function () {
    return { title: "Account", html: head({ crumbs: [["Home", "#/"], ["Account"]], h1: "Your <b>account.</b>", lede: "Track orders, keep your registered products and saved pieces in one place." }) +
      '<section class="wrap acct" style="padding-bottom:var(--sec)"><form class="stack" id="signIn" novalidate style="--s:16px;background:var(--paper);padding:clamp(22px,3vw,40px);border-radius:var(--r-lg)"><h2 class="h4">Sign in</h2><div class="field"><label for="acEmail">Email</label><input class="input" id="acEmail" type="email" autocomplete="email" required></div><div class="field"><label for="acPass">Password</label><input class="input" id="acPass" type="password" autocomplete="current-password" required></div><button class="btn btn-primary" type="submit">Sign in</button><a class="link small" href="mailto:' + EMAIL + '">Forgot your password?</a></form>' +
      '<div class="stack" style="--s:16px;padding:clamp(22px,3vw,40px)"><h2 class="h4">New here?</h2><p class="body">An account keeps your orders, your registered crib and your wishlist together. You can also check out as a guest.</p><a class="btn btn-secondary" href="#/support/register">Register a product</a><a class="link" href="#/wishlist">See your wishlist</a></div></section>',
      after: function (root) { $("#signIn", root).addEventListener("submit", function (e) { e.preventDefault(); V8.toast("Accounts aren’t connected in this prototype yet"); }); } };
  });

  /* ---------- legal ---------- */
  var LEGAL = {
    returns: ["Return policy", SUP[1][2]],
    shipping: ["Shipping policy", SUP[0][2]],
    warranty: ["Warranty", SUP[3][2].concat([["How to claim", "Email " + EMAIL + " with your order number and photos of the issue. Proof of purchase from dadada or an authorized retailer is required."]])],
    privacy: ["Privacy policy", [["What we collect", "Your name, contact and delivery details when you order or register a product, and your email if you join the newsletter."], ["How we use it", "To deliver your order, reach you with product safety updates and, if you opted in, send nursery ideas about once a month."], ["Your choices", "Unsubscribe from any email, or ask us to access or delete your data by writing to " + EMAIL + "."]]],
    terms: ["Terms of service", [["Orders", "Placing an order is an offer to buy. We confirm it by email; from then it can’t be changed or cancelled."], ["Prices", "Prices are in U.S. dollars. Nursery-set savings apply automatically when a crib and a dresser are in the same order."], ["Delivery area", "We deliver to the contiguous 48 states."]]]
  };
  V8.route("legal/:slug", function (slug) {
    var l = LEGAL[slug]; if (!l) return V8.pages.notFound();
    return { title: l[0], html: head({ crumbs: [["Home", "#/"], ["Legal"], [l[0]]], h1: esc(l[0]) + "<b>.</b>" }) +
      '<section class="wrap legal" style="padding-bottom:var(--sec)"><nav class="sup-nav" aria-label="Legal">' + Object.keys(LEGAL).map(function (k) { return '<a href="#/legal/' + k + '"' + (k === slug ? ' aria-current="true"' : "") + ">" + LEGAL[k][0] + "</a>"; }).join("") + '</nav><div class="prose">' + l[1].map(function (r) { return "<h2>" + esc(r[0]) + "</h2><p>" + esc(r[1]) + "</p>"; }).join("") + '<p class="small muted">Questions about this policy? Write to <a href="mailto:' + EMAIL + '">' + EMAIL + "</a>.</p></div></section>" };
  });

  /* ---------- 404 ---------- */
  V8.pages.notFound = function () {
    return { title: "Page not found", html: '<section class="nf"><div class="wrap stack center">' + V8.doodle("dd-star") + '<h1 class="disp d1 c-orange">This room is <b>still empty.</b></h1><p class="lede" style="margin-inline:auto">The page you’re looking for has moved or never existed. The cribs are right where we left them.</p><div class="row" style="justify-content:center"><a class="btn btn-primary" href="#/">Back home</a><a class="btn btn-secondary" href="#/cribs">Shop cribs</a></div></div></section>' };
  };
})();
