// Agregar SweetAlert2 dinámicamente
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
document.head.appendChild(script);

// Datos de las categorías
const categorias = {
    familia: ["PAPA", "MAMA", "HERMANO"],
    animales: ["PERRO", "GATO", "LEON", "ELEFANTE"],
    comida: ["MANZANA", "PAN", "QUESO", "SOPA"],
    nombres: ["JOHAN", "MARIA", "PEDRO", "LAURA"],
    numeros: ["UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE", "DIEZ"]
};

// Elementos del DOM
const pantallaCategorias = document.getElementById("pantalla-categorias");
const zonaJuego = document.getElementById("zona-juego");
const tituloCategoria = document.getElementById("titulo-categoria");
const zonaPalabra = document.getElementById("zona-palabra");
const letrasContainer = document.getElementById("letras");
const imagenPalabra = document.getElementById("imagen-palabra");
const puntajeElemento = document.getElementById("puntaje");

const btnComprobar = document.getElementById("comprobar");
const btnLimpiar = document.getElementById("limpiar");
const btnVolver = document.getElementById("volver");

// Variables globales
let categoriaActual = null;
let palabrasEncontradas = [];
let puntaje = 0;

// Sonidos
const sonidoLetra = new Audio("sounds/Sonic Ring.mp3");
const sonidoCorrecto = new Audio("sounds/Stage Win.mp3");
const sonidoIncorrecto = new Audio("sounds/Error.mp3");
const backgroundMusic = new Audio("sounds/stranger-things.mp3");

backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

// Botón de audio
const btnAudio = document.getElementById("btn-audio");
const iconoAudio = document.getElementById("icono-audio");

btnAudio.addEventListener("click", () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        iconoAudio.classList.replace("fa-volume-xmark", "fa-volume-high");
    } else {
        backgroundMusic.pause();
        iconoAudio.classList.replace("fa-volume-high", "fa-volume-xmark");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    backgroundMusic.play().catch(err => {
        console.log("Autoplay bloqueado por el navegador");
    });
});

// Iniciar categoría seleccionada
function iniciarCategoria(nombreCategoria) {
    categoriaActual = nombreCategoria;
    palabrasEncontradas = [];
    tituloCategoria.textContent = nombreCategoria.toUpperCase();
    togglePantallas();
    cargarPalabra();
}

// Alternar entre pantallas
function togglePantallas() {
    pantallaCategorias.classList.toggle("oculto");
    zonaJuego.classList.toggle("oculto");
}

// Cargar nueva palabra aleatoria
function cargarPalabra() {
    const disponibles = categorias[categoriaActual].filter(p => !palabrasEncontradas.includes(p));

    if (disponibles.length === 0) {
        Swal.fire({
            title: "¡Felicidades!",
            text: "Completaste la categoría.",
            icon: "success",
            confirmButtonText: "Volver al menú"
        }).then(() => {
            togglePantallas();
            zonaPalabra.innerHTML = "";
            letrasContainer.innerHTML = "";
        });
        return;
    }

    const palabra = disponibles[Math.floor(Math.random() * disponibles.length)];
    imagenPalabra.src = `img/${palabra.toLowerCase()}.png`;
    imagenPalabra.alt = `Imagen de ${palabra}`;
    zonaPalabra.innerHTML = "";
    mostrarLetras(palabra);
}

// Mostrar letras desordenadas
function mostrarLetras(palabra) {
    const letras = palabra.split('').sort(() => Math.random() - 0.5);
    letrasContainer.innerHTML = "";

    letras.forEach(letra => {
        const btn = document.createElement("button");
        btn.classList.add("letra");
        btn.textContent = letra;
        btn.addEventListener("click", () => {
            agregarLetra(letra);
            reproducirSonidoLetra();
        });
        letrasContainer.appendChild(btn);
    });
}

// Agregar letra a zona de construcción
function agregarLetra(letra) {
    const div = document.createElement("div");
    div.textContent = letra;
    div.classList.add("letra-agregada");
    zonaPalabra.appendChild(div);
}

// Reproducir sonido al hacer clic en letra
function reproducirSonidoLetra() {
    sonidoLetra.pause();
    sonidoLetra.currentTime = 0;
    sonidoLetra.play().catch(e => console.log("Error al reproducir sonido", e));
}

// Comprobar palabra formada
function comprobarPalabra() {
    const palabraFormada = Array.from(zonaPalabra.children).map(l => l.textContent).join("");

    if (categorias[categoriaActual].includes(palabraFormada)) {
        sonidoCorrecto.play();
        Swal.fire({
            title: "¡Correcto!",
            text: `Has formado la palabra: ${palabraFormada}`,
            icon: "success",
            confirmButtonText: "Continuar"
        }).then(() => {
            palabrasEncontradas.push(palabraFormada);
            puntaje += 10;
            puntajeElemento.textContent = puntaje;
            zonaPalabra.innerHTML = "";
            cargarPalabra();
        });
    } else {
        sonidoIncorrecto.play();
        Swal.fire({
            title: "Incorrecto",
            text: "Intenta de nuevo",
            icon: "error",
            confirmButtonText: "Reintentar"
        });
    }
}

// Botones de control
btnComprobar.addEventListener("click", comprobarPalabra);
btnLimpiar.addEventListener("click", () => {
    zonaPalabra.innerHTML = "";
});
btnVolver.addEventListener("click", () => {
    togglePantallas();
    zonaPalabra.innerHTML = "";
    letrasContainer.innerHTML = "";
});

// Selección de categorías
document.querySelectorAll(".categoria").forEach(btn => {
    btn.addEventListener("click", () => {
        iniciarCategoria(btn.dataset.categoria);
    });
});

// Precargar imágenes
function preloadImages(rutas) {
    rutas.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

preloadImages([
    'img/papa.png','img/mama.png','img/hermano.png',
    'img/perro.png','img/gato.png','img/leon.png','img/elefante.png',
    'img/pan.png','img/sopa.png','img/queso.png','img/manzana.png',
    'img/uno.png','img/dos.png','img/tres.png','img/cuatro.png','img/cinco.png',
    'img/seis.png','img/siete.png','img/ocho.png','img/nueve.png','img/diez.png'
]);
