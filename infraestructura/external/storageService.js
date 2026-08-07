import { supabase } from "../../config/supabase.js";

export const uploadArchivo = async (
    buffer,
    carpeta,
    nombre,
    mimeType
) => {

    const ruta = `${carpeta}/${nombre}`;

    const { error } = await supabase.storage
        .from("Documentos")
        .upload(ruta, buffer, {
            contentType: mimeType,
            upsert: false,
        });

    if (error) {
        throw new Error(error.message);
    }

    const { data } = supabase.storage
        .from("Documentos")
        .getPublicUrl(ruta);

    return {
        url: data.publicUrl,
        public_id: ruta,
        resource_type: "supabase",
    };
};

export const deleteArchivo = async (publicId) => {

    const { error } = await supabase.storage
        .from("Documentos")
        .remove([publicId]);

    if (error) {
        throw new Error(error.message);
    }
};