// Comprueba la lógica de index.html ejecutando su propio <script> (no una copia).
// Sin Node en el NAS, en un contenedor efímero, desde la raíz del repo:
//   docker run --rm -v "$PWD":/t:ro node:22-alpine node /t/tools/check.js
const fs = require('fs');
const path = require('path');
const RAIZ = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');

// ── Ejecutar el script REAL de la página, con un document de pega ──────────
const src = html.match(/<script>\s*\(function\(\)\{([\s\S]*)\}\)\(\);\s*<\/script>/)[1];
const nada = {
  offsetHeight: 64, hidden: false, id: 'guia', value: '0', innerHTML: '', textContent: '',
  lastChild: null, dataset: {}, style: { setProperty(){} }, classList: { contains:()=>false, add(){}, remove(){} },
  setAttribute(){}, getAttribute(){ return null; }, addEventListener(){},
  querySelectorAll(){ return []; }, querySelector(){ return null; }, closest(){ return null; },
  appendChild(x){ return x; }, insertBefore(){}, removeChild(){}, scrollIntoView(){}
};
// La versión que declara el encabezado, para comprobar que es la que se registra
const VER_HTML = html.match(/<span class="ver" id="version">([^<]+)<\/span>/)[1];
const doc = {
  documentElement: nada, querySelector: () => nada,
  getElementById: id => (id === 'version' ? { textContent: VER_HTML } : null),
  querySelectorAll: () => [], addEventListener(){}, createElement: () => Object.create(nada)
};
let alCargar = null, registrado = null;
const win = { addEventListener(ev, f){ if(ev === 'load') alCargar = f; }, scrollTo(){} };
const nav = { serviceWorker: { register(u){ registrado = u; return Promise.resolve(); } } };
const api = new Function('document','window','location','navigator','localStorage',
  src + '\nreturn {romaji, leer, enPalabras, raiz, conRuby, enKana, enKanji, VERBOS, COLUMNA};'
)(doc, win, { hash: '' }, nav, { getItem: () => null, setItem(){} });

const { romaji, leer, enPalabras, raiz, conRuby, enKana, VERBOS } = api;

// ── Mini-DOM para poder pasarle HTML a leer() ──────────────────────────────
function parse(h){
  const raiz_ = { nodeType:1, tagName:'SPAN', hijos:[] }, pila = [raiz_];
  const re = /<(\/?)([a-zA-Z]+)([^>]*)>|([^<]+)/g; let m;
  while((m = re.exec(h))){
    const top = pila[pila.length-1];
    if(m[4] !== undefined) top.hijos.push({ nodeType:3, nodeValue:m[4].replace(/&zwnj;/g, '\u200C') });
    else if(m[1]) pila.pop();
    else {
      const clase = (m[3].match(/class="([^"]*)"/) || [, ''])[1];
      const n = { nodeType:1, tagName:m[2].toUpperCase(), className:clase, hijos:[] }; top.hijos.push(n);
      if(n.tagName !== 'WBR') pila.push(n);   // <wbr> no tiene cierre
    }
  }
  (function enlazar(n){
    n.firstChild = n.hijos[0] || null;
    n.hijos.forEach((c,i) => { c.nextSibling = n.hijos[i+1] || null; if(c.hijos) enlazar(c); });
  })(raiz_);
  return raiz_;
}
const leerHTML = h => leer(parse(h));
const sinCortes = t => t.replace(/\u200C/g, '');
const romajiDe = h => romaji(leerHTML(h));

let fallos = 0;
const comprobar = (q, hay, toca) => { if(hay !== toca){ fallos++; console.log('  ✗ ' + q + ': ' + hay + '   (esperado ' + toca + ')'); } };

// ── 1. El furigana no ensucia el romaji ────────────────────────────────────
console.log('\n=== leer() con <ruby> ===');
[['<ruby>食<rt>た</rt></ruby>べる', 'たべる'],
 ['<ruby>勉強<rt>べんきょう</rt></ruby>する', 'べんきょうする'],
 ['あした <ruby>京都<rt>きょうと</rt></ruby>に <ruby>行<rt>い</rt></ruby>きます', 'あした きょうとに いきます'],
 ['<ruby>食<rt>た</rt><rp>(</rp></ruby>べる', 'たべる'],
 ['ねる', 'ねる']].forEach(([h, k]) => comprobar(h, sinCortes(leerHTML(h)), k));

// ── 2. Conjugación de los 13 verbos ────────────────────────────────────────
console.log('\n=== Presente de cada verbo ===');
const ESPERADO = {
  'たべる':'たべます', 'みる':'みます', 'ねる':'ねます', 'おきる':'おきます',
  'のむ':'のみます', 'よむ':'よみます', 'きく':'ききます', 'いく':'いきます',
  'はなす':'はなします', 'かえる':'かえります',
  'する':'します', 'べんきょうする':'べんきょうします', 'くる':'きます'
};
VERBOS.forEach(v => {
  const r = raiz(v.k, v.g), dic = enKana(v.k);
  const afi = enKana(r + 'ます'), neg = enKana(r + 'ません');
  console.log('  ' + (v.k + '        ').slice(0, 22) + ' → ' + conRuby(r + 'ます') + '   [' + afi + ' / ' + neg + ']');
  comprobar(dic, afi, ESPERADO[dic]);
  comprobar(dic + ' (neg)', neg, ESPERADO[dic].replace(/ます$/, 'ません'));
  // el furigana conjugado tiene que seguir leyéndose bien
  comprobar(dic + ' (ruby)', sinCortes(leerHTML(conRuby(r + 'ます'))), afi);
});
comprobar('来る con kanji', raiz('来[く]る', 'irr'), '来[き]');
comprobar('13 verbos', VERBOS.length, 13);

// ── 3. Romaji de todo lo japonés de la página ──────────────────────────────
console.log('\n=== Romaji de cada palabra tocable ===');
// El contenido de cada .jp, contando los <span> de dentro (class="propio"…)
const jp = [...html.matchAll(/<span class="jp(?: head)?">/g)].map(m => {
  const ini = m.index + m[0].length, re = /<(\/?)span\b[^>]*>/g;
  re.lastIndex = ini;
  for(let nivel = 0, t; (t = re.exec(html)); ){
    if(!t[1]) nivel++;
    else if(nivel-- === 0) return html.slice(ini, t.index);
  }
});
const conRubyEnHTML = jp.filter(w => w.includes('<ruby>'));
conRubyEnHTML.forEach(w => console.log('  ' + w.replace(/<[^>]+>/g, '·').padEnd(30) + ' → ' + romajiDe(w)));
console.log('\n  (' + jp.length + ' palabras tocables, ' + conRubyEnHTML.length + ' con furigana)');

// ningún romaji puede llevar un kanji suelto
jp.forEach(w => { const r = romajiDe(w); if(/[一-鿿]/.test(r)) { fallos++; console.log('  ✗ kanji sin leer: ' + w + ' → ' + r); } });

// ── 3b. Romaji: palabras y vocales largas ─────────────────────────────────
console.log('\n=== Romaji: palabras y vocales largas ===');
[['がっこう','gakkō'], ['おおきい','ōkii'], ['とお','tō'], ['すうじ','sūji'], ['じゅういち','jūichi'],
 ['おかあさん','okāsan'], ['おねえさん','onēsan'], ['きょう','kyō'],
 ['じゃあ、これ<wbr>を ください','jā, kore o kudasai'],
 ['もう<wbr>いちど いって<wbr>ください','mō ichido itte kudasai'],
 ['<ruby>勉強<rt>べんきょう</rt></ruby><wbr>する','benkyō suru'],
 // se quedan: ii, ei, y las vocales de palabras distintas
 ['おにいさん','oniisan'], ['せんせい','sensei'], ['いい<wbr>です<wbr>ね','ii desu ne'],
 ['じゃ<wbr>ありません','ja arimasen'], ['で<wbr>は<wbr>ありません','de wa arimasen'],
 ['この うち','kono uchi'], ['きんえん',"kin'en"],
 // ー: también la i y la e
 ['コーヒー','kōhī'], ['ケーキ','kēki'], ['ビール','bīru'], ['うーん、ちょっと…','ūn, chotto…'],
 // partículas: solo si son palabra por sí solas
 ['わたし<wbr>は すし<wbr>です','watashi wa sushi desu'], ['うち<wbr>へ かえります','uchi e kaerimasu'],
 ['わたし<wbr>も','watashi mo'], ['はな','hana'], ['へや','heya'], ['これ<wbr>を','kore o'],
 ['にほん<wbr>の だいがく<wbr>の せんせい','nihon no daigaku no sensei'],
 ['なに<wbr>を たべます<wbr>か','nani o tabemasu ka'],
 // el borde del furigana es límite de morfema: ahí no se alarga
 ['<ruby>思<rt>おも</rt></ruby>う','omou'], ['<ruby>拾<rt>ひろ</rt></ruby>う','hirou'],
 ['<ruby>吸<rt>す</rt></ruby>う','suu'], ['<ruby>子<rt>こ</rt></ruby><ruby>馬<rt>うま</rt></ruby>','kouma'],
 ['<ruby>大<rt>おお</rt></ruby>きい','ōkii'], ['<ruby>東京<rt>とうきょう</rt></ruby>','tōkyō'],
 ['<ruby>東<rt>とう</rt>京<rt>きょう</rt></ruby>','tōkyō'], ['<ruby>原因<rt>げんいん</rt></ruby>',"gen'in"],
 ['<ruby>金<rt>きん</rt></ruby><ruby>曜<rt>よう</rt></ruby>','kin\'yō'],
 ['<ruby>行<rt>い</rt></ruby>こう','ikō'],
 // nombres propios con mayúscula y sufijos de trato con guion
 ['<span class="propio">たなか</span><wbr class="sufijo">さん<wbr>は <ruby>学生<rt>がくせい</rt></ruby><wbr>です<wbr>か','Tanaka-san wa gakusei desu ka'],
 ['<span class="propio">やまだ</span><wbr class="sufijo"><ruby>先生<rt>せんせい</rt></ruby>','Yamada-sensei'],
 ['<span class="propio"><ruby>大阪<rt>おおさか</rt></ruby></span>','Ōsaka'],
 ['<span class="propio"><ruby>京都<rt>きょうと</rt></ruby></span><wbr>に','Kyōto ni'],
 ['<span class="propio"><ruby>日本<rt>にほん</rt></ruby></span><wbr>の くるま','Nihon no kuruma'],
 ['<ruby>日本語<rt>にほんご</rt></ruby>','nihongo'], ['おかあさん','okāsan'],
 ['<span class="propio">メアリー</span><wbr class="sufijo">さん','Mearī-san'],
 // en kana suelto, el límite se marca a mano
 ['おも&zwnj;う','omou'], ['おもう','omō'], ['こ&zwnj;うま','kouma'],
 // puntuación: separa palabras, también la partícula de delante
 ['わたし<wbr>は、がくせい<wbr>です。','watashi wa, gakusei desu.'],
 ['ほんとう<wbr>です<wbr>か？','hontō desu ka?'], ['すごい！ いい<wbr>です<wbr>ね。','sugoi! ii desu ne.'],
 // préstamos
 ['ティー','tī'], ['ウォッカ','wokka'], ['ヴァイオリン','vaiorin'], ['ファン','fan'],
 ['ディズニー','dizunī'], ['パーティー','pātī'], ['ツアー','tsuā']
].forEach(([h, r]) => comprobar(h, romajiDe(h), r));

// el compuesto con する se pinta en dos palabras, en todas sus formas
const benkyo = VERBOS.find(v => v.k.startsWith('勉強'));
comprobar('勉強する', romajiDe(conRuby(enPalabras(benkyo, benkyo.k))), 'benkyō suru');
comprobar('勉強します', romajiDe(conRuby(enPalabras(benkyo, raiz(benkyo.k, 'irr') + 'ます'))), 'benkyō shimasu');
const suru = VERBOS.find(v => v.k === 'する');
comprobar('する', romajiDe(conRuby(enPalabras(suru, 'します'))), 'shimasu');

// ── 4. La versión: un solo sitio donde subirla ────────────────────────────
console.log('\n=== Versión ===');
if(alCargar) alCargar();
comprobar('URL de registro', registrado, 'sw.js?' + VER_HTML);
const sw = fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8');
const leeDeLaUrl = /VERSION = self\.location\.search\.slice\(1\)/.test(sw);
comprobar('sw.js saca la versión de su URL', leeDeLaUrl, true);
// lo que acabaría llamándose la caché, con esa URL
const search = '?' + registrado.split('?')[1];
comprobar('nombre de la caché', 'guia-japones-' + search.slice(1), 'guia-japones-' + VER_HTML);
console.log('  encabezado ' + VER_HTML + ' → ' + registrado + ' → caché guia-japones-' + VER_HTML);
comprobar('ya no queda la coletilla', /class="hint"/.test(html), false);

console.log(fallos ? '\n' + fallos + ' FALLOS' : '\nTodo correcto');
process.exit(fallos ? 1 : 0);
