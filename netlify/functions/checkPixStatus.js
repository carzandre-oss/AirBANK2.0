
const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN,
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004',
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
