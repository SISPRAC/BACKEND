// aplicacion/casos_de_uso/recordatorio/ejecutarRecordatorios.js
export const ejecutarRecordatorios = async ({ reglas }) => {
    for (const regla of reglas) {
        try {
            const pendientes = await regla.buscarPendientes(); // [{ usuario, items }]

            const resultados = await Promise.allSettled(
                pendientes.map((p) => regla.notificar(p))
            );
            resultados.forEach((r) => r.status === "rejected" &&
                console.error(`Error notificando ${regla.tipo}:`, r.reason));

            console.log(`Recordatorio ${regla.tipo}: ${pendientes.length} destinatarios`);
        } catch (error) {
            console.error(`Error en recordatorio ${regla.tipo}:`, error);
        }
    }
};