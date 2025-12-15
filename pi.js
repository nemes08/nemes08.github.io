// Pi SDK başlat
Pi.init({
  version: "2.0",
  sandbox: true // TESTNET
});

// Bağış fonksiyonu
async function startPayment(amount) {
  try {
    const auth = await Pi.authenticate(["payments"]);

    const payment = await Pi.createPayment({
      amount: Number(amount),
      memo: "Ayasofya Charity Bağışı"
    });

    await Pi.approvePayment(payment.identifier);

    alert("🎉 Bağış başarılı, teşekkür ederiz!");

  } catch (e) {
    alert("❌ Hata: " + e.message);
  }
}
