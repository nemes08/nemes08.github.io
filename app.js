Pi.init({
  version: "2.0",
  sandbox: true
});

async function startPayment(amount) {
  try {
    await Pi.authenticate(["payments"]);

    const payment = await Pi.createPayment({
      amount: amount,
      memo: "İlan Yayınlama Bedeli"
    });

    await Pi.approvePayment(payment.identifier);
    alert("✅ Ödeme başarılı");
  } catch (e) {
    alert("❌ Hata: " + e.message);
  }
}
