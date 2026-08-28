export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const data = Object.fromEntries(formData);

    // Identificar cuál formulario se envió
    const formName = data.form_name || 'Formulario Web';

    // Formatear el contenido del correo
    let contenido = `Has recibido un nuevo mensaje desde el sitio web (${formName}):\n\n`;
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'form_name') {
        contenido += `${key.toUpperCase()}: ${value}\n`;
      }
    }

    // Enviar el correo mediante Resend API
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Web El Electo <onboarding@resend.dev>',
        to: ['victor.kallus@gmail.com', 'jureruben@gmail.com'], // <-- Reemplaza por tu correo
        subject: `Nuevo mensaje de web El Electo: ${formName}`,
        text: contenido
      })
    });

    if (res.ok) {
      return new Response(JSON.stringify({ status: 'ok', message: 'Mensaje enviado con éxito' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response('Error al procesar el envío de correo.', { status: 500 });
    }
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}