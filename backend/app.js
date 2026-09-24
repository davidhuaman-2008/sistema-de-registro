// ==============================================
// BLOQUE 1: IMPORTACIONES Y CONFIGURACIÓN
// ==============================================
const express = require('express');
const XLSX = require('xlsx');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const ARCHIVO_EXCEL = path.join(__dirname, '..', 'database', 'datos.xlsx');
const CARPETA_PUBLICA = path.join(__dirname, '..', 'public');

app.use(cors());
app.use(express.json());
app.use(express.static(CARPETA_PUBLICA));

// ==============================================
// BLOQUE 2: FUNCIONES DE ACCESO AL EXCEL
// ==============================================
function leerExcel() {
    if (!fs.existsSync(ARCHIVO_EXCEL)) return [];
    const workbook = XLSX.readFile(ARCHIVO_EXCEL);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
}

function escribirExcel(datos) {
    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");
    XLSX.writeFile(workbook, ARCHIVO_EXCEL);
}

// ==============================================
// BLOQUE 3: API REST - ENDPOINTS
// ==============================================
app.get('/api/datos', (req, res) => {
    try {
        res.json(leerExcel());
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al leer el Excel" });
    }
});

app.post('/api/agregar', (req, res) => {
    try {
        const nuevo = req.body;
        const datos = leerExcel();

        if (nuevo.dni && datos.some(d => d.dni == nuevo.dni)) {
            return res.status(400).json({ error: "Ya existe un registro con ese DNI" });
        }

        datos.push(nuevo);
        escribirExcel(datos);
        res.json({ mensaje: "Registro agregado", registro: nuevo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al agregar" });
    }
});

app.put('/api/actualizar/:dniOriginal', (req, res) => {
    try {
        const { dniOriginal } = req.params;
        const actualizado = req.body;
        const datos = leerExcel();

        const index = datos.findIndex(d => d.dni == dniOriginal);
        if (index === -1) {
            return res.status(404).json({ error: "Registro no encontrado" });
        }

        datos[index] = actualizado;
        escribirExcel(datos);
        res.json({ mensaje: "Registro actualizado", registro: actualizado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar" });
    }
});

app.delete('/api/eliminar/:dni', (req, res) => {
    try {
        const { dni } = req.params;
        const datos = leerExcel();
        const filtrados = datos.filter(d => d.dni != dni);

        if (filtrados.length === datos.length) {
            return res.status(404).json({ error: "Registro no encontrado" });
        }

        escribirExcel(filtrados);
        res.json({ mensaje: "Registro eliminado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar" });
    }
});

// ==============================================
// BLOQUE 4: INICIO DEL SERVIDOR
// ==============================================
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📁 Base de datos: ${ARCHIVO_EXCEL}`);
    console.log(`📁 Carpeta pública: ${CARPETA_PUBLICA}`);
});