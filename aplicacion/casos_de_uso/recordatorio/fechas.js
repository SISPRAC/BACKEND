// aplicacion/casos_de_uso/recordatorio/fechas.js

// YYYY-MM-DD de Colombia desplazado N días (para columnas DATEONLY)
export const fechaOffset = (dias) => {
    const [y, m, d] = new Date()
        .toLocaleDateString("en-CA", { timeZone: "America/Bogota" })
        .split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d + dias)).toISOString().slice(0, 10);
};

// Rango del día completo en hora Colombia (para columnas DATE con hora)
// Colombia es UTC-5 todo el año, así que el offset fijo es seguro
export const rangoDia = (dias) => ({
    inicio: new Date(`${fechaOffset(dias)}T00:00:00-05:00`),
    fin: new Date(`${fechaOffset(dias + 1)}T00:00:00-05:00`),
});