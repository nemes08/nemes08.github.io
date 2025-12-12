// Pi Network SDK başlatılıyor
Pi.init({
    appName: "Ayasofya Charity",
    version: "2.0",
    sandbox: false
});

// Bağış başlatma fonksiyonu
async function startPayment(amount) {
    try {
        console.log("⚡ Bağış başlatılıyor...");

        // Kullanıcı doğrulaması
        const auth = await Pi.authenticate();
        console.log("✔ Auth Başarılı:", auth);

        // Ödeme isteği oluşturma
        const payment = await Pi.createPayment({
            amount: Number(amount),
            memo: "Ayasofya Charity Bağışı",
            metadata: {
                user: auth.user.username,
                project: "Ayasofya Charity"
            }
        });

        console.log("⏳ Kullanıcı ödeme onayı bekleniyor...");

        // Kullanıcı ödeme onayı
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

// Bağış butonlarını aktif hale getirme
document.addEventListener("DOMContentLoaded", function () {

    // DOĞRU SINIF BURASI ("donate-btn")
    const buttons = document.querySelectorAll(".donate-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", function () {
            const amount = this.getAttribute("data-amount");
            startPayment(amount);
        });
    });

    // BAĞIŞ GÖNDER butonu (sendBtn) desteği
    const sendBtn = document.getElementById("sendBtn");
    if (sendBtn) {
        sendBtn.addEventListener("click", function () {
            const selectedAmount = window.donationAmount || 0;
            if (!selectedAmount) {
                return alert("Lütfen önce bağış miktarı seçin!");
            }
            startPayment(selectedAmount);
        });
    }
});

// HTML'de seçilen bağış miktarını almak için
window.donationAmount = 0;
document.querySelectorAll(".donate-btn").forEach(btn => {
    btn.addEventListener("click", function () {
        window.donationAmount = this.getAttribute("data-amount");
    });
});
