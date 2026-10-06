import { database } from "./firebaseConfig.js";
import { ref, get, set } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";
 
const musicasRef = ref(database, "musicas");
 
const listarMusicas = document.getElementById("listaMusicas");
const descricao = document.getElementById("conteudoDescricao");
const player = document.getElementById("player");
const listaCurtidas = document.getElementById("listaCurtidas");
const campoPesquisa = document.getElementById("pesquisar");
 
async function curtirMusica(id, curtida) {
    await set(ref(database, `musicas/${id}/curtida`), !curtida);
 
    listarMusica();
}
 
async function listarMusica() {
    const snapshot = await get(musicasRef);
 
    listarMusicas.innerHTML = "";
    listaCurtidas.innerHTML = "";
 
    if (snapshot.exists()) {
        const musicas = snapshot.val();
 
        for (const id in musicas) {
            const musica = musicas[id];
 
            const li = document.createElement("li");
 
            const img = document.createElement("img");
            img.src = musica.capaURL;
            li.appendChild(img);
 
            const texto = document.createElement("span");
            texto.textContent = `${musica.titulo} | ${musica.artista}`;
            li.appendChild(texto);
 
            const btnCurtir = document.createElement("button");
            btnCurtir.className = "btnCurtir";
            if (musica.curtida) btnCurtir.classList.add("ativo");
            btnCurtir.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>`;
 
            btnCurtir.addEventListener("click", (e) => {
                e.stopPropagation();
                curtirMusica(id, musica.curtida);
            });
 
            li.appendChild(btnCurtir);
 
            li.addEventListener("click", () => {
                descricao.innerHTML = `
                <img src="${musica.capaURL}">
                <h2>${musica.titulo}</h2>
                <p>${musica.artista}</p>
                <p>${musica.estilo}</p>`;
 
                player.src = musica.audioURL;
                player.play();
            });
 
            listarMusicas.appendChild(li);
 
            if (musica.curtida) {
                const liCurtida = document.createElement("li");
 
                const imgCurtida = document.createElement("img");
                imgCurtida.src = musica.capaURL;
                liCurtida.appendChild(imgCurtida);
 
                const textoCurtida = document.createElement("span");
                textoCurtida.textContent = musica.titulo;
                liCurtida.appendChild(textoCurtida);
 
                liCurtida.addEventListener("click", () => li.click());
 
                listaCurtidas.appendChild(liCurtida);
            }
        }
    }
 
    filtrarMusicas();
}
 
function filtrarMusicas() {
    const termo = campoPesquisa.value.trim().toLowerCase();
 
    listarMusicas.querySelectorAll("li").forEach((li) => {
        const nome = li.querySelector("span").textContent.split("|")[0].trim().toLowerCase();
        li.style.display = nome.includes(termo) ? "" : "none";
    });
}
 
campoPesquisa.addEventListener("input", filtrarMusicas);
 
listarMusica();
 