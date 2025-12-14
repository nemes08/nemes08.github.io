Pi.init({
  version: "2.0",
  sandbox: true
});

let selectedAmount = null;

document.addEventListener("DOMContentLoaded", () => {

  // Bağış miktarı butonları
  document.querySelectorAll(".donate-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedAmount = btn.dataset.amount;
      alert("Seçilen bağış: " + selectedAmount + " Pi");
    });
  });

  // Gönder butonu
  document.getElementById("sendBtn").addEventListener("click", async () => {
    if (!selectedAmount) {
      alert("Önce bir bağış miktarı seç");
      return;
    }

    try {
      const auth = await Pi.authenticate(["payments"]);
      const payment = await Pi.createPayment({
        amount: Number(selectedAmount),
        memo: "Ayasofya Charity Bağışı"
      });

      await Pi.approvePayment(payment.identifier);
      alert("🎉 Bağış başarılı");

    } catch (e) {
      alert("❌ Hata: " + e.message);
    }
  });

});
