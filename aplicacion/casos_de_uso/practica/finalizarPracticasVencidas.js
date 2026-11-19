// aplicacion/casos_de_uso/practica/finalizarPracticasVencidas.js
import { notificarPracticaFinalizada } from "./notificarPracticaFinalizada.js";

// Empresas únicas de las aperturas de la práctica
const extraerEmpresas = (practica) => {
    const mapa = new Map();
    for (const apertura of practica.aperturasVacante ?? []) {
        const empresa = apertura.Vacante?.Convenio?.Empresa;
        if (empresa && !mapa.has(empresa.id)) {
            mapa.set(empresa.id, { nombre: empresa.nombre, usuario: empresa.Usuario });
        }
    }
    return [...mapa.values()];
};

export const finalizarPracticasVencidas = async ({
    practicaRepository,
    practicaPracticanteRepository,
    aperturaVacanteRepository,
    userRepository,
    notificacionRepository,
}) => {
    const practicas = await practicaRepository.obtenerVencidasActivas();
    let finalizadas = 0;
    let fallidas = 0;

    for (const practica of practicas) {
        try {
            // 1) Cambios de estado atómicos
            const finalizada = await practicaRepository.transaccion(async (t) => {
                const filas = await practicaRepository.marcarFinalizada(practica.id, t);
                if (!filas) return false; // ya la procesó otra corrida

                await practicaPracticanteRepository.finalizarActivosPorPractica(practica.id, t);
                await aperturaVacanteRepository.cerrarPorPractica(practica.id, t);
                return true;
            });

            if (!finalizada) continue;
            finalizadas++;

            // 2) Notificaciones DESPUÉS del commit; si fallan, no revierten nada
            try {
                await notificarPracticaFinalizada({
                    practica,
                    empresas: extraerEmpresas(practica),
                    userRepository,
                    notificacionRepository,
                });
            } catch (error) {
                console.error(`Error notificando práctica ${practica.id}:`, error);
            }
        } catch (error) {
            fallidas++;
            console.error(`Error finalizando práctica ${practica.id}:`, error);
        }
    }

    return { revisadas: practicas.length, finalizadas, fallidas };
};