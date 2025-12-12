// ===========================
// Pi Network Bağış Scripti
// ===========================

// Pi SDK başlat
Pi.init({
    version: "2.0",
    sandbox: false
});

// Bağış fonksiyonu
async function startPayment(amount) {
    try {
        console.log("⚡ Bağış başlatılıyor...");

        // Kullanıcı doğrulama
        const auth = await Pi.authenticate();
        console.log("✔ Kullanıcı doğrulandı:", auth);

        // Ödeme isteği oluştur
        const payment = await Pi.createPayment({
            amount: parseFloat(amount),
            memo: "Ayasofya Charity Bağışı",
            metadata: { username: auth.user.username }
        });

        console.log("⏳ Kullanıcı ödeme onayı bekleniyor...");

        // Ödeme onaylama
        const approved = await Pi.approvePayment(payment.identifier);
        console.log("✔ Ödeme onaylandı:", approved);

        alert("🎉 Bağışınız başarıyla alındı. Teşekkür ederiz!");

    } catch (error) {
        console.error("❌ Hata:", error);

        let msg = "⚠ Bir hata oluştu.";

        if (error && error.message) {
            msg = error.message;
        }

        alert(msg);
    }
}

// Sayfa yüklendiğinde bağış butonlarını aktif et
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".donate-button");

    buttons.forEach(btn => {
        btn.addEventListener("click", function () {
            const amount = this.getAttribute("data-amount");
            startPayment(amount);
        });
    });
});
