export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');

  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: context.env.GITHUB_CLIENT_ID,
        client_secret: context.env.GITHUB_CLIENT_SECRET,
        code
      })
    });

    const data = await res.json();

    if (data.error || !data.access_token) {
      return postMessageResponse('error', data.error_description || 'No se pudo obtener el token');
    }

    return postMessageResponse('success', JSON.stringify({ token: data.access_token, provider: 'github' }));
  } catch (err) {
    return postMessageResponse('error', err.message);
  }
}

function postMessageResponse(status, content) {
  const message = `authorization:github:${status}:${content}`;
  const html = `<!DOCTYPE html><html><body><script>
(function() {
  var msg = ${JSON.stringify(message)};
  function receiveMessage(e) {
    window.opener.postMessage(msg, e.origin);
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
<\/script></body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}
