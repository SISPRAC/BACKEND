// Agrega a cada entrega el nombre completo de sus tutores:
//   tutor_docente_nombre      (null si aún no hay tutor docente)
//   tutor_empresarial_nombre  (null si aún no hay tutor empresarial)
// Conserva el resto de la entrega tal cual (incluidos tutorDocente / tutorEmpresarial).
const nombreCompleto = (tutor) => {
    const usuario = tutor?.Usuario;

    const nombre =
        `${usuario?.nombres ?? ""} ${usuario?.apellidos ?? ""}`.trim();

    return nombre || null;
};

export const agregarNombresTutores = (entregas) =>
    (entregas ?? []).map((entrega) => {
        const plano =
            typeof entrega.toJSON === "function"
                ? entrega.toJSON()
                : entrega;

        return {
            ...plano,
            tutor_docente_nombre: nombreCompleto(plano.tutorDocente),
            tutor_empresarial_nombre: nombreCompleto(plano.tutorEmpresarial)
        };
    });
