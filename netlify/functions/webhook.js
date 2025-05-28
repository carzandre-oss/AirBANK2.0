
const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN,
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004',
});

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const body = JSON.parse(event.body);

    if (body.type !== 'payment' && body.type !== 'merchant_order') {
        return { statusCode: 200, body: 'Not a tracked notification' };
    }

    try {
        const payment = await mercadopago.payment.findById(body.data.id);
        const status = payment.body.status;
        const paymentMethod = payment.body.payment_method_id;
        const email = payment.body.payer.email;
        const nome = payment.body.payer.first_name + ' ' + (payment.body.payer.last_name || '');

        console.log(`✅ Pagamento atualizado:`);
        console.log(`Status: ${status}`);
        console.log(`Cliente: ${nome} - ${email}`);
        console.log(`Método: ${paymentMethod}`);
        console.log(`Valor: R$ ${payment.body.transaction_amount}`);

        return {
            statusCode: 200,
            body: JSON.stringify({ received: true })
        };
    } catch (error) {
        console.error('Erro no webhook:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro no processamento do webhook' })
        };
    }
};
