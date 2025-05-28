const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: 'APP_USR-850320183172539-052512-879be84cb4790b3ee3006551f7be8049-2456283423' // Coloque sua Access Token
});

exports.handler = async (event) => {
    const { id } = event.queryStringParameters;

    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'ID do pagamento não informado.' })
        };
    }

    try {
        const payment = await mercadopago.payment.findById(id);
        const status = payment.body.status;

        return {
            statusCode: 200,
            body: JSON.stringify({ status: status })
        };
    } catch (error) {
        console.error('Erro ao verificar status do PIX:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao consultar pagamento.' })
        };
    }
};
