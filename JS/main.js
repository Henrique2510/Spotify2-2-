import { database } from "./firebaseConfig.js";
import { ref, push, set, get, remove, update } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";
 
const musicasRef = ref(database, "musicas");
 
const fundoTransparente = document.getElementById("fundoTransparente");
const botaoCriar = document.getElementById("novaMusica");
const botaoVoltar = document.getElementById("voltar");
const titulo = document.getElementById("titulo");
const artista = document.getElementById("artista");
const estilo = document.getElementById("estilo");
const capaURL = document.getElementById("capaURL");
const audioURL = document.getElementById("audioURL");
const salvarMusica = document.getElementById("salvarMusica");
 
const listarMusicas = document.getElementById("listaMusicas");
const descricao = document.getElementById("conteudoDescricao");
const player = document.getElementById("player");
const listaCurtidas = document.getElementById("listaCurtidas");
 
let editando = null;
 
 
 
// Funções ------//------//------//------//------//------//------//------//------//------//------//------//------//
 
async function criarMusica(titulo, artista, estilo, capaURL, audioURL) {
    const novaMusica = push(musicasRef);
    await set(novaMusica, { titulo, artista, estilo, capaURL, audioURL });
}
 
async function atualizarMusica(id, dados) {
    await update(ref(database, `musicas/${id}`), dados);
}
 
async function excluirMusica(id, nome) {
    if (!confirm(`Excluir "${nome}"?`)) return;
 
    await remove(ref(database, `musicas/${id}`));
 
    listarMusica();
}
 
async function curtirMusica(id, curtida) {
    await set(ref(database, `musicas/${id}/curtida`), !curtida);
 
    listarMusica();
}
 
async function enviarImagemCloudinary(arquivo) {
    const formData = new FormData();
    formData.append("file", arquivo);
    formData.append("upload_preset", "pvmsaygd");
 
    const resposta = await fetch("https://api.cloudinary.com/v1_1/kbraoyzh/image/upload", { method: "POST", body: formData });
    const dados = await resposta.json();
 
    return dados.secure_url;
}
 
async function enviarAudioCloudinary(arquivo) {
    const formData = new FormData();
    formData.append("file", arquivo);
    formData.append("upload_preset", "pvmsaygd");
 
    const resposta = await fetch("https://api.cloudinary.com/v1_1/kbraoyzh/video/upload", { method: "POST", body: formData });
    const dados = await resposta.json();
 
    return dados.secure_url;
}
 
function abrirEdicao(id, musica) {
    editando = { id, musica };
 
    titulo.value = musica.titulo;
    artista.value = musica.artista;
    estilo.value = musica.estilo;
    salvarMusica.textContent = "Atualizar";
 
    fundoTransparente.style.display = "flex";
}
 
function fecharFormulario() {
    fundoTransparente.style.display = "none";
    editando = null;
    salvarMusica.textContent = "Salvar";
}
 
function limparFormulario() {
    titulo.value = "";
    artista.value = "";
    estilo.value = "";
    capaURL.value = "";
    audioURL.value = "";
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
 
            // Botao Curtida
            const btnCurtir = document.createElement("button");
            btnCurtir.className = "btnCurtir";
            if (musica.curtida) btnCurtir.classList.add("ativo");
            btnCurtir.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>`;
 
            btnCurtir.addEventListener("click", (e) => {
                e.stopPropagation();
                curtirMusica(id, musica.curtida);
            });
 
            li.appendChild(btnCurtir);
 
            // Botao Editar
            const btnEditar = document.createElement("button");
            btnEditar.className = "btnEditar";
            btnEditar.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`;
 
            btnEditar.addEventListener("click", (e) => {
                e.stopPropagation();
                abrirEdicao(id, musica);
            });
 
            li.appendChild(btnEditar);
 
            // Botao Excluir
            const btnExcluir = document.createElement("button");
            btnExcluir.className = "btnExcluir";
            btnExcluir.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash preview-icon"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
 
            btnExcluir.addEventListener("click", (e) => {
                e.stopPropagation();
                excluirMusica(id, musica.titulo);
            });
 
            li.appendChild(btnExcluir);
 
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
 
            // Lista Curtidas
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
}
 
// Eventos de botões ------//------//------//------//------//------//------//------//------//------//------//------//
 
botaoCriar.addEventListener("click", () => {
    limparFormulario();
    fundoTransparente.style.display = "flex";
});
 
botaoVoltar.addEventListener("click", fecharFormulario);
 
salvarMusica.addEventListener("click", async () => {
    const arquivoImagem = capaURL.files[0];
    const arquivoAudio = audioURL.files[0];
 
    if (titulo.value === "" || artista.value === "" || estilo.value === "") {
        return alert("Preencha todos os campos!!!");
    }
 
    if (!editando && (arquivoImagem === undefined || arquivoAudio === undefined)) {
        return alert("Preencha todos os campos!!!");
    }
 
    salvarMusica.disabled = true;
    salvarMusica.textContent = "Salvando...";
 
    const urlImagem = arquivoImagem ? await enviarImagemCloudinary(arquivoImagem) : editando.musica.capaURL;
    const urlAudio = arquivoAudio ? await enviarAudioCloudinary(arquivoAudio) : editando.musica.audioURL;
 
    if (editando) {
        await atualizarMusica(editando.id, { titulo: titulo.value, artista: artista.value, estilo: estilo.value, capaURL: urlImagem, audioURL: urlAudio });
    } else {
        await criarMusica(titulo.value, artista.value, estilo.value, urlImagem, urlAudio);
    }
 
    fecharFormulario();
    limparFormulario();
 
    salvarMusica.disabled = false;
 
    listarMusica();
});
 
listarMusica();
 
const campoPesquisa = document.getElementById("pesquisar");
 
function filtrarMusicas() {
    const termo = campoPesquisa.value.trim().toLowerCase();
 
    listarMusicas.querySelectorAll("li").forEach((li) => {
        const nome = li.querySelector("span").textContent.split("|")[0].trim().toLowerCase();
        li.style.display = nome.includes(termo) ? "" : "none";
    });
}
 
campoPesquisa.addEventListener("input", filtrarMusicas);
 
new MutationObserver(filtrarMusicas).observe(listarMusicas, { childList: true });
