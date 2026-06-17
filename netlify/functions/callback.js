exports.handler = async (event) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return { statusCode: 500, body: 'Missing GitHub OAuth environment variables in Netlify.' };
  }

  const code = event.queryStringParameters && event.queryStringParameters.code;
  if (!code) {
    return { statusCode: 400, body: 'Missing "code" parameter from GitHub.' };
  }

  let result;
  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code })
    });
    const tokenData = await tokenResponse.json();

    if (tokenData.error || !tokenData.access_token) {
      result = {
        status: 'error',
        content: { message: tokenData.error_description || 'No access token returned by GitHub.' }
      };
    } else {
      result = {
        status: 'success',
        content: { token: tokenData.access_token, provider: 'github' }
      };
    }
  } catch (e) {
    result = { status: 'error', content: { message: e.message } };
  }

  const message = `authorization:github:${result.status}:${JSON.stringify(result.content)}`;

  const body = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body>
<script>
  (function () {
    function receiveMessage(e) {
      window.opener.postMessage(${JSON.stringify(message)}, e.origin);
      window.removeEventListener("message", receiveMessage, false);
    }
    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:github", "*");
  })();
<\/script>
<p>Authorising… you can close this window.</p>
</body>
</html>`;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html', 'Cache-Control': 'no-cache' },
    body
  };
};
