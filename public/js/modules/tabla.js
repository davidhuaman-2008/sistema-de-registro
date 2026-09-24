// ==============================================
// MÓDULO: RENDERIZADO DE LA TABLA
// ==============================================
import { formatearFecha } from '../utils/fechas.js';

export function renderizarTabla(datos, contenedor, contador) {
    contenedor.innerHTML = '';
    contador.textContent = datos.length;

    if (datos.length === 0) {
        contenedor.innerHTML = '<tr><td colspan="8" class="empty">No se encontraron registros.</td></tr>';
        return;
    }

    const fragmento = document.createDocumentFragment();

    datos.forEach(p => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${p.nombre || ''}</td>
            <td>${p.apellido || ''}</td>
            <td>${p.edad || ''}</td>
            <td>${formatearFecha(p.fechaNacimiento)}</td>
            <td>${p.dni || ''}</td>
            <td>${p.celular || ''}</td>
            <td>${p.ciudad || ''}</td>
            <td class="actions-cell">
                <button class="btn btn-warning btn-sm" data-accion="editar" data-dni="${p.dni}">✏️</button>
                <button class="btn btn-danger btn-sm" data-accion="eliminar" data-dni="${p.dni}">🗑️</button>
            </td>
        `;
        fragmento.appendChild(fila);
    });

    contenedor.appendChild(fragmento);
}