let selectedAmount = 0;
let total = 0;
let donors = 0;

/* Scroll to donation area */
function scrollToDonate() {
    document.getElementById("donate-section").scrollIntoView({ behavior: "smooth" });
}

/* Select donation amount */
function selectAmount(amount) {
    selectedAmount = amount;
    alert(`${amount} π seçildi`);
}

/* Send donation using Pi SDK */
function sendDonation() {
    if (selectedAmount <= 0) {
        alert("Lütfen bir Pi miktarı seçin.");
        return;
    }

    Pi.createPayment({
        amount: selectedAmount,
        memo: "Ayasofya Charity Donation",
        metadata: { type: "donation" }
    }, {
        onReadyForServerApproval: function(paymentId) {
            console.log("Approval:", paymentId);
        },
        onReadyForServerCompletion: function(paymentId) {
            console.log("Completion:", paymentId);

            // update stats
            total += selectedAmount;
            donors += 1;

            document.getElementById("total").innerText = total;
            document.getElementById("donors").innerText = donors;

            alert("Bağışınız için teşekkürler!");
        },
        onCancel: function() {
            alert("Bağış iptal edildi!");
        },
        onError: function(error) {
            alert("Hata oluştu: " + error);
        }
    });
}

/* Language selector */
function setLang(lang) {
    if (lang === "en") {
        document.getElementById("hero-title").innerText = "Support Hagia Sophia globally";
        document.getElementById("hero-subtitle").innerText = "Donate with Pi Network and protect cultural heritage.";
        document.getElementById("donate-title").innerText = "Donation Panel";
        document.getElementById("donate-desc").innerText = "Choose an amount to donate using Pi Blockchain:";
    } else {
        document.getElementById("hero-title").innerText = "Dünya çapında Ayasofya’ya destek olun";
        document.getElementById("hero-subtitle").innerText = "Pi Network ile şeffaf bağış gönderin ve kültürel mirasa katkı sağlayın.";
        document.getElementById("donate-title").innerText = "Bağış Paneli";
        document.getElementById("donate-desc").innerText = "Pi Blockchain üzerinde güvenli bağış göndermek için bir miktar seçin:";
    }
}
