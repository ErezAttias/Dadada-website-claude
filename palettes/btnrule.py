# Button rule: bg = section heading colour, text = section ground, hover = boldest palette colour that keeps >=3:1 with the text.
def lum(h):
    h=h.lstrip('#'); r,g,b=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    f=lambda c: c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4
    return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)
def cr(a,b):
    la,lb=lum(a),lum(b); return (max(la,lb)+0.05)/(min(la,lb)+0.05)
# per palette: sections {name: (ground, heading)} and hover candidates, boldest first
P={
 'denim': dict(band='#ff4d2d', dd=['#ff4d2d','#2a64d6','#fff0a6','#1e2540'], cands=['#ff4d2d','#2a64d6','#fff0a6','#1e2540','#fff6c9'], secs={
   'light':('#fff6c9','#e23a18'),'note':('#ffeee8','#e23a18'),'stl':('#1e2540','#fff6c9'),'hset':('#ff4d2d','#1e2540'),'foot':('#1e2540','#fff0a6'),'dark':('#1e2540','#fff6c9')}),
 'vinyl': dict(band='#f2441d', dd=['#f2441d','#f28111','#022e40','#a61414','#fbf5ea'], cands=['#f2441d','#a61414','#f28111','#022e40','#fbf5ea'], secs={
   'light':('#fbf5ea','#022e40'),'note':('#f3e4d3','#022e40'),'stl':('#022e40','#fbf5ea'),'hset':('#f2441d','#fbf5ea'),'foot':('#022e40','#f28111'),'dark':('#022e40','#fbf5ea')}),
 'base': dict(band='#b5a8e1', dd=['#10233f','#1f25f5'], cands=['#10233f','#eefe53','#1f25f5','#b5a8e1','#fefbed'], secs={
   'light':('#fefbed','#1f25f5'),'note':('#f0d8d8','#1f25f5'),'stl':('#10233f','#fefbed'),'hset':('#b5a8e1','#10233f'),'foot':('#10233f','#eefe53'),'dark':('#10233f','#fefbed')}),
 'vitame': dict(band='#ec643a', dd=['#ec643a','#5d81bf','#fcfbec','#dce7ad'], cands=['#ec643a','#5d81bf','#dce7ad','#242f35','#fcfbec'], secs={
   'light':('#fcfbec','#43649f'),'note':('#ec643a','#242f35'),'stl':('#242f35','#fcfbec'),'hset':('#242f35','#dce7ad'),'foot':('#242f35','#dce7ad'),'dark':('#242f35','#fcfbec')}),
 'fresh': dict(band='#0199c6', dd=['#e2583a','#0199c6','#ffe14d','#14160f'], cands=['#e2583a','#0199c6','#ffe14d','#14160f','#fff6c4'], secs={
   'light':('#fff6c4','#14160f'),'note':('#cfe6f2','#14160f'),'stl':('#14160f','#fff6c4'),'hset':('#0199c6','#14160f'),'foot':('#14160f','#e2583a'),'dark':('#14160f','#fff6c4')}),
 'tropina': dict(band='#ea532f', dd=['#ea532f','#b8321a','#fefbed'], cands=['#ea532f','#d2ea4c','#b8321a','#fefbed'], secs={
   'light':('#fefbed','#b8321a'),'note':('#fad8c6','#b8321a'),'stl':('#ea532f','#fefbed'),'hset':('#ea532f','#fefbed'),'foot':('#ea532f','#d2ea4c'),'dark':('#ea532f','#fefbed')}),
 'pantone': dict(band='#d52d32', dd=['#d52d32','#fbeda4','#233563','#18233f'], cands=['#d52d32','#18233f','#fbeda4','#233563','#fefbed'], secs={
   'light':('#fefbed','#233563'),'note':('#f7e2d6','#233563'),'stl':('#18233f','#fefbed'),'hset':('#d52d32','#fefbed'),'foot':('#18233f','#fbeda4'),'dark':('#18233f','#fefbed')}),
}
def mix(a,b,t):
    a=a.lstrip('#'); b=b.lstrip('#')
    return '#'+''.join(f"{round(int(a[i:i+2],16)*(1-t)+int(b[i:i+2],16)*t):02x}" for i in (0,2,4))
def pick(cands, g, h):
    # boldest candidate that differs from the button and keeps >=3:1 with the text; if needed, shade it (darker on light text, lighter on dark text) up to 45%
    toward = '#000000' if lum(g) > 0.4 else '#ffffff'
    for c in cands:
        if c.lower() in (g.lower(), h.lower()): continue
        for t in [i/20 for i in range(0, 10)]:
            m = mix(c, toward, t)
            if cr(m, g) >= 3 and cr(m, h) > 1.25: return m
    # nothing reaches 3:1 without losing the colour: take the most legible candidate that still reads as a change
    ok = [c for c in cands if c.lower() not in (g.lower(), h.lower()) and cr(c, h) > 1.25]
    return max(ok, key=lambda c: cr(c, g)) if ok else h
SEL={'light':'html body','note':'html body .note','stl':'html body .stl','hset':'html body .hset','foot':'html body .foot','dark':'html body #pdp .pa-math, html body .buybar'}
def css(name):
    p=P[name]; out=['  /* BUTTON RULE: bg = section heading colour, text = section ground, hover = boldest palette colour that keeps contrast with the text */']
    for k,(g,h) in p['secs'].items():
        hv=pick(p['cands'], g, h)
        dd=pick(p['dd'], g, h)
        out.append(f'  {SEL[k]} {{ --sec-bg: {g}; --sec-h: {h}; --btn-hv: {hv}; --dd-a: {dd}; }}  /* text/btn {cr(g,h):.1f}, text/hover {cr(g,hv):.1f} */')
    B='html body .pill:not(.ghost):not(.knock), html body #pdp .add, html body .foot-news button, html body #pdp .pa-math button, html body .buybar button'
    out.append(f'  {B} {{ background: var(--sec-h) !important; color: var(--sec-bg) !important; border-color: transparent !important; transition: background-color .35s var(--ease), color .35s var(--ease), transform .35s var(--ease); }}')
    out.append('  html body .pill:not(.ghost):not(.knock) *, html body #pdp .add *, html body .foot-news button *, html body #pdp .pa-math button * { color: inherit !important; }')
    H=', '.join(s.strip()+':hover' for s in B.split(','))
    out.append(f'  {H} {{ background: var(--btn-hv) !important; color: var(--sec-bg) !important; }}')
    out.append('  /* DOODLE RULE: illustrations keep >=3:1 with the ground they sit on. one tone follows the heading, the other takes the boldest palette colour that still holds contrast */')
    out.append('  html body .note .dd, html body .fl, html body .dd-free { color: var(--sec-h) !important; }')
    # HOVER BAND RULE: the crib-index hover band takes the palette's bold colour; everything on it takes the palette colour with the most contrast
    g=p['band']; pool=set(c.lower() for c in p['cands']+p['dd'])|set(x.lower() for v in p['secs'].values() for x in v)
    tx=max((c for c in pool if c!=g.lower()), key=lambda c: cr(c,g))
    out.append(f'  /* HOVER BAND RULE: band {g}, text {tx} ({cr(g,tx):.1f}:1) */')
    out.append(f'  html body .index-row::before {{ background: {g} !important; }}')
    out.append(f'  @media (hover: hover) {{ html body .index-row:hover, html body .index-row:hover .name, html body .index-row:hover .spec, html body .index-row:hover .spec *, html body .index-row:hover .n, html body .index-row:hover .price, html body .index-row:hover .price *, html body .index-row:hover > * {{ color: {tx} !important; opacity: 1 !important; }}')
    out.append(f'    html body .index-row:hover .go {{ background: {tx} !important; color: {g} !important; }} }}')
    return '\n'.join(out)+'\n'
if __name__=='__main__':
    import sys
    for n in P: print(n); print(css(n))
