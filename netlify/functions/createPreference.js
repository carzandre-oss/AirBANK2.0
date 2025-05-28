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
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Método não permitido' }) };
  }

  try {
    const body = JSON.parse(event.body);

    const pref = {
      items: [
        {
          title: body.title || 'AirBank SE Compact',
          quantity: body.quantity || 1,
          unit_price: body.unit_price || 297.9,
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
      body: JSON.stringify({ init_point: response.body.init_point })
    };
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Erro ao criar preferência' })
    };
  }
};
