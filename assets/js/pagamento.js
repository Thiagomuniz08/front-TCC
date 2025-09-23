const stripe = Stripe('pk_test_51RhLX8EKH8PZEo1DXBoRTGpT7j8M2E3jRwm8N7bQDr7dZQNcfeYE2SUYk4mfUZscWE9z7DKGchl77NDwDAohgVrN00mI4Y59Kz');

initialize();

async function initialize() {
  const fetchClientSecret = async () => {
    // Envie o carrinho para o backend
    const carrinhoJSON = localStorage.getItem('carrinho');
    const carrinho = carrinhoJSON ? JSON.parse(carrinhoJSON) : [];
    const response = await fetch("http://localhost:3000/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ carrinho }),
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  // Inicializa o checkout embutido
  const checkout = await stripe.initEmbeddedCheckout({
    fetchClientSecret,
  });

  // Monta o checkout no div
  checkout.mount('#checkout');
}