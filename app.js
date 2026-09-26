// =========================================================
// NubeFlow - Interactividad
// Estudiante 3 (El Interactor) - rama-js
// =========================================================

// Indica al CSS que JavaScript está activo (habilita las animaciones de aparición)
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {

    const soportaObserver = "IntersectionObserver" in window;

    // 1. Botones de registro: saludan al usuario con un alert
    document.querySelectorAll('[data-accion="saludo"]').forEach(function (boton) {
        boton.addEventListener("click", function () {
            const nombre = prompt("¿Cómo te llamas?");
            const saludo = nombre && nombre.trim() !== "" ? nombre.trim() : "visitante";
            alert("¡Hola, " + saludo + "! Bienvenido a NubeFlow. Tu cuenta gratuita de 15 GB te espera.");
        });
    });

    // 2. Modo claro / oscuro (cambia el color de fondo y recuerda la preferencia)
    const botonTema = document.getElementById("btn-tema");

    function aplicarTema(oscuro) {
        document.body.classList.toggle("tema-oscuro", oscuro);
        if (botonTema) {
            botonTema.setAttribute("aria-label", oscuro ? "Activar modo claro" : "Activar modo oscuro");
        }
    }

    let temaGuardado = null;
    try {
        temaGuardado = localStorage.getItem("nubeflow-tema");
    } catch (error) {
        temaGuardado = null;
    }
    const sistemaOscuro = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    aplicarTema(temaGuardado ? temaGuardado === "oscuro" : sistemaOscuro);

    if (botonTema) {
        botonTema.addEventListener("click", function () {
            const oscuro = !document.body.classList.contains("tema-oscuro");
            aplicarTema(oscuro);
            try {
                localStorage.setItem("nubeflow-tema", oscuro ? "oscuro" : "claro");
            } catch (error) {
                // Si el navegador bloquea el almacenamiento, el tema funciona igual sin recordarse
            }
        });
    }

    // 3. Menú móvil (hamburguesa)
    const botonMenu = document.getElementById("btn-menu");
    const menu = document.getElementById("menu-principal");

    function cerrarMenu() {
        if (!menu || !botonMenu) return;
        menu.classList.remove("abierto");
        botonMenu.setAttribute("aria-expanded", "false");
        botonMenu.setAttribute("aria-label", "Abrir menú");
    }

    if (botonMenu && menu) {
        botonMenu.addEventListener("click", function () {
            const abierto = menu.classList.toggle("abierto");
            botonMenu.setAttribute("aria-expanded", String(abierto));
            botonMenu.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
        });

        menu.querySelectorAll("a").forEach(function (enlace) {
            enlace.addEventListener("click", cerrarMenu);
        });

        document.addEventListener("keydown", function (evento) {
            if (evento.key === "Escape") cerrarMenu();
        });
    }

    // 4. Encabezado con sombra y botón "volver arriba" al hacer scroll
    const encabezado = document.querySelector(".encabezado");
    const botonArriba = document.getElementById("btn-arriba");

    function alHacerScroll() {
        const desplazamiento = window.scrollY;
        if (encabezado) encabezado.classList.toggle("con-sombra", desplazamiento > 10);
        if (botonArriba) botonArriba.classList.toggle("visible", desplazamiento > 600);
    }

    window.addEventListener("scroll", alHacerScroll, { passive: true });
    alHacerScroll();

    // 5. Resaltar en el menú la sección que se está viendo
    const enlacesMenu = document.querySelectorAll(".menu a");

    if (soportaObserver && enlacesMenu.length) {
        const observadorSecciones = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (!entrada.isIntersecting) return;
                enlacesMenu.forEach(function (enlace) {
                    enlace.classList.toggle("activo", enlace.getAttribute("href") === "#" + entrada.target.id);
                });
            });
        }, { rootMargin: "-45% 0px -50% 0px" });

        document.querySelectorAll("main section[id]").forEach(function (seccion) {
            observadorSecciones.observe(seccion);
        });
    }

    // 6. Animación de aparición de tarjetas al hacer scroll
    const elementosRevelar = document.querySelectorAll(".revelar");

    if (soportaObserver) {
        const observadorRevelar = new IntersectionObserver(function (entradas, observador) {
            entradas.forEach(function (entrada) {
                if (!entrada.isIntersecting) return;
                const elemento = entrada.target;
                elemento.classList.add("visible");
                observador.unobserve(elemento);
                // Quita el retraso escalonado para que el efecto hover responda al instante
                setTimeout(function () {
                    elemento.style.transitionDelay = "";
                }, 900);
            });
        }, { threshold: 0.15 });

        elementosRevelar.forEach(function (elemento, indice) {
            elemento.style.transitionDelay = (indice % 3) * 0.1 + "s";
            observadorRevelar.observe(elemento);
        });
    } else {
        elementosRevelar.forEach(function (elemento) {
            elemento.classList.add("visible");
        });
    }

    // 7. Contadores animados de la sección de cifras
    function formatearNumero(valor, decimales) {
        return valor.toLocaleString("es-CO", {
            minimumFractionDigits: decimales,
            maximumFractionDigits: decimales
        });
    }

    function animarContador(elemento) {
        const objetivo = parseFloat(elemento.dataset.objetivo);
        const decimales = parseInt(elemento.dataset.decimales || "0", 10);
        const prefijo = elemento.dataset.prefijo || "";
        const sufijo = elemento.dataset.sufijo || "";
        const duracion = 1600;
        const inicio = performance.now();

        function paso(ahora) {
            const progreso = Math.min((ahora - inicio) / duracion, 1);
            const suavizado = 1 - Math.pow(1 - progreso, 3);
            elemento.textContent = prefijo + formatearNumero(objetivo * suavizado, decimales) + sufijo;
            if (progreso < 1) requestAnimationFrame(paso);
        }

        requestAnimationFrame(paso);
    }

    const contadores = document.querySelectorAll(".cifra-valor[data-objetivo]");

    if (soportaObserver) {
        const observadorContadores = new IntersectionObserver(function (entradas, observador) {
            entradas.forEach(function (entrada) {
                if (!entrada.isIntersecting) return;
                animarContador(entrada.target);
                observador.unobserve(entrada.target);
            });
        }, { threshold: 0.5 });

        contadores.forEach(function (contador) {
            observadorContadores.observe(contador);
        });
    }

    // 8. Selector de precios mensual / anual
    const botonesPeriodo = document.querySelectorAll(".periodo");

    botonesPeriodo.forEach(function (boton) {
        boton.addEventListener("click", function () {
            const periodo = boton.dataset.periodo;

            botonesPeriodo.forEach(function (otro) {
                const activo = otro === boton;
                otro.classList.toggle("activo", activo);
                otro.setAttribute("aria-pressed", String(activo));
            });

            document.querySelectorAll(".planes [data-mensual]").forEach(function (elemento) {
                elemento.textContent = elemento.dataset[periodo];
            });
        });
    });

    // 9. Formulario de contacto: confirma el envío sin recargar la página
    const formulario = document.querySelector(".formulario");
    const estado = document.getElementById("formulario-estado");

    if (formulario) {
        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault();
            const nombre = document.getElementById("nombre").value.trim() || "amigo";
            const mensaje = "¡Gracias, " + nombre + "! Recibimos tu mensaje y te responderemos pronto.";
            if (estado) {
                estado.textContent = mensaje;
            } else {
                alert(mensaje);
            }
            formulario.reset();
        });
    }

    // 10. Año actual en el pie de página
    const anio = document.getElementById("anio");
    if (anio) anio.textContent = new Date().getFullYear();
});
