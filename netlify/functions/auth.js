const crypto = require('crypto');

exports.handler = async (event) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return { statusCode: 500, body: 'Missing GITHUB_CLIENT_ID environment variable in Netlify.' };
  }

  const host = event.headers.host;
  const redirectUri = `https://${host}/.netlify/functions/callback`;
  const state = crypto.randomBytes(12).toString('hex');

  const authUrl =
    'https://github.com/login/oauth/authorize' +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent('repo,user')}` +
    `&state=${state}`;

  return {
    statusCode: 302,
    headers: { Location: authUrl, 'Cache-Control': 'no-cache' },
    body: ''
  };
};
