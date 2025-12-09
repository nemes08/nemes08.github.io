// Basit, güvenli, test edilebilir bağış mantığı.
// Gerçek Pi cüzdan entegrasyonu için `connectWallet()` fonksiyonuna
// Pi Browser / Pi Wallet SDK çağrısı eklenmelidir.

let totalPi = 0;
let donorCount = 0;
const goalPi = 500;
const donatedUsers = [];
const txListEl = document.getElementById('tx-list');

function pushTxEntry(user, amount){
  const li = document.createElement('li');
  const d = new Date();
  li.innerHTML = `<span>${user} — ${amount} π</span><span class="tx-time">${d.toLocaleString()}</span>`;
  if (txListEl) txListEl.prepend(li);
}

function donate(amount){
  // Basit prompt tabanlı test akışı
  const user = prompt("Kullanıcı adınızı girin (test amaçlı):");
  if (!user) return alert("İsim girilmedi.");
  if (donatedUsers.includes(user)) return alert("Bu kullanıcı zaten bağış yaptı.");
  // --- Gerçek entegrasyonda burada Pi Wallet tx başlatılacak ---
  donatedUsers.push(user);
  totalPi += amount;
  donorCount += 1;

  const totalPiEl = document.getElementById('total-pi');
  const donorCountEl = document.getElementById('donor-count');

  if (totalPiEl) totalPiEl.innerText = totalPi;
  if (donorCountEl) donorCountEl.innerText = donorCount;

  pushTxEntry(user, amount);
  alert(`Teşekkürler ${user}! ${amount} π bağışlandı.`);

  if (totalPi >= goalPi){
    alert("🎉 Hedefe ulaşıldı!");
  }
}

function connectWallet(){
  // Yer tutucu: Pi Wallet entegrasyonu buraya gelecek.
  alert("Cüzdan bağlama: Pi Wallet entegrasyonu için buraya SDK çağrısı ekleyin.");
}

function openTransparency(){
  // Şeffaflık raporlarına yönlendirme
  window.location.href = "privacy.html";
}

function scrollToSection(sel){
  const el = document.querySelector(sel);
  if (!el) return;
  el.scrollIntoView({behavior:'smooth', block:'start'});
}

/* LANGUAGE: minimal test çevirisi */
function setLang(lang){
  const data = {
    tr:{
      title: "Ayasofya Charity",
      subtitle: "Pi ağında tamamen şeffaf, denetlenebilir ve düşük maliyetli bağış platformu.",
      donationTitle: "Bağış Paneli",
      donationText: "Miktarı seçin ve Pi cüzdanınızla işlemi onaylayın.",
      total: "Toplam Bağış",
      donors: "Bağışçı Sayısı",
      goal: "Hedef",
      infoTitle: "Ayasofya Hakkında",
      whyTitle: "Neden Bağış?",
      secureTitle: "Güven & Şeffaflık",
      follow: "Bizi Takip Edin",
      privacy: "Gizlilik Politikası",
      terms: "Kullanım Şartları"
    },
    en:{
      title: "Ayasofya Charity",
      subtitle: "A fully transparent, auditable and low-fee donation platform on Pi.",
      donationTitle: "Donation Panel",
      donationText: "Choose an amount and confirm the transaction in your Pi wallet.",
      total: "Total Donations",
      donors: "Number of Donors",
      goal: "Goal",
      infoTitle: "About Hagia Sophia",
      whyTitle: "Why Donate?",
      secureTitle: "Security & Transparency",
      follow: "Follow Us",
      privacy: "Privacy Policy",
      terms: "Terms of Use"
    }
  };
  const d = data[lang] || data.tr;
  document.getElementById('title').innerText = d.title;
  document.getElementById('subtitle').innerText = d.subtitle;
  document.getElementById('donation-title').innerText = d.donationTitle;
  document.getElementById('donation-text').innerText = d.donationText;
  document.getElementById('total-pi-text').innerText = d.total;
  document.getElementById('donor-count-text').innerText = d.donors;
  document.getElementById('goal-text').innerText = d.goal;
  document.getElementById('info-title').innerText = d.infoTitle;
  document.getElementById('why-title').innerText = d.whyTitle;
  document.getElementById('secure-title').innerText = d.secureTitle;
  const p1 = document.getElementById('privacy-link');
  if (p1) p1.innerText = d.privacy;
  const p2 = document.getElementById('privacy-link-2');
  if (p2) p2.innerText = d.privacy;
  const t = document.getElementById('terms-link');
  if (t) t.innerText = d.terms;
}

/* INITIAL */
document.addEventListener('DOMContentLoaded', ()=>{
  setLang('tr'); // varsayılan
  // demo: örnek tx'ler
  pushTxEntry('Anonim', 12);
  pushTxEntry('Ziyaretçi', 5);
});
