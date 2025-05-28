function payWithMercadoPago() {
    hidePixArea();

    const formData = Object.fromEntries(new FormData(document.getElementById('checkoutForm')).entries());

    fetch('/.netlify/functions/createPreference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: 'AirBank SE COMPACT',
            quantity: 1,
            unit_price: 297.00
        })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('mp-area').classList.remove('hidden');

        // 🔥 Destroi botão antigo se já existir
        if (walletBrick) {
            walletBrick.unmount();
        }

        // 🔥 Cria botão novo
        mp.bricks().create("wallet", "wallet_container", {
            initialization: {
                preferenceId: data.preferenceId,
            },
            callbacks: {
                onSubmit: () => {
                    sendClientData('Mercado Pago');
                    window.location.href = 'obrigado.html';
                }
            }
        }).then(brick => {
            walletBrick = brick; // 🔥 Salva a instância para futuras destruições
        });
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao iniciar pagamento.');
    });
}
