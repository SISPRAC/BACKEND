import cron from "node-cron";
import { convenioRepository } from "../repositorios/convenioRepositoryImpl.js";
import { historialConvenioRepository } from "../repositorios/historialConvenioRepositoryImpl.js";
import { vencerConvenios } from "../../aplicacion/casos_de_uso/convenio/vencerConvenio.js";

export const iniciarVencimientoConvenios = () => {

    cron.schedule("0 * * * *", async () => {

        try {

            console.log(
                "Revisando convenios vencidos..."
            );

            await vencerConvenios(
                convenioRepository,
                historialConvenioRepository
            );

            console.log(
                "Revisión de convenios vencidos completada"
            );

        } catch (error) {

            console.error(
                "Error al revisar convenios vencidos:",
                error
            );
        }
    });
};