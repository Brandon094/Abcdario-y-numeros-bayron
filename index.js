// Agregar la librería SweetAlert2
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
document.head.appendChild(script);

// Objeto que contiene las categorías y sus respectivas palabras
const categorias = {
    familia: ["PAPA", "MAMA", "HERMANO"],
    animales: ["PERRO", "GATO", "LEON", "ELEFANTE"],
    comida: ["MANZANA", "PAN", "QUESO", "SOPA"],
    nombres: ["JOHAN", "MARIA", "PEDRO", "LAURA"],
    numeros: ["UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE", "DIEZ"]
};

// Variables globales
let categoriaActual = null;
let palabrasEncontradas = [];
let puntaje = 0;

function iniciarCategoria(categoria) {
    categoriaActual = categoria;
    document.getElementById("pantalla-categorias").style.display = "none";
    document.getElementById("zona-juego").style.display = "block";
    document.getElementById("titulo-categoria").textContent = categoria.toUpperCase();
    cargarPalabra();
}

function cargarPalabra() {
    let palabras = categorias[categoriaActual].filter(p => !palabrasEncontradas.includes(p));

    if (palabras.length === 0) {
        Swal.fire({
            title: "¡Felicidades!",
            text: "Completaste la categoría.",
            icon: "success",
            confirmButtonText: "Volver al menú"
        }).then(() => {
            document.getElementById("pantalla-categorias").style.display = "block";
            document.getElementById("zona-juego").style.display = "none";
        });
        return;
    }

    let palabra = palabras[Math.floor(Math.random() * palabras.length)];
    document.getElementById("imagen-palabra").src = `img/${palabra.toLowerCase()}.png`;
    document.getElementById("imagen-palabra").alt = `Imagen de ${palabra}`;
    document.getElementById("zona-palabra").innerHTML = "";
    mostrarLetras(palabra);
}

function mostrarLetras(palabra) {
    let letras = palabra.split('').sort(() => Math.random() - 0.5);
    let zonaLetras = document.getElementById("letras");
    zonaLetras.innerHTML = "";

    letras.forEach(letra => {
        let btn = document.createElement("button");
        btn.textContent = letra;
        btn.classList.add("letra");
        btn.addEventListener("click", () => {
            agregarLetra(letra);
            reproducirSonido();
        });
        zonaLetras.appendChild(btn);
    });
}

const letterSound = new Audio("sounds/Sonic Ring.mp3");

function reproducirSonido() {
    letterSound.pause();
    letterSound.currentTime = 0;
    letterSound.play().catch(error => console.error("Error al reproducir el sonido:", error));
}

function agregarLetra(letra) {
    let div = document.createElement("div");
    div.textContent = letra;
    div.classList.add("letra-agregada");
    document.getElementById("zona-palabra").appendChild(div);
}

function comprobarPalabra() {
    let palabraFormada = Array.from(document.getElementById("zona-palabra").children)
        .map(letra => letra.textContent).join('');

    // Crear los elementos de audio
    const sonidoCorrecto = new Audio("sounds/Stage Win.mp3");
    const sonidoIncorrecto = new Audio("sounds/Error.mp3");

    if (categorias[categoriaActual].includes(palabraFormada)) {
        // Reproducir sonido de acierto
        sonidoCorrecto.play();
        Swal.fire({
            title: "¡Correcto!",
            text: "Has encontrado la palabra: " + palabraFormada,
            icon: "success",
            confirmButtonText: "Continuar"
        }).then(() => {
            palabrasEncontradas.push(palabraFormada);
            puntaje += 10;
            document.getElementById("puntaje").textContent = puntaje;
            cargarPalabra();
        });
    } else {
        // Reproducir sonido de error
        sonidoIncorrecto.play();
        Swal.fire({
            title: "Incorrecto",
            text: "Intenta de nuevo",
            icon: "error",
            confirmButtonText: "Reintentar"
        });
    }
}

document.querySelectorAll(".categoria").forEach(btn => {
    btn.addEventListener("click", function () {
        iniciarCategoria(this.dataset.categoria);
    });
});

document.getElementById("comprobar").addEventListener("click", comprobarPalabra);
document.getElementById("limpiar").addEventListener("click", () => {
    document.getElementById("zona-palabra").innerHTML = "";
});

document.getElementById("volver").addEventListener("click", () => {
    document.getElementById("pantalla-categorias").style.display = "block";
    document.getElementById("zona-juego").style.display = "none";
});

function preloadImages(imageArray) {
    imageArray.forEach(src => {
        let img = new Image();
        img.src = src;
    });
}

preloadImages([
    'img/papa.png','img/mama.png','img/hermano.png',
    'img/leon.png', 'img/perro.png', 'img/gato.png', 'img/elefante.png',
    'img/pan.png', 'img/sopa.png', 'img/queso.png', 'img/manzana.png',
    'img/uno.png', 'img/dos.png', 'img/tres.png', 'img/cuatro.png', 'img/cinco.png',
    'img/seis.png', 'img/siete.png', 'img/ocho.png', 'img/nueve.png', 'img/diez.png'
]);

// Reproducir música de fondo
const backgroundMusic = new Audio("sounds/stranger-things.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;
backgroundMusic.play().catch(error => console.log("Auto-play bloqueado por el navegador", error));

const btnAudio = document.getElementById("btn-audio");
const iconoAudio = document.getElementById("icono-audio");

btnAudio.addEventListener("click", () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        iconoAudio.classList.remove("fa-volume-xmark");
        iconoAudio.classList.add("fa-volume-high");
    } else {
        backgroundMusic.pause();
        iconoAudio.classList.remove("fa-volume-high");
        iconoAudio.classList.add("fa-volume-xmark");
    }
});
