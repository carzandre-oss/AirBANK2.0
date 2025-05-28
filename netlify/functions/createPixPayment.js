
const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN,
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004',
});

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Método não permitido' })
        };
    }

    try {
        const { nome, email, cpf } = JSON.parse(event.body);

        if (!nome || !email || !cpf) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Dados incompletos. Envie nome, email e CPF.' })
            };
        }

        const paymentData = {
            transaction_amount: 297.90,
            description: "AirBank SE COMPACT",
            payment_method_id: "pix",
            payer: {
                email,
                first_name: nome,
                identification: {
                    type: "CPF",
                    number: cpf.replace(/\D/g, '')
                }
            },
            notification_url: "https://airbank.netlify.app/.netlify/functions/webhook"
        };

        const payment = await mercadopago.payment.create(paymentData);

        const { id, point_of_interaction } = payment.body;
        const qrCode = point_of_interaction.transaction_data?.qr_code || null;
        const qrCodeBase64 = point_of_interaction.transaction_data?.qr_code_base64 || null;

        if (!qrCode) {
            throw new Error('QR Code não gerado. Verifique se sua conta Mercado Pago tem PIX habilitado.');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                payment_id: id,
                qr_code: qrCode,
                qr_code_base64: qrCodeBase64
            })
        };
    } catch (error) {
        console.error('❌ Erro ao gerar pagamento PIX:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Erro interno ao gerar PIX', 
                details: error.message 
            })
        };
    }
};
