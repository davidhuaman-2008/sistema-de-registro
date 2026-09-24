// ==============================================
// PUNTO DE ENTRADA DEL SISTEMA
// ==============================================
import { obtenerDatos, agregarRegistro, actualizarRegistro, eliminarRegistro } from './api/api.js';
import { mostrarMensaje, cargarComponente, scrollArriba } from './utils/ui.js';
import { renderizarTabla } from './modules/tabla.js';
import { crearFiltros, aplicarFiltros } from './modules/filtros.js';
import {
    conectarCalculosAutomaticos,
    obtenerDatosFormulario,
    llenarFormulario,
    cambiarModoEdicion
} from './modules/formulario.js';

// ==============================================
// ESTADO GLOBAL
// ==============================================
const estado = {
    datos: [],
    dniEnEdicion: null
};

// ==============================================
// REFERENCIAS AL DOM
// ==============================================
const refs = {
    formulario: document.getElementById('formulario'),
    tablaDatos: document.getElementById('tablaDatos'),
    contador: document.getElementById('contador'),
    tituloFormulario: document.getElementById('tituloFormulario'),
    btnCancelar: document.getElementById('btnCancelar'),
    inputs: {
        nombre: document.getElementById('nombre'),
        apellido: document.getElementById('apellido'),
        edad: document.getElementById('edad'),
        fechaNacimiento: document.getElementById('fechaNacimiento'),
        dni: document.getElementById('dni'),
        celular: document.getElementById('celular'),
        ciudad: document.getElementById('ciudad')
    },
    filtros: {
        nombre: document.getElementById('filtroNombre'),
        dni: document.getElementById('filtroDNI'),
        edad: document.getElementById('filtroEdad'),
        ciudad: document.getElementById('filtroCiudad')
    }
};

// ==============================================
// FUNCIONES PRINCIPALES
// ==============================================
async function cargarYRenderizar() {
    try {
        estado.datos = await obtenerDatos();
        const filtrados = aplicarFiltros(estado.datos, refs.filtros);
        renderizarTabla(filtrados, refs.tablaDatos, refs.contador);
    } catch (error) {
        console.error(error);
        mostrarMensaje('Error al conectar con el servidor.', 'error');
    }
}

async function manejarSubmit(e) {
    e.preventDefault();
    const registro = obtenerDatosFormulario(refs.inputs);

    try {
        let respuesta;
        if (estado.dniEnEdicion) {
            respuesta = await actualizarRegistro(estado.dniEnEdicion, registro);
            if (respuesta.error) return mostrarMensaje(respuesta.error, 'error');
            mostrarMensaje('✅ Registro actualizado correctamente.');
            cancelarEdicion();
        } else {
            respuesta = await agregarRegistro(registro);
            if (respuesta.error) return mostrarMensaje(respuesta.error, 'error');
            mostrarMensaje('✅ Registro guardado en el Excel.');
            refs.formulario.reset();
        }
        await cargarYRenderizar();
    } catch (error) {
        console.error(error);
        mostrarMensaje('❌ Error de conexión.', 'error');
    }
}

function editar(dni) {
    const persona = estado.datos.find(p => String(p.dni) === String(dni));
    if (!persona) return;

    llenarFormulario(refs.inputs, persona);
    estado.dniEnEdicion = persona.dni;
    cambiarModoEdicion(refs.tituloFormulario, refs.btnCancelar, true);
    scrollArriba();
}

async function eliminar(dni) {
    if (!confirm(`¿Eliminar el registro con DNI ${dni}?`)) return;

    try {
        const respuesta = await eliminarRegistro(dni);
        if (respuesta.error) return mostrarMensaje(respuesta.error, 'error');
        mostrarMensaje('🗑️ Registro eliminado.');
        await cargarYRenderizar();
    } catch (error) {
        mostrarMensaje('❌ Error al eliminar.', 'error');
    }
}

function cancelarEdicion() {
    refs.formulario.reset();
    estado.dniEnEdicion = null;
    cambiarModoEdicion(refs.tituloFormulario, refs.btnCancelar, false);
}

function manejarClickTabla(e) {
    const btn = e.target.closest('button[data-accion]');
    if (!btn) return;

    const { accion, dni } = btn.dataset;
    if (accion === 'editar') editar(dni);
    if (accion === 'eliminar') eliminar(dni);
}

// ==============================================
// INICIALIZACIÓN
// ==============================================
async function init() {
    // Cargar componentes HTML externos
    await cargarComponente('header-placeholder', 'components/header.html');
    await cargarComponente('footer-placeholder', 'components/footer.html');

    // Conectar eventos
    refs.formulario.addEventListener('submit', manejarSubmit);
    refs.tablaDatos.addEventListener('click', manejarClickTabla);
    refs.btnCancelar.addEventListener('click', cancelarEdicion);

    // Cálculos automáticos (edad ↔ fecha)
    conectarCalculosAutomaticos(refs.inputs);

    // Filtros en tiempo real
    crearFiltros(refs.filtros, cargarYRenderizar);

    // Cargar datos iniciales
    await cargarYRenderizar();
}

init();