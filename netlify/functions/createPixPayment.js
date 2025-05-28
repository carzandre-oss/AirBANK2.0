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

    const payment_data = {
      transaction_amount: body.unit_price || 297.9,
      description: body.title || 'AirBank SE Compact',
      payment_method_id: 'pix',
      payer: {
        email: body.email,
        first_name: body.nome,
        last_name: '',
        identification: {
          type: 'CPF',
          number: body.cpf
        }
      }
    };

    const payment = await mercadopago.payment.create(payment_data);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        qr_code: payment.response.point_of_interaction.transaction_data.qr_code,
        qr_code_base64: payment.response.point_of_interaction.transaction_data.qr_code_base64,
        status: payment.response.status,
        id: payment.response.id
      })
    };
  } catch (error) {
    console.error('Erro ao gerar pagamento PIX:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Erro ao gerar pagamento PIX' })
    };
  }
};
