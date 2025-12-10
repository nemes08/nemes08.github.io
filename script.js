/* script.js
   - TR/EN multi-lang
   - Pi SDK integration (if available)
   - QR code receipt (uses qrcode.min.js loaded in index.html)
   - Local storage stats
*/

// --------- Translations ----------
const LANGS = {
  tr: {
    eyebrow: "Kültürel Miras İçin",
    title: "Ayasofya’yı Destekleyin — Global Pi Bağışı",
    lead: "Şeffaf, güvenli ve hızlı bağış. Pi Network ile anında bağış yapın; her işlem için makbuz alın.",
    donatePanel: "Bağış Paneli",
    donateDesc: "Hızlıca bir miktar seçin ya da özel miktar girin. Pi Browser ile bağış işlemini onaylayın.",
    sendBtn: "Bağışı Gönder",
    statusChecking: "Kontrol ediliyor…",
    statusValid: "Valide bağlantı sağlandı",
    sandboxNote: "Ödeme Pi Browser içinde çalışır. Test için sandbox modu kullanılabilir.",
    totalLabel: "Toplam Bağış",
    donorsLabel: "Bağışçı",
    receiptTitle: "Makbuz",
    receiptTx: "İşlem ID",
    aboutTitle: "Ayasofya Hakkında",
    whyTitle: "Neden Bağış?"
  },
  en: {
    eyebrow: "For Cultural Heritage",
    title: "Support Hagia Sophia — Global Pi Donation",
    lead: "Transparent, secure and fast donations. Donate with Pi Network and receive a receipt for each transaction.",
    donatePanel: "Donation Panel",
    donateDesc: "Choose an amount or enter a custom amount. Confirm payment in Pi Browser.",
    sendBtn: "Send Donation",
    statusChecking: "Checking…",
    statusValid: "Valid connection established",
    sandboxNote: "Payments work inside Pi Browser. For testing, use sandbox mode.",
    totalLabel: "Total Donated",
    donorsLabel: "Donors",
    receiptTitle: "Receipt",
    receiptTx: "Tx ID",
    aboutTitle: "About Hagia Sophia",
    whyTitle: "Why Donate?"
  }
};

let LANG = navigator.language && navigator.language.startsWith('en') ? 'en' : 'tr';

// --------- Element refs ----------
const el = id => document.getElementById(id);

const amountButtons = Array.from(document.querySelectorAll('.amt-btn'));
const customAmountInput = el('custom-amount');
const selectCustomBtn = el('select-custom');
const sendBtn = el('send-btn');
const receiptEl = el('receipt');
const receiptAmount = el('receipt-amount');
const receiptTime = el('receipt-time');
const receiptTx = el('receipt-tx');
const receiptQR = el('receipt-qr');
const receiptClose = el('receipt-close');
const statusText = el('status-text');
const valideText = el('valide-text');
const statTotal = el('stat-total');
const statDonors = el('stat-donors');

// state
let selectedAmount = 0;
let total = parseFloat(localStorage.getItem('ay_total') || '0');
let donors = parseInt(localStorage.getItem('ay_donors') || '0');

// init UI values
function renderStats(){
  statTotal.innerText = `${total} π`;
  statDonors.innerText = `${donors}`;
}
renderStats();

// ------------- Language -------------
function applyLang(l){
  LANG = l;
  const t = LANGS[l];
  if(!t) return;
  document.getElementById('eyebrow').innerText = t.eyebrow;
  document.getElementById('hero-title').innerText = t.title;
  document.getElementById('hero-lead').innerText = t.lead;
  document.getElementById('donate-title').innerText = t.donatePanel;
  document.getElementById('donate-desc').innerText = t.donateDesc;
  sendBtn.innerText = t.sendBtn;
  document.getElementById('mini-note').innerText = t.sandboxNote;
  document.getElementById('stat-total-label').innerText = t.totalLabel;
  document.getElementById('stat-donors-label').innerText = t.donorsLabel;
  document.getElementById('about-title').innerText = t.aboutTitle;
  document.getElementById('why-title').innerText = t.whyTitle;
  statusText.innerText = t.statusChecking;
  valideText.innerText = t.statusChecking;
}
applyLang(LANG);

// lang buttons
document.getElementById('btn-tr').addEventListener('click',()=>applyLang('tr'));
document.getElementById('btn-en').addEventListener('click',()=>applyLang('en'));

// ------------- Amount selection ----------
amountButtons.forEach(btn=>{
  btn.addEventListener('click',()=>{
    amountButtons.forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedAmount = parseFloat(btn.dataset.amount);
    customAmountInput.value = '';
  });
});

selectCustomBtn.addEventListener('click',()=>{
  const v = parseFloat(customAmountInput.value);
  if(isNaN(v) || v <= 0){
    alert('Lütfen geçerli bir miktar girin.');
    return;
  }
  amountButtons.forEach(b=>b.classList.remove('selected'));
  selectedAmount = v;
  alert(`${v} π seçildi`);
});

// quick CTA
el('cta-donate').addEventListener('click', ()=>{
  document.querySelector('#donation-card').scrollIntoView({behavior:'smooth'});
});

// ------------- Pi SDK integration ----------
let PI_AVAILABLE = false;
let Pi = window.Pi || null;

function detectPi(){
  Pi = window.Pi || null;
  PI_AVAILABLE = !!Pi && typeof Pi.createPayment === 'function';
  if(PI_AVAILABLE){
    statusText.innerText = LANGS[LANG].statusValid;
    valideText.innerText = LANGS[LANG].statusValid;
  } else {
    statusText.innerText = LANGS[LANG].statusChecking + ' (SDK yok)';
    valideText.innerText = LANGS[LANG].statusChecking;
  }
}
detectPi();

// ------------- Send donation ----------
sendBtn.addEventListener('click', async ()=>{
  if(selectedAmount <= 0){
    alert(LANG === 'tr' ? 'Lütfen bir miktar seçin.' : 'Please select an amount.');
    return;
  }

  // UX: disable
  sendBtn.disabled = true;
  sendBtn.innerText = (LANG==='tr' ? 'İşlem başlatılıyor…' : 'Starting payment…');

  // If Pi SDK exists, use it. Otherwise simulate (demo).
  if(PI_AVAILABLE){
    try{
      Pi.createPayment({
        amount: selectedAmount,
        memo: 'Ayasofya Charity Donation',
        metadata: { type: 'donation', lang: LANG }
      }, {
        onReadyForServerApproval: function(paymentId){
          // Payment requested; wait for completion
          console.log('Approval requested:', paymentId);
        },
        onReadyForServerCompletion: function(paymentId){
          console.log('Payment completed:', paymentId);
          finalizeDonation(selectedAmount, paymentId);
        },
        onCancel: function(){
          alert(LANG==='tr' ? 'Bağış iptal edildi.' : 'Donation cancelled.');
          sendBtn.disabled = false;
          sendBtn.innerText = LANGS[LANG].sendBtn;
        },
        onError: function(err){
          console.error('Pi error', err);
          alert((LANG==='tr' ? 'Hata oluştu: ' : 'Error: ') + (err && err.message ? err.message : JSON.stringify(err)));
          sendBtn.disabled = false;
          sendBtn.innerText = LANGS[LANG].sendBtn;
        }
      });
    } catch (e){
      console.error(e);
      alert((LANG==='tr'? 'İşlem başlatılamadı.' : 'Failed to start payment.'));
      sendBtn.disabled = false;
      sendBtn.innerText = LANGS[LANG].sendBtn;
    }
  } else {
    // Demo fallback: simulate success after 1.2s
    setTimeout(()=>{
      const fakeTx = 'demo-' + Date.now();
      finalizeDonation(selectedAmount, fakeTx);
    }, 1200);
  }
});

// finalize donation: update stats + show receipt
function finalizeDonation(amount, txId){
  total = Math.round((parseFloat(total) + parseFloat(amount)) * 100) / 100;
  donors = parseInt(donors) + 1;
  localStorage.setItem('ay_total', total);
  localStorage.setItem('ay_donors', donors);
  renderStats();

  // show receipt with QR
  showReceipt(amount, txId);

  // reset
  selectedAmount = 0;
  amountButtons.forEach(b=>b.classList.remove('selected'));
  customAmountInput.value = '';
  sendBtn.disabled = false;
  sendBtn.innerText = LANGS[LANG].sendBtn;
}

// ------------- Receipt popup + QR -------------
function showReceipt(amount, txId){
  receiptAmount.innerText = `${amount} π`;
  receiptTime.innerText = new Date().toLocaleString('tr-TR');
  receiptTx.innerText = txId;
  receiptQR.innerHTML = ''; // clear

  // build data for QR (simple JSON)
  const qrData = JSON.stringify({
    project: 'Ayasofya Charity',
    amount,
    tx: txId,
    date: new Date().toISOString()
  });

  // generate QR
  if(window.QRCode){
    QRCode.toCanvas(qrData, { width: 160, margin:1 }, function (err, canvas) {
      if(err){ console.error(err); return; }
      receiptQR.appendChild(canvas);
    });
  } else {
    // fallback: show text
    const pre = document.createElement('pre');
    pre.style.fontSize='11px';
    pre.style.color='var(--muted)';
    pre.textContent = qrData;
    receiptQR.appendChild(pre);
  }

  receiptEl.style.display = 'block';

  // auto hide after 6s
  setTimeout(()=>{ receiptEl.style.display='none'; }, 6000);
}

receiptClose.addEventListener('click', ()=> receiptEl.style.display='none');

// ------------- On load checks ----------
window.addEventListener('load', ()=>{
  detectPi();
  renderStats();

  // mark valid if Pi exists
  if(PI_AVAILABLE){
    statusText.innerText = LANGS[LANG].statusValid;
    valideText.innerText = LANGS[LANG].statusValid;
  } else {
    statusText.innerText = LANGS[LANG].statusChecking + ' (SDK yok)';
    valideText.innerText = LANGS[LANG].statusChecking;
  }
});
