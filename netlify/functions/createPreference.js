const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN,
    integrator_id: process.env.MP_INTG_TOKEN,
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

        if (!title || !quantity || !unit_price) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Dados incompletos. Envie title, quantity e unit_price.' })
            };
        }

        const preference = {
            items: [
                {
                    title: `${title} + Itens Adicionais`,
                    quantity: quantity,
                    unit_price: parseFloat(unit_price),
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
                init_point: result.body.init_point
            })
        };
    } catch (error) {
        console.error('❌ Erro ao criar preferência:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Erro interno ao gerar preferência',
                details: error.message
            }),
        };
    }
};
