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

  const data = JSON.parse(event.body);

  try {
    const payment_data = {
      transaction_amount: 297.9,
      description: 'AirBank SE Compact',
      payment_method_id: 'pix',
      payer: {
        email: data.email,
        first_name: data.nome,
        last_name: ''
      }
    };

    const payment = await mercadopago.payment.create(payment_data);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        qr_code: payment.body.point_of_interaction.transaction_data.qr_code,
        qr_code_base64: payment.body.point_of_interaction.transaction_data.qr_code_base64,
        status: payment.body.status,
        payment_id: payment.body.id
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
