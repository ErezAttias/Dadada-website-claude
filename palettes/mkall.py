import re
def styles(p):
    s=open(p).read(); return s,[m for m in re.finditer(r'<style[^>]*>.*?</style>',s,re.S)]
b,bst=styles('/home/claude/proto/index.html')
big=lambda st:max(st,key=lambda m:len(m.group(0)))
css={'base':big(bst).group(0)}
for n in ['pantone','tropina']:
    s,st=styles(f'/home/claude/proto/dadada-{n}.html'); css[n]=big(st).group(0)
m=big(bst)
def blk(name,txt,on):
    inner=re.sub(r'^<style[^>]*>|</style>$','',txt)
    media='' if on else ' media="not all"'
    return '<style id="pal-%s"%s>%s</style>' % (name,media,inner)
new=blk('base',css['base'],True)+'\n'+blk('pantone',css['pantone'],False)+'\n'+blk('tropina',css['tropina'],False)
out=b[:m.start()]+new+b[m.end():]
out=out.replace('<title>dadada — Room to be you</title>','<title>dadada Palettes</title>',1)
old='const paint = (bg, c) => { sec.style.setProperty("--q", bg); sec.style.setProperty("--qc", c); };'
assert old in out
out=out.replace(old,'const paint = (bg, c) => { const pq = window.__pq || ((x) => x); sec.style.setProperty("--q", pq(bg)); sec.style.setProperty("--qc", pq(c)); };',1)
out=out.rstrip()+'\n'+open('/home/claude/qa/palsw.html').read()
open('/home/claude/proto/dadada-palettes.html','w').write(out)
print(len(out))
