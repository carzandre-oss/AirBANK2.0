const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN // Sua chave de PRODUÇÃO
});

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Método não permitido' }),
        };
    }

    try {
        const { title, quantity, unit_price } = JSON.parse(event.body);

        const preference = {
            items: [
                {
            title: 'AirBank SE COMPACT',
            quantity: 1,
            unit_price: 297.90
            currency_id: 'BRL',
                   
                }
            ],
            back_urls: {
                success: 'https://airbank.netlify.app/obrigado.html',
                pending: 'https://airbank.netlify.app/pendente.html',
                failure: 'https://airbank.netlify.app/erro.html'
            },
            auto_return: "approved"
        };

        const result = await mercadopago.preferences.create(preference);

        return {
            statusCode: 200,
            body: JSON.stringify({
                preferenceId: result.body.id,
                init_point: result.body.init_point // 🔥 URL para redirecionamento automático
            })
        };
    } catch (error) {
        console.error('Erro ao criar preferência:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro interno ao gerar preferência' }),
        };
    }
};
