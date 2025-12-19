function startPayment(amount) {
  if (!window.Pi) {
    alert("Bu işlem sadece Pi Browser içinde çalışır.\nTutar: " + amount + " Pi");
    return;
  }

  Pi.init({ version: "2.0", sandbox: true });

  Pi.authenticate(["payments"])
    .then(() => Pi.createPayment({
      amount: amount,
      memo: "İlan Yayınlama Bedeli"
    }))
    .then(payment => Pi.approvePayment(payment.identifier))
    .then(() => alert("✅ Ödeme başarılı"))
    .catch(err => alert("❌ Hata: " + err.message));
}
