/* script.js
   - TR/EN multi-lang (inline object)
   - Pi SDK detection + createPayment usage (if Pi Browser)
   - QR generation (qrcode lib)
   - LocalStorage stats
   - Modal legal texts
   - Valide banner shows username if available
*/

// ---------- Translations ----------
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
    aboutTitle: "About Hagia Sophia",
    whyTitle: "Why Donate?"
  }
};

let lang = navigator.language && navigator.language.startsWith('en') ? 'en' : 'tr';

// ---------- elements ----------
const el = id => document.getElementById(id);
const amtBtns = Array.from(document.querySelectorAll('.amt-btn'));
const customInput = el('custom-amount');
const selectCustom = el('select-custom');
const sendBtn = el('send-btn');
const receiptEl = el('receipt');
const receiptClose = el('receipt-close');
const receiptAmount = el('receipt-amount');
const receiptTime = el('receipt-time');
const receiptTx = el('receipt-tx');
const receiptQR = el('receipt-qr');
const statusText = el('status-text');
const valideBanner = el('valide-banner');
const statTotal = el('stat-total');
const statDonors = el('stat-donors');

// state
let selected = 0;
let total = parseFloat(localStorage.getItem('ay_total') || '0');
let donors = parseInt(localStorage.getItem('ay_donors') || '0');
let PI_AVAILABLE = false;
let Pi = window.Pi || null;

// ---------- functions ----------
function applyLang(l){
  lang = l;
  const t = LANGS[l];
  if(!t) return;
  el('eyebrow').innerText = t.eyebrow;
  el('hero-title').innerText = t.title;
  el('hero-lead').innerText = t.lead;
  el('donate-title').innerText = t.donatePanel;
  el('donate-desc').innerText = t.donateDesc;
  sendBtn.innerText = t.sendBtn;
  el('mini-note').innerText = t.sandboxNote;
  el('stat-total-label').innerText = t.totalLabel;
  el('stat-donors-label').innerText = t.donorsLabel;
  statusText.innerText = t.statusChecking;
  // legal texts (brief)
  el('privacy-content').innerText = (l==='tr' ? defaultPrivacyTR : defaultPrivacyEN);
  el('terms-content').innerText = (l==='tr' ? defaultTermsTR : defaultTermsEN);
  el('cookie-content').innerText = (l==='tr' ? defaultCookieTR : defaultCookieEN);
}
applyLang(lang);

// lang buttons
el('btn-tr').addEventListener('click', ()=>applyLang('tr'));
el('btn-en').addEventListener('click', ()=>applyLang('en'));

// amounts
amtBtns.forEach(b=>{
  b.addEventListener('click', ()=>{
    amtBtns.forEach(x=>x.classList.remove('selected'));
    b.classList.add('selected');
    selected = parseFloat(b.dataset.amount);
    customInput.value = '';
  });
});
selectCustom.addEventListener('click', ()=>{
  const v = parseFloat(customInput.value);
  if(isNaN(v) || v <= 0){ alert(lang==='tr' ? 'Lütfen geçerli bir miktar girin.' : 'Please enter a valid amount.'); return; }
  amtBtns.forEach(x=>x.classList.remove('selected'));
  selected = v;
  alert((lang==='tr' ? v + ' π seçildi' : v + ' π selected'));
});

// CTA scroll
el('cta-donate').addEventListener('click', ()=> el('donation-card').scrollIntoView({behavior:'smooth'}));

// detect Pi SDK
function detectPi(){
  Pi = window.Pi || null;
  PI_AVAILABLE = !!Pi && typeof Pi.createPayment === 'function';
  if(PI_AVAILABLE){
    // Optionally we can try to get user info if Pi exposes it. (SDK specifics may vary.)
    statusText.innerText = LANGS[lang].statusValid;
    valideBanner.innerText = '✅ ' + LANGS[lang].statusValid;
  } else {
    statusText.innerText = LANGS[lang].statusChecking + ' (SDK yok)';
    valideBanner.innerText = '🔎 ' + LANGS[lang].statusChecking;
  }
}
detectPi();

// stats render
function renderStats(){
  statTotal.innerText = `${total} π`;
  statDonors.innerText = `${donors}`;
}
renderStats();

// send donation
sendBtn.addEventListener('click', async ()=>{
  if(selected <= 0){ alert(lang==='tr' ? 'Lütfen bir miktar seçin.' : 'Please select an amount.'); return; }
  sendBtn.disabled = true;
  sendBtn.innerText = (lang==='tr' ? 'İşlem başlatılıyor…' : 'Starting payment…');

  if(PI_AVAILABLE){
    try{
      Pi.createPayment({
        amount: selected,
        memo: 'Ayasofya Charity Donation',
        metadata: { type:'donation', lang }
      }, {
        onReadyForServerApproval(paymentId){
          console.log('approval:', paymentId);
        },
        onReadyForServerCompletion(paymentId){
          finalize(selected, paymentId);
        },
        onCancel(){
          alert(lang==='tr' ? 'Bağış iptal edildi.' : 'Donation cancelled.');
          resetSendBtn();
        },
        onError(err){
          alert((lang==='tr' ? 'Hata oluştu: ' : 'Error: ') + (err && err.message ? err.message : JSON.stringify(err)));
          resetSendBtn();
        }
      });
    } catch(e){
      alert(lang==='tr' ? 'İşlem başlatılamadı.' : 'Failed to start payment.');
      console.error(e);
      resetSendBtn();
    }
  } else {
    // demo fallback
    setTimeout(()=>{ finalize(selected, 'demo-' + Date.now()); }, 900);
  }
});

function resetSendBtn(){
  sendBtn.disabled = false;
  sendBtn.innerText = LANGS[lang].sendBtn;
}

function finalize(amount, txId){
  total = Math.round((parseFloat(total) + parseFloat(amount)) * 100) / 100;
  donors = parseInt(donors) + 1;
  localStorage.setItem('ay_total', total);
  localStorage.setItem('ay_donors', donors);
  renderStats();

  showReceipt(amount, txId);

  // reset selection
  selected = 0;
  amtBtns.forEach(x=>x.classList.remove('selected'));
  customInput.value = '';
  resetSendBtn();
}

// receipt & QR
function showReceipt(amount, txId){
  receiptAmount.innerText = `${amount} π`;
  receiptTime.innerText = new Date().toLocaleString(lang==='tr' ? 'tr-TR' : 'en-US');
  receiptTx.innerText = txId || '—';
  receiptQR.innerHTML = '';

  const payload = JSON.stringify({
    project: 'Ayasofya Charity',
    amount,
    tx: txId,
    date: new Date().toISOString()
  });

  if(window.QRCode){
    QRCode.toCanvas(payload, { width: 160, margin:1 }, function(err, canvas){
      if(err){ console.error('QR err', err); const pre = document.createElement('pre'); pre.textContent = payload; receiptQR.appendChild(pre); return; }
      receiptQR.appendChild(canvas);
    });
  } else {
    const pre = document.createElement('pre'); pre.textContent = payload; receiptQR.appendChild(pre);
  }

  receiptEl.style.display = 'block';
  setTimeout(()=>{ receiptEl.style.display = 'none'; }, 7000);
}
receiptClose.addEventListener('click', ()=> receiptEl.style.display='none');

// legal modals
const modalPrivacy = el('modal-privacy');
const modalTerms = el('modal-terms');
const modalCookie = el('modal-cookie');
el('link-privacy').addEventListener('click', (e)=>{ e.preventDefault(); modalPrivacy.style.display='flex'; });
el('link-terms').addEventListener('click', (e)=>{ e.preventDefault(); modalTerms.style.display='flex'; });
el('link-cookie').addEventListener('click', (e)=>{ e.preventDefault(); modalCookie.style.display='flex'; });
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click', ()=>{ b.closest('.modal').style.display='none'; }));
[modalPrivacy, modalTerms, modalCookie].forEach(m=>m.addEventListener('click', (ev)=>{ if(ev.target === m) m.style.display='none'; }));

// ---------- Default legal texts (short templates) ----------
const defaultPrivacyTR = `
Ayasofya Charity ("vakıf") kişisel verilerin korunmasına önem verir.
Bu platform; bağış işlemleri, işlem kayıtları ve iletişim amacıyla sınırlı veri toplar.
Kişisel verileriniz üçüncü şahıslarla paylaşılmaz, yasal zorunluluklar saklıdır.
Daha detaylı KVKK metni için bize ulaşın.
`;
const defaultTermsTR = `
Bu site bağış kabul eden bir platformdur. Bağışlar gönüllüdür.
Vakfın bağışları kullanma prensipleri ve iade politikası için vakıf ile iletişime geçin.
`;
const defaultCookieTR = `
Site, performans ve istatistik amaçlı çerezler kullanır. Kişisel veri toplama sınırlıdır.
`;

const defaultPrivacyEN = `
Ayasofya Charity respects personal data protection.
This platform collects limited data for donations, records and communication purposes.
Personal data is not shared with third parties except legal obligations.
Contact us for detailed policy.
`;
const defaultTermsEN = `
This site accepts donations. Donations are voluntary.
For use of funds, refunds and policies contact the foundation.
`;
const defaultCookieEN = `
The site uses cookies for performance and statistics. Minimal personal data is collected.
`;

// set legal text
el('privacy-content').innerText = lang==='tr' ? defaultPrivacyTR : defaultPrivacyEN;
el('terms-content').innerText = lang==='tr' ? defaultTermsTR : defaultTermsEN;
el('cookie-content').innerText = lang==='tr' ? defaultCookieTR : defaultCookieEN;

// on load
window.addEventListener('load', ()=>{
  detectPi();
  renderStats();
  // if Pi exists and exposes username (example - may vary by sdk), reflect it:
  try{
    if(window.Pi && window.Pi.user && window.Pi.user.username){
      const u = window.Pi.user.username;
      statusText.innerText = LANGS[lang].statusValid + ' · @' + u;
      valideBanner.innerText = '✅ ' + LANGS[lang].statusValid + ': @' + u;
    }
  } catch(e){}
});

// Accessibility: keyboard close modals with Esc
window.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){
    [modalPrivacy, modalTerms, modalCookie].forEach(m=>m.style.display='none');
    receiptEl.style.display='none';
  }
});
