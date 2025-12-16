Pi.init({
  version: "2.0",
  sandbox: true // Yayına geçince false
});

async function startPayment(amount) {
  try {
    await Pi.authenticate(["payments"]);
    const payment = await Pi.createPayment({
      amount: amount,
      memo: "İlan yayınlama hizmet bedeli"
    });

    console.log("Payment created:", payment);
    alert("Ödeme başlatıldı (Sandbox)");
  } catch (err) {
    console.error(err);
    alert("Ödeme başlatılamadı");
  }
}
