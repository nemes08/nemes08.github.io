let totalPi = 0;
let donorCount = 0;
const goalPi = 500;
let donatedUsers = [];

const translations = {
    tr: {
        title: "Ayasofya Charity",
        donationTitle: "Bağış Paneli",
        donationText: "Pi Blockchain üzerinde güvenli bağış göndermek için bir miktar seçin:",
        totalPiText: "Toplam Bağış",
        donorCountText: "Bağış Yapan Kişi Sayısı",
        goalText: "Hedef",
        infoTitle: "Ayasofya Hakkında",
        infoText: "Ayasofya, İstanbul’un simgesi ve dünya çapında tarihi bir yapıdır. Bu projeyle hem kültürel mirasa sahip çıkıyor hem de yardım topluyoruz.",
        whyTitle: "Neden Bağış Yapmalıyım?",
        whyText: "Bağışlarınızla hem tarihi mirasın korunmasına katkıda bulunuyor hem de ihtiyaç sahiplerine destek oluyorsunuz.",
        secureTitle: "Güvenli İşlem",
        secureText: "Pi Blockchain altyapısı sayesinde işlemleriniz güvenle gerçekleşir, tüm bağışlar şeffaf şekilde izlenebilir.",
        followTitle: "Bizi Takip Edin",
        privacyLink: "Gizlilik Politikası",
        termsLink: "Kullanım Şartları"
    },
    en: {
        title: "Ayasofya Charity",
        donationTitle: "Donation Panel",
        donationText: "Select an amount to donate securely on the Pi Blockchain:",
        totalPiText: "Total Donations",
        donorCountText: "Number of Donors",
        goalText: "Goal",
        infoTitle: "About Ayasofya",
        infoText: "Ayasofya is a symbol of Istanbul and a world-class historic building. This project helps protect cultural heritage while collecting donations.",
        whyTitle: "Why Donate?",
        whyText: "Your donations help preserve historical heritage and support those in need.",
        secureTitle: "Secure Transaction",
        secureText: "Thanks to Pi Blockchain, your transactions are secure and fully transparent.",
        followTitle: "Follow Us",
        privacyLink: "Privacy Policy",
        termsLink: "Terms of Use"
    }
};

function setLanguage(lang) {
    const t = translations[lang];
    document.getElementById('title').innerText = t.title;
    document.getElementById('donation-title').innerText = t.donationTitle;
    document.getElementById('donation-text').innerText = t.donationText;
    document.getElementById('total-pi-text').childNodes[0].nodeValue = t.totalPiText + ": ";
    document.getElementById('donor-count-text').childNodes[0].nodeValue = t.donorCountText + ": ";
    document.getElementById('goal-text').childNodes[0].nodeValue = t.goalText + ": ";
    document.getElementById('info-title').innerText = t.infoTitle;
    document.getElementById('info-text').innerText = t.infoText;
    document.getElementById('why-title').innerText = t.whyTitle;
    document.getElementById('why-text').innerText = t.whyText;
    document.getElementById('secure-title').innerText = t.secureTitle;
    document.getElementById('secure-text').innerText = t.secureText;
    document.getElementById('follow-title').innerText = t.followTitle;
    document.getElementById('privacy-link').innerText = t.privacyLink;
    document.getElementById('terms-link').innerText = t.termsLink;
}

function donate(amount) {
    const user = prompt("Lütfen kullanıcı adınızı girin:").trim();
    if (!user) { alert("Geçerli bir kullanıcı adı girin."); return; }
    if (donatedUsers.includes(user)) {
        alert("Bu kullanıcı zaten bağış yaptı! Tekrar bağış yapamaz.");
        return;
    }

    totalPi += amount;
    donorCount += 1;
    donatedUsers.push(user);

    document.getElementById('total-pi').innerText = totalPi;
    document.getElementById('donor-count').innerText = donorCount;

    alert(`Teşekkürler ${user}! ${amount} π bağışladınız.`);

    if (totalPi >= goalPi) {
        alert("Tebrikler! Hedefe ulaşıldı! 🎉");
    }
}
