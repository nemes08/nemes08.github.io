Pi.init({ version: "2.0", sandbox: true });

async function startPayment(amount) {
  if (!window.Pi) {
    alert("Bu uygulama sadece Pi Browser içinde çalışır.");
    return;
  }

  try {
    const auth = await Pi.authenticate(["payments"]);

    const payment = await Pi.createPayment({
      amount: amount,
      memo: "İlan Yayınlama Ücreti"
    });

    console.log("Payment created:", payment);
  } catch (err) {
    alert("Ödeme iptal edildi veya hata oluştu");
    console.error(err);
  }
}
