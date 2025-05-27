// netlify/functions/createPreference.js
const mercadopago = require('mercadopago');

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

exports.handler = async (event) => {
  // Verifica CORS (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  // Verifica se é POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Método não permitido' })
    };
  }

  try {
    const data = JSON.parse(event.body);

    // Validação mínima dos dados recebidos
    if (!data.title || !data.quantity || !data.unit_price) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Parâmetros inválidos' })
      };
    }

    const pref = {
      items: [
        {
          title: data.title,
          quantity: data.quantity,
          unit_price: data.unit_price,
          currency_id: 'BRL'
        }
      ],
     back_urls: {
  success: 'https://airbank.netlify.app/obrigado.html',
  failure: 'https://airbank.netlify.app/erro.html',
  pending: 'https://airbank.netlify.app/pendente.html'
},
      auto_return: 'approved'
    };

    const response = await mercadopago.preferences.create(pref);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ preferenceId: response.body.id })
    };
  } catch (e) {
    console.error('Erro ao criar preferência:', e);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Erro ao criar preferência' })
    };
  }
};
