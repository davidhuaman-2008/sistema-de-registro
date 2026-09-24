// ==============================================
// UTILIDADES DE INTERFAZ
// ==============================================
import { CONFIG } from '../config/config.js';

let timeoutMensaje = null;

export function mostrarMensaje(texto, tipo = 'ok') {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.textContent = texto;
    mensajeDiv.className = `mensaje show ${tipo}`;

    if (timeoutMensaje) clearTimeout(timeoutMensaje);
    timeoutMensaje = setTimeout(() => {
        mensajeDiv.className = 'mensaje';
    }, CONFIG.TIEMPO_MENSAJE);
}

export function scrollArriba() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cargar componentes HTML (header, footer)
export async function cargarComponente(id, ruta) {
    try {
        const res = await fetch(ruta);
        const html = await res.text();
        document.getElementById(id).innerHTML = html;
    } catch (error) {
        console.error(`Error cargando ${ruta}:`, error);
    }
}