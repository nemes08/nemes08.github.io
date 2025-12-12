/* =========================================================
   Ayasofya Charity — script.js (Temiz, Hatasız, Çalışan)
   ========================================================= */

// ------------------ Çok Dilli Metinler ------------------
const LANGS = {
  tr: {
    tag: "Kültürel Miras İçin",
    title: "Ayasofya'yı Destekleyin — Global Pi Bağışı",
    lead: "Şeffaf, güvenli ve hızlı bağış. Pi Network ile anında bağış yapın.",
    donatePanel: "Bağış Paneli",
    donateDesc: "Hızlıca bir miktar seçin veya özel miktar girin.",
    sendBtn: "Bağışı Gönder",
    statusChecking: "Pi kontrol ediliyor…",
    statusValid: "Pi Tarayıcı algılandı",
    sandboxNote: "Ödemeler yalnızca Pi Browser içinde çalışır.",
    totalLabel: "Toplam Bağış",
    donorsLabel: "Bağışçı",
  },
  en: {
    tag: "For Cultural Heritage",
    title: "Support Hagia Sophia — Global Pi Donation",
    lead: "Transparent, fast and secure donations via Pi Network.",
    donatePanel: "Donation Panel",
    donateDesc: "Choose an amount or enter your custom amount.",
    sendBtn: "Send Donation",
    statusChecking: "Checking Pi…",
    statusValid: "Pi Browser detected",
    sandboxNote: "Payments work only inside Pi Browser.",
    totalLabel: "Total Donations",
    donorsLabel: "Donors",
  }
};

// -------------- Başlangıç Dili -------------------
let lang = navigator.language.startsWith("en") ? "en" : "tr";

// -------------- Eleman Kısayolu -------------------
const $ = id => document.getElementById(id);

// -------------- Seçim Değişkenleri ----------------
let selected = 0;

// -------------- Yerel İstatistikler ----------------
let total = parseFloat(localStorage.getItem("ay_total") || "0");
let donors = parseInt(localStorage.getItem("ay_donors") || "0");

// -------------- Dil Uygulama -----------------------
function applyLang(l) {
  lang = l;
  const t = LANGS[l];

  $("tagline").innerText = t.tag;
  $("hero-title").innerText = t.title;
  $("hero-lead").innerText = t.lead;
  $("donate-title").innerText = t.donatePanel;
  $("donate-desc").innerText = t.donateDesc;
  $("send-btn").innerText = t.sendBtn;
  $("mini-note").innerText = t.sandboxNote;
  $("stat-total-label").innerText = t.totalLabel;
  $("stat-donors-label").innerText = t.donorsLabel;

  $("status-text").innerText = t.statusChecking;
}

applyLang(lang);

// -------------- Dil Değiştirme --------------------
$("btn-tr").addEventListener("click", () => applyLang("tr"));
$("btn-en").addEventListener("click", () => applyLang("en"));

// -------------- Miktar Butonları -------------------
document.querySelectorAll(".amt-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".amt-btn").forEach(x => x.classList.remove("selected"));
    btn.classList.add("selected");
    selected = parseFloat(btn.dataset.amount);
    $("custom-amount").value = "";
  });
});

// -------------- Custom Miktar -----------------------
$("select-custom").addEventListener("click", () => {
  const v = parseFloat($("custom-amount").value);
  if (isNaN(v) || v <= 0) {
    alert(lang === "tr" ? "Geçerli bir miktar girin." : "Enter a valid amount.");
    return;
  }
  selected = v;
  document.querySelectorAll(".amt-btn").forEach(x => x.classList.remove("selected"));
  alert(v + " π");
});

// ---------------- Pi SDK Tespiti --------------------
let PI_AVAILABLE = false;
let PiObj = null;

function detectPi() {
  PiObj = window.Pi || null;
  PI_AVAILABLE = !!PiObj && typeof PiObj.createPayment === "function";

  if (PI_AVAILABLE) {
    $("status-text").innerText = LANGS[lang].statusValid;
    $("valid-banner").innerText = "✔ " + LANGS[lang].statusValid;
  } else {
    $("status-text").innerText = LANGS[lang].statusChecking + " (Yok)";
    $("valid-banner").innerText = "✖ Pi Browser Yok";
  }
}

detectPi();

// ---------------- İstatistikler ---------------------
function renderStats() {
  $("stat-total").innerText = total + " π";
  $("stat-donors").innerText = donors;
}

renderStats();

// ---------------- Bağış Gönder ----------------------
$("send-btn").addEventListener("click", async () => {
  if (selected <= 0) {
    alert(lang === "tr" ? "Lütfen bir miktar seçin." : "Please choose an amount.");
    return;
  }

  $("send-btn").disabled = true;
  $("send-btn").innerText = "⏳";

  if (!PI_AVAILABLE) {
    alert("Pi Browser gerekli!");
    resetSendBtn();
    return;
  }

  try {
    const payment = await PiObj.createPayment({
      amount: selected,
      memo: "Ayasofya Charity Bağışı",
      metadata: { type: "donation" }
    });

    const approved = await PiObj.approvePayment(payment.identifier);

    finalize(selected, payment.identifier);

  } catch (err) {
    alert("Hata: " + err.message);
  }

  resetSendBtn();
});

// ---------------- Buton Reset -----------------------
function resetSendBtn() {
  $("send-btn").disabled = false;
  $("send-btn").innerText = LANGS[lang].sendBtn;
}

// ---------------- İşlem Final -----------------------
function finalize(amount, txId) {
  total = Math.round((total + amount) * 100) / 100;
  donors++;

  localStorage.setItem("ay_total", total);
  localStorage.setItem("ay_donors", donors);

  renderStats();
  showReceipt(amount, txId);
}

// ---------------- Makbuz & QR -----------------------
function showReceipt(amount, txId) {
  $("receipt-amount").innerText = amount + " π";
  $("receipt-tx").innerText = txId;
  $("receipt-time").innerText = new Date().toLocaleString(lang === "tr" ? "tr-TR" : "en-US");

  $("receipt-qr").innerHTML = "";

  if (window.QRCode) {
    new QRCode($("receipt-qr"), {
      text: txId,
      width: 150,
      height: 150
    });
  }

  $("receipt").style.display = "block";
}

$("receipt-close").addEventListener("click", () => {
  $("receipt").style.display = "none";
});
