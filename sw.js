const CACHE = "spotify2-v2";

const ARQUIVOS = [
    "./",
    "./index.html",
    "./admin.html",
    "./manifest.json",
    "./Spotify.png",
    "./CSS/style.css",
    "./CSS/usuario.css",
    "./JS/firebaseConfig.js",
    "./JS/main.js",
    "./JS/musicas.js",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

self.addEventListener("install", (e) => {
    e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)));
    self.skipWaiting();
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((chaves) =>
            Promise.all(chaves.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (e) => {
    const req = e.request;
    if (req.method !== "GET") return;

    const url = new URL(req.url);
    const mesmaOrigem = url.origin === self.location.origin;
    const sdkFirebase = url.hostname === "www.gstatic.com" && url.pathname.includes("/firebasejs/");

    // Só cacheia o app (arquivos seus) e o SDK do Firebase.
    // Firebase DB, Cloudinary (capas/áudios) e fontes passam direto pela rede.
    if (!mesmaOrigem && !sdkFirebase) return;

    // Network first, com fallback para o cache
    e.respondWith(
        fetch(req)
            .then((res) => {
                const copia = res.clone();
                caches.open(CACHE).then((c) => c.put(req, copia));
                return res;
            })
            .catch(() => caches.match(req))
    );
});