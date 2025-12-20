document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("payBtn").addEventListener("click", async () => {
    if (typeof Pi === "undefined") {
      alert("Bu işlem sadece Pi Browser içinde çalışır.");
      return;
    }

    try {
      await Pi.init({ version: "2.0", sandbox: true });

      const payment = await Pi.createPayment({
        amount: 0.5,
        memo: "İlan yayınlama ücreti",
        metadata: { type: "listing_fee" }
      });

      alert("Ödeme başlatıldı ✅");
    } catch (err) {
      alert("Ödeme iptal edildi veya hata oluştu");
      console.error(err);
    }
  });

  document.getElementById("requestBtn").addEventListener("click", () => {
    alert("Talep oluşturma yakında aktif.");
  });

});
