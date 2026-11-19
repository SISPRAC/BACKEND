// aplicacion/casos_de_uso/recordatorio/ejecutarRecordatorios.js
export const ejecutarRecordatorios = async ({ reglas, recordatorioRepository, notificacionRepository }) => {
    for (const regla of reglas) {
        try {
            const pendientes = await regla.buscarPendientes();
            // pendientes: [{ referencia_id, usuario, datos }]

            for (const p of pendientes) {
                const yaEnviado = await recordatorioRepository.existe(regla.tipo, p.referencia_id, p.usuario.id);
                if (yaEnviado) continue;

                await regla.notificar(p);                       // interna + correo
                await recordatorioRepository.registrar(regla.tipo, p.referencia_id, p.usuario.id);
            }
        } catch (error) {
            console.error(`Error en recordatorio ${regla.tipo}:`, error); // una regla no tumba las otras
        }
    }
};