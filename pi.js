// Pi Network SDK başlatılıyor
Pi.init({
    version: "2.0",
    sandbox: false
});

// Bağış başlatma fonksiyonu
async function startPayment(amount) {
    try {
        console.log("⚡ Bağış başlatılıyor...");

        // Kimlik doğrulama
        const auth = await Pi.authenticate();
        console.log("✔ Auth Başarılı:", auth);

        // Ödeme isteği
        const payment = await Pi.createPayment({
            amount: amount,
            memo: "Ayasofya Charity Bağışı",
            metadata: { user: auth.user.username }
        });

        console.log("⏳ Kullanıcı onayı bekleniyor...");

        // Ödeme onayı
        const approved = await Pi.approvePayment(payment.identifier);
        console.log("✔ Ödeme Onaylandı:", approved);

        alert("🎉 Teşekkür ederiz! Bağış başarıyla alındı.");

    } catch (error) {
        console.error("❌ Ödeme Hatası:", error);

        if (error && error.message) {
            alert("⚠ Ödeme Başlatılamadı: " + error.message);
        } else {
            alert("⚠ Bilinmeyen bir hata oluştu!");
        }
    }
}

// Sayfa tamamen yüklenince bağış butonlarını aktif et
document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".donate-button");

    buttons.forEach(btn => {
        btn.addEventListener("click", function () {
            const amount = this.getAttribute("data-amount");
            startPayment(amount);
        });
    });
});
