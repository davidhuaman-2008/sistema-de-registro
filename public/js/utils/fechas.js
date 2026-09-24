// ==============================================
// UTILIDADES DE FECHAS
// ==============================================

// Número de serie Excel → DD/MM/AAAA
export function formatearFecha(fecha) {
    if (fecha === null || fecha === undefined || fecha === '') return '';

    if (typeof fecha === 'number') {
        const date = new Date((fecha - 25569) * 86400 * 1000);
        const d = String(date.getUTCDate()).padStart(2, '0');
        const m = String(date.getUTCMonth() + 1).padStart(2, '0');
        const y = date.getUTCFullYear();
        return `${d}/${m}/${y}`;
    }

    if (typeof fecha === 'string' && fecha.includes('-')) {
        const [y, m, d] = fecha.split('T')[0].split('-');
        return `${d}/${m}/${y}`;
    }

    return fecha;
}

// Número de serie Excel → YYYY-MM-DD (para <input type="date">)
export function convertirAInputDate(fecha) {
    if (fecha === null || fecha === undefined || fecha === '') return '';

    if (typeof fecha === 'number') {
        const date = new Date((fecha - 25569) * 86400 * 1000);
        return date.toISOString().split('T')[0];
    }

    if (typeof fecha === 'string' && fecha.includes('/')) {
        const [d, m, y] = fecha.split('/');
        return `${y}-${m}-${d}`;
    }

    return fecha.split('T')[0];
}

// Calcular edad desde fecha ISO
export function calcularEdad(fechaISO) {
    if (!fechaISO) return '';
    const hoy = new Date();
    const nac = new Date(fechaISO);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const mes = hoy.getMonth() - nac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad;
}

// Calcular fecha ISO desde edad
export function calcularFechaDesdeEdad(edad) {
    if (edad === '' || edad === null || edad === undefined) return '';
    const hoy = new Date();
    const anio = hoy.getFullYear() - parseInt(edad);
    const fecha = new Date(anio, hoy.getMonth(), hoy.getDate());
    return fecha.toISOString().split('T')[0];
}

// Fecha ISO → número de serie Excel (para guardar)
export function fechaISOASerial(fechaISO) {
    if (!fechaISO) return '';
    return Math.floor(new Date(fechaISO + 'T00:00:00Z').getTime() / 86400000) + 25569;
}