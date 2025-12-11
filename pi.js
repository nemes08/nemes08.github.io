Pi.init({ version: "2.0", sandbox: false });

function startPayment(amount) {
    Pi.authenticate().then(function(auth) {

        console.log("Auth Success:", auth);

        return Pi.createPayment({
            amount: amount,
            memo: "Ayasofya Charity Bağışı",
            metadata: { user: auth.user.username }
        });

    }).then(function(payment) {

        console.log("Payment Created:", payment);

        return Pi.approvePayment(payment.identifier);

    }).then(function(result) {

        console.log("Payment Approved:", result);

        alert("🎉 Bağışınız alındı, teşekkür ederiz!");

    }).catch(function(error) {

        console.error("Payment Error:", error);
        alert("❌ Ödeme başlatılamadı: " + error.message);

    });
}

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".donate-button");

    buttons.forEach(btn => {
        btn.addEventListener("click", function () {
            const amount = this.getAttribute("data-amount");
            startPayment(amount);
        });
    });
});
