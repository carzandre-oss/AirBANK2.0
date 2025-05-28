const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN // 🔥 sua chave de PRODUÇÃO
});

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Método não permitido' }),
        };
    }

    try {
        const { title, quantity, unit_price, nome, email, cpf, telefone } = JSON.parse(event.body);

        const paymentData = {
            transaction_amount: unit_price,
            description: title,
            payment_method_id: "pix",
            payer: {
                email: email,
                first_name: nome,
                identification: {
                    type: "CPF",
                    number: cpf.replace(/\D/g, '') // Retira pontos e traços
                }
            }
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
        console.error('Erro ao criar pagamento PIX:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro interno ao gerar PIX', details: error.message }),
        };
    }
};
