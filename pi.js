// Pi Network SDK başlatma
Pi.init({
    version: "2.0",
    sandbox: false
});

Pi.ready(() => {
    console.log("✅ Pi SDK hazır");
    document.getElementById("piStatus").innerText = "✅ Pi bağlantısı hazır!";
});

// Para transferi fonksiyonu
async function startPayment(amount) {
    try {
        // Kullanıcı doğrulama
        const auth = await Pi.authenticate();
        console.log("Auth Success:", auth);

        // Ödeme oluşturma
        const payment = await Pi.createPayment({
            amount: parseFloat(amount),
            memo: "Ayasofya Charity Bağışı",
            metadata: { username: auth.user.username }
        });

        console.log("Payment Created:", payment);

        // Ödemeyi onaylat
        const approval = await Pi.approvePayment(payment.identifier);
        console.log("Payment Approved:", approval);

        alert("🎉 Bağışınız başarıyla gönderildi!");

        return approval;

    } catch (error) {
        console.error("Payment Error:", error);
        alert("❌ Ödeme başlatılamadı: " + error.message);
    }
}

// Bağış butonları
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".donate-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", function () {
            const amount = this.getAttribute("data-amount");
            document.getElementById("piValid").innerText =
                `Seçilen miktar: ${amount} π`;
        });
    });

    // Gönderme butonu
    const sendButton = document.getElementById("sendBtn");
    sendButton.addEventListener("click", () => {
        const selected = document.getElementById("piValid").innerText;
        const match = selected.match(/\d+/);

        if (!match) {
            alert("Lütfen bir miktar seçin!");
            return;
        }

        startPayment(match[0]);
    });
});
