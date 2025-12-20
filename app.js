// Pi SDK başlat
Pi.init({
  version: "2.0",
  sandbox: true
});

// Buton fonksiyonu
function startPayment(amount) {

  // Pi Browser kontrolü
  if (!window.Pi) {
    alert("Bu buton sadece Pi Browser içinde çalışır.");
    return;
  }

  Pi.authenticate(["payments"])
    .then(() => {
      return Pi.createPayment({
        amount: Number(amount),
        memo: "İlan Yayınlama Bedeli"
      });
    })
    .then(payment => {
      return Pi.approvePayment(payment.identifier);
    })
    .then(() => {
      alert("✅ Ödeme başarılı");
    })
    .catch(err => {
      alert("❌ Hata: " + err.message);
    });
}
