/* global fetch, AbortSignal */
export const sendEmail = async ({ to, subject, html }) => {
    const destinatarios = (Array.isArray(to) ? to : [to])
        .filter(Boolean)
        .map((email) => ({ email }));

    const respuesta = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
            "api-key": process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
            sender: { name: "SISPRAC", email: process.env.EMAIL_USER },
            to: destinatarios,
            subject,
            htmlContent: html
        }),
        signal: AbortSignal.timeout(15000)
    });

    if (!respuesta.ok) {
        const detalle = await respuesta.text();
        throw new Error(`Error enviando correo (${respuesta.status}): ${detalle}`);
    }

    return respuesta.json();
};