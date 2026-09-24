// ==============================================
// CAPA DE COMUNICACIÓN CON EL BACKEND
// ==============================================
import { CONFIG } from '../config/config.js';

const BASE = CONFIG.API_URL;

export async function obtenerDatos() {
    const res = await fetch(`${BASE}${CONFIG.ENDPOINTS.DATOS}`);
    return await res.json();
}

export async function agregarRegistro(registro) {
    const res = await fetch(`${BASE}${CONFIG.ENDPOINTS.AGREGAR}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registro)
    });
    return await res.json();
}

export async function actualizarRegistro(dniOriginal, registro) {
    const res = await fetch(`${BASE}${CONFIG.ENDPOINTS.ACTUALIZAR}/${dniOriginal}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registro)
    });
    return await res.json();
}

export async function eliminarRegistro(dni) {
    const res = await fetch(`${BASE}${CONFIG.ENDPOINTS.ELIMINAR}/${dni}`, {
        method: 'DELETE'
    });
    return await res.json();
}