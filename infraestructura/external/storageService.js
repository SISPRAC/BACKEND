import { supabase } from "../../config/supabase.js";

const sanitizarNombreArchivo = (nombre) => {

    return nombre
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9._-]/g, "_");
};

export const uploadArchivo = async (
    buffer,
    carpeta,
    nombre,
    mimeType
) => {

    const nombreSeguro =
        sanitizarNombreArchivo(nombre);

    const extension =
        nombreSeguro.includes(".")
            ? "." + nombreSeguro.split(".").pop()
            : "";

    const nombreSinExtension =
        extension
            ? nombreSeguro.slice(
                0,
                -extension.length
            )
            : nombreSeguro;

    const nombreUnico =
        `${nombreSinExtension}_${Date.now()}${extension}`;

    const ruta =
        `${carpeta}/${nombreUnico}`;

    const { error } =
        await supabase.storage
            .from("Documentos")
            .upload(
                ruta,
                buffer,
                {
                    contentType: mimeType,
                    upsert: false,
                }
            );

    if (error) {
        throw new Error(error.message);
    }

    const { data } =
        supabase.storage
            .from("Documentos")
            .getPublicUrl(ruta);

    return {
        url: data.publicUrl,
        public_id: ruta,
        resource_type: "supabase",
    };
};

export const deleteArchivo = async (
    publicId
) => {

    const { error } =
        await supabase.storage
            .from("Documentos")
            .remove([publicId]);

    if (error) {
        throw new Error(error.message);
    }
};