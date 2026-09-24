// ==============================================
// MÓDULO: FORMULARIO (CREAR / EDITAR)
// ==============================================
import {
    calcularEdad,
    calcularFechaDesdeEdad,
    convertirAInputDate,
    fechaISOASerial
} from '../utils/fechas.js';

export function conectarCalculosAutomaticos(inputs) {
    // Edad → Fecha
    inputs.edad.addEventListener('input', () => {
        const edad = inputs.edad.value;
        if (edad !== '' && !isNaN(edad)) {
            inputs.fechaNacimiento.value = calcularFechaDesdeEdad(edad);
        }
    });

    // Fecha → Edad
    inputs.fechaNacimiento.addEventListener('change', () => {
        if (inputs.fechaNacimiento.value) {
            inputs.edad.value = calcularEdad(inputs.fechaNacimiento.value);
        }
    });
}

export function obtenerDatosFormulario(inputs) {
    const fechaISO = inputs.fechaNacimiento.value;
    return {
        nombre: inputs.nombre.value.trim(),
        apellido: inputs.apellido.value.trim(),
        edad: parseInt(inputs.edad.value),
        fechaNacimiento: fechaISOASerial(fechaISO),
        dni: inputs.dni.value.trim(),
        celular: inputs.celular.value.trim(),
        ciudad: inputs.ciudad.value.trim()
    };
}

export function llenarFormulario(inputs, persona) {
    inputs.nombre.value = persona.nombre || '';
    inputs.apellido.value = persona.apellido || '';
    inputs.edad.value = persona.edad || '';
    inputs.fechaNacimiento.value = convertirAInputDate(persona.fechaNacimiento);
    inputs.dni.value = persona.dni || '';
    inputs.celular.value = persona.celular || '';
    inputs.ciudad.value = persona.ciudad || '';
}

export function cambiarModoEdicion(titulo, btnCancelar, activo) {
    if (activo) {
        titulo.textContent = '✏️ Editar Registro';
        btnCancelar.style.display = 'inline-flex';
    } else {
        titulo.textContent = 'Agregar Nuevo Registro';
        btnCancelar.style.display = 'none';
    }
}