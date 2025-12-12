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

        // Kullanıcı doğrulama
        const auth = await Pi.authenticate();
        console.log("✔ Auth Başarılı:", auth);

        // Ödeme isteği
        const payment = await Pi.createPayment({
            amount: Number(amount),
            memo: "Ayasofya Charity Bağışı",
            metadata: {
                user: auth.user.username,
                project: "Ayasofya Charity"
            }
        });

        console.log("⏳ Ödeme onayı bekleniyor...");

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

// Bağış butonları
window.donationAmount = 0;

document.addEventListener("DOMContentLoaded", () => {

    // Miktar seçimi
    document.querySelectorAll(".donate-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            window.donationAmount = btn.getAttribute("data-amount");
        });
    });

    // Gönder butonu
    const sendBtn = document.getElementById("sendBtn");
    if (sendBtn) {
        sendBtn.addEventListener("click", () => {
            if (!window.donationAmount) {
                return alert("Lütfen önce bağış miktarı seçin!");
            }
            startPayment(window.donationAmount);
        });
    }
});
