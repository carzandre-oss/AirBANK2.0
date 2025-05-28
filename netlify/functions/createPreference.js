const mercadopago = require('mercadopago');

mercadopago.configure({
  access_token: 'APP_USR-850320183172539-052512-879be84cb4790b3ee3006551f7be8049-2456283423'
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
    const preference = {
      items: [
        {
          title: 'AirBank SE Compact',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: 297.9
        }
      ],
      back_urls: {
        success: 'https://airbank.netlify.app/obrigado.html',
        failure: 'https://airbank.netlify.app/erro.html',
        pending: 'https://airbank.netlify.app/pendente.html'
      },
      auto_return: 'approved'
    };

    const response = await mercadopago.preferences.create(preference);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ preferenceId: response.body.id })
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
