const mercadopago = require('mercadopago');

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN // 🔑 Sua chave de acesso de produção no Environment da Netlify
});

exports.handler = async (event) => {
  try {
    const preference = {
      items: [
        {
          title: 'AirBank SE COMPACT',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: 297.90
        }
      ],
      back_urls: {
        success: 'https://airbank.netlify.app/obrigado.html',
        pending: 'https://airbank.netlify.app/pendente.html',
        failure: 'https://airbank.netlify.app/erro.html'
      },
      auto_return: 'approved'
    };

    const result = await mercadopago.preferences.create(preference);

    return {
      statusCode: 200,
      body: JSON.stringify({
        init_point: result.body.init_point, // 🚀 Link para redirecionamento direto
        preferenceId: result.body.id // 🔧 (Se quiser usar para outra coisa)
      })
    };
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao criar preferência' })
    };
  }
};
