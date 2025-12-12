// ===========================
// Ayasofya Charity Pi Donation Script
// ===========================

// Pi Network SDK hazır mı kontrol et
function waitForPiSDK() {
    return new Promise(resolve => {
        if (window.Pi) return resolve(window.Pi);
        const check = setInterval(() => {
            if (window.Pi) {
                clearInterval(check);
                resolve(window.Pi);
            }
        }, 100);
    });
}

async function startPayment(amount) {
    try {
        const Pi = await waitForPiSDK();

        console.log("⚡ Pi SDK yüklendi:", Pi);

        // Kullanıcı doğrulaması
        const auth = await Pi.authenticate(["username"]);
        console.log("✔ Kullanıcı doğrulandı:", auth);

        // Ödeme oluştur
        const payment = await Pi.createPayment({
            amount: parseFloat(amount),
            memo: "Ayasofya Charity Donation",
            metadata: { username: auth.user.username }
        });

        console.log("⏳ Kullanıcı ödeme onayı bekleniyor...");

        // Kullanıcı ödeme onaylıyor
        const approved = await Pi.approvePayment(payment.identifier);
        console.log("✔ Ödeme onaylandı:", approved);

        alert("🎉 Bağışınız başarıyla alındı!");

    } catch (error) {
        console.error("❌ Ödeme hatası:", error);
        alert("⚠ Bağış yapılamadı: " + error.message);
    }
}

// Bağış butonlarını aktif et
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".donate-button");

    buttons.forEach(btn => {
        btn.addEventListener("click", function () {
            const amount = this.dataset.amount;
            startPayment(amount);
        });
    });
});
