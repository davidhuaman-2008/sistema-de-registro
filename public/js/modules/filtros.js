// ==============================================
// MÓDULO: FILTROS EN TIEMPO REAL
// ==============================================
export function crearFiltros(referencias, alCambiar) {
    Object.values(referencias).forEach(input => {
        input.addEventListener('input', alCambiar);
    });
}

export function aplicarFiltros(datos, filtros) {
    return datos.filter(p => {
        const nombre = `${p.nombre || ''} ${p.apellido || ''}`.toLowerCase();
        const dni = String(p.dni || '').toLowerCase();
        const edad = String(p.edad || '');
        const ciudad = String(p.ciudad || '').toLowerCase();

        return (
            nombre.includes(filtros.nombre.value.toLowerCase()) &&
            dni.includes(filtros.dni.value.toLowerCase()) &&
            edad.includes(filtros.edad.value) &&
            ciudad.includes(filtros.ciudad.value.toLowerCase())
        );
    });
}