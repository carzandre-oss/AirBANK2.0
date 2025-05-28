const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN // 🔥 Sua chave de produção nas variáveis do Netlify
});

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Método não permitido' }),
        };
    }

    try {
        const { nome, email, cpf, telefone } = JSON.parse(event.body);

        const paymentData = {
            transaction_amount: 297.90,
            description: "AirBank SE COMPACT",
            payment_method_id: "pix",
            payer: {
                email: email,
                first_name: nome,
                identification: {
                    type: "CPF",
                    number: cpf.replace(/\D/g, '') // Remove pontos e traços do CPF
                }
            },
            notification_url: "https://airbank.netlify.app/.netlify/functions/webhook"
        };

        const payment = await mercadopago.payment.create(paymentData);

        const { id, point_of_interaction } = payment.body;

        return {
            statusCode: 200,
            body: JSON.stringify({
                payment_id: id,
                qr_code: point_of_interaction.transaction_data.qr_code,
                qr_code_base64: point_of_interaction.transaction_data.qr_code_base64
            }),
        };
    } catch (error) {
        console.error('❌ Erro ao gerar pagamento PIX:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Erro interno ao gerar PIX', 
                details: error.message 
            }),
        };
    }
};
