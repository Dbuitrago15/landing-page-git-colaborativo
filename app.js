// =========================================================
// NubeFlow - Interactividad
// Estudiante 3 (El Interactor) - rama-js
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    // 1. Botón principal: saluda al usuario con un alert
    const botonSaludo = document.getElementById("btn-saludo");

    if (botonSaludo) {
        botonSaludo.addEventListener("click", function () {
            const nombre = prompt("¿Cómo te llamas?");
            const saludo = nombre && nombre.trim() !== "" ? nombre.trim() : "visitante";
            alert("¡Hola, " + saludo + "! Bienvenido a NubeFlow ☁️");
        });
    }

    // 2. Botón de tema: cambia el color de fondo (modo claro / oscuro)
    const botonTema = document.getElementById("btn-tema");

    if (botonTema) {
        botonTema.addEventListener("click", function () {
            const oscuro = document.body.classList.toggle("tema-oscuro");
            botonTema.textContent = oscuro ? "☀️ Modo claro" : "🌙 Modo oscuro";
        });
    }

    // 3. Formulario de contacto: confirma el envío sin recargar la página
    const formulario = document.querySelector(".formulario");

    if (formulario) {
        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault();
            const nombre = document.getElementById("nombre").value.trim() || "amigo";
            alert("¡Gracias, " + nombre + "! Recibimos tu mensaje y te responderemos pronto.");
            formulario.reset();
        });
    }
});
