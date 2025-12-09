let totalPi = 0;
let donorCount = 0;
let donatedUsers = [];
const goalPi = 500;

function donate(amount) {
    const user = prompt("Kullanıcı adınızı giriniz:");

    if (!user) return alert("Geçerli bir kullanıcı adı girin.");
    if (donatedUsers.includes(user)) return alert("Bu kullanıcı zaten bağış yaptı.");

    donatedUsers.push(user);
    totalPi += amount;
    donorCount++;

    document.getElementById("total-pi").innerText = totalPi;
    document.getElementById("donor-count").innerText = donorCount;

    alert(`Teşekkürler ${user}! ${amount} π bağışladınız.`);

    if (totalPi >= goalPi) {
        alert("🎉 Hedefe ulaşıldı!");
    }
}

/* Scroll to donation panel */
function scrollToDonate() {
    document.getElementById("donation-panel").scrollIntoView({ behavior: "smooth" });
}

/* MULTI LANGUAGE */
const langData = {
    tr: {
        title: "Ayasofya Charity",
        subtitle: "Pi Blockchain ile tamamen şeffaf ve güvenli bağış platformu.",
        donationTitle: "Bağış Paneli",
        donationText: "Bağış yapmak istediğiniz miktarı seçin:",
        total: "Toplam Bağış",
        donors: "Bağışçı Sayısı",
        goal: "Hedef",
        infoTitle: "Ayasofya Hakkında",
        infoText: "Ayasofya, dünya tarihinin en önemli yapılarından biridir...",
        whyTitle: "Neden Bağış Yapmalıyım?",
        whyText: "Bağışlarınız kültürel mirası korumaya destek olur.",
        secureTitle: "Güvenli ve Şeffaf",
        secureText: "Pi Blockchain tüm işlemleri şeffaf hale getirir.",
        follow: "Bizi Takip Edin",
        privacy: "Gizlilik Politikası",
        terms: "Kullanım Şartları"
    },

    en: {
        title: "Ayasofya Charity",
        subtitle: "A fully transparent and secure donation platform powered by Pi Blockchain.",
        donationTitle: "Donation Panel",
        donationText: "Select the amount you want to donate:",
        total: "Total Donations",
        donors: "Number of Donors",
        goal: "Goal",
        infoTitle: "About Ayasofya",
        infoText: "Hagia Sophia is one of the most important structures in world history...",
        whyTitle: "Why Donate?",
        whyText: "Your donations help preserve cultural heritage.",
        secureTitle: "Secure & Transparent",
        secureText: "Pi Blockchain makes all transactions transparent.",
        follow: "Follow Us",
        privacy: "Privacy Policy",
        terms: "Terms of Use"
    }
};

function setLang(l) {
    const d = langData[l];

    document.getElementById("title").innerText = d.title;
    document.getElementById("subtitle").innerText = d.subtitle;
    document.getElementById("donation-title").innerText = d.donationTitle;
    document.getElementById("donation-text").innerText = d.donationText;
    document.getElementById("total-pi-text").innerText = d.total;
    document.getElementById("donor-count-text").innerText = d.donors;
    document.getElementById("goal-text").innerText = d.goal;
    document.getElementById("info-title").innerText = d.infoTitle;
    document.getElementById("info-text").innerText = d.infoText;
    document.getElementById("why-title").innerText = d.whyTitle;
    document.getElementById("why-text").innerText = d.whyText;
    document.getElementById("secure-title").innerText = d.secureTitle;
    document.getElementById("secure-text").innerText = d.secureText;
    document.getElementById("follow-title").innerText = d.follow;
    document.getElementById("privacy-link").innerText = d.privacy;
    document.getElementById("terms-link").innerText = d.terms;
}
