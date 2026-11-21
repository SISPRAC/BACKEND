// infraestructura/servicios/driveService.js
import { google } from "googleapis";
import fs from "fs";

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SA_KEY_PATH, // ruta al JSON
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

export async function subirArchivo({ rutaLocal, nombre, carpetaId, mimeType }) {
  const { data } = await drive.files.create({
    requestBody: { name: nombre, parents: [carpetaId] },
    media: { mimeType, body: fs.createReadStream(rutaLocal) },
    fields: "id, name, webViewLink",
    supportsAllDrives: true,
  });
  return data; // { id, name, webViewLink } -> esto es lo que guardas en la tabla
}