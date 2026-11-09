import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const obtenerRevisionRequisitosEmpresa = async (
    empresaRequisitoDocumentoRepository,
    tipoRequisitoDocumentoRepository,
    empresa_id
) => {

    const id = Number(empresa_id);

    if (!id) {
        throw new BadRequestError("Empresa no válida.");
    }

    const empresa =
        await empresaRequisitoDocumentoRepository.findEmpresa(id);

    if (!empresa) {
        throw new NotFoundError("La empresa no existe.");
    }

    const tipo_empresa = empresa.es_publica ? "publica" : "privada";

    const [tipos, docs] = await Promise.all([
        tipoRequisitoDocumentoRepository.findRequisitosConvenio(tipo_empresa),
        empresaRequisitoDocumentoRepository.findByEmpresa(id)
    ]);

    const docPorTipo = new Map(
        docs.map((d) => [d.tipo_requisito_documento_id, d])
    );

    return tipos
        .filter((t) => t.estado)
        .map((t) => {

            const d = docPorTipo.get(t.id);

            return {
                tipo: {
                    id: t.id,
                    nombre: t.nombre,
                    obligatorio: t.obligatorio
                },
                documento: d
                    ? {
                        id: d.id,
                        estado: d.estado,
                        observacion: d.observacion,
                        fecha_subida: d.fecha_subida,
                        archivo: d.archivo
                            ? { id: d.archivo.id, url: d.archivo.url }
                            : null
                    }
                    : null
            };

        });

};