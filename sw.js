/* Service worker: la guía funciona sin conexión una vez abierta. */

var VERSION = 'v1';
var CACHE = 'guia-japones-' + VERSION;

/* Lo imprescindible, guardado al instalar. */
var CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

var FUENTES = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      // cache:'reload' evita que se guarde una copia rancia del propio navegador.
      return Promise.all(CORE.map(function(u){
        return c.add(new Request(u, {cache: 'reload'})).catch(function(){});
      }));
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(ks){
      return Promise.all(ks.map(function(k){ return k === CACHE ? null : caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;
  var url = new URL(req.url);
  var propio = url.origin === self.location.origin;

  // La página: primero la red (así una actualización se ve al momento),
  // y de paso se refresca la copia de reserva. Sin conexión, la guardada.
  if(req.mode === 'navigate'){
    e.respondWith(
      fetch(req).then(function(r){
        var copia = r.clone();
        caches.open(CACHE).then(function(c){ c.put('./index.html', copia); });
        return r;
      }).catch(function(){
        return caches.match('./index.html').then(function(r){ return r || caches.match('./'); });
      })
    );
    return;
  }

  // Tipografía de Google e iconos: primero la copia, y si no está, a la red.
  if(propio || FUENTES.test(req.url)){
    e.respondWith(
      caches.match(req).then(function(hit){
        if(hit) return hit;
        return fetch(req).then(function(r){
          var copia = r.clone();
          caches.open(CACHE).then(function(c){ c.put(req, copia); });
          return r;
        });
      })
    );
  }
});
