// script.js for Ayasofya Charity dApp
let selectedAmount = 0;
let total = 0;
let donors = 0;

function selectAmount(a){
  selectedAmount = a;
  alert(a + ' π seçildi');
}

async function sendDonation(){
  if(selectedAmount <= 0){
    alert('Lütfen bir miktar seçin.');
    return;
  }
  if(typeof connectWallet === 'function' && typeof Pi !== 'undefined'){
    try{
      const user = await connectWallet();
      if(!user){ alert('Cüzdan bağlanamadı'); return; }
      const payment = await Pi.createPayment({
        amount: selectedAmount,
        memo: 'Ayasofya Charity Donation',
        metadata: { project: 'AyasofyaCharity' }
      },{
        onReadyForServerApproval(paymentId){ console.log('Approve:', paymentId); },
        onReadyForServerCompletion(paymentId, txid){ 
          console.log('Complete:', paymentId, txid);
          updateStats(selectedAmount);
          alert('Bağış başarılı! TXID: '+txid);
        },
        onCancel(paymentId){ alert('Bağış iptal edildi'); },
        onError(error,paymentId){ alert('Hata oluştu: '+error); console.error(error); }
      });
    }catch(e){
      console.error(e);
      alert('Ödeme başlatılamadı');
    }
  } else {
    setTimeout(()=>{ updateStats(selectedAmount); alert('Bağış simülasyonu tamamlandı'); }, 800);
  }
}

function updateStats(a){
  total += a;
  donors += 1;
  document.getElementById('total').innerText = total;
  document.getElementById('donors').innerText = donors;
}

function setLang(l){
  if(l==='en'){
    document.getElementById('hero-title').innerText = 'Support Hagia Sophia worldwide';
    document.getElementById('hero-sub').innerText = 'Donate with Pi Network and support cultural heritage.';
    document.getElementById('donate-title').innerText = 'Donation Panel';
    document.getElementById('donate-desc').innerText = 'Choose an amount to donate using Pi Blockchain:';
  } else {
    document.getElementById('hero-title').innerText = 'Dünya çapında Ayasofya’ya destek olun';
    document.getElementById('hero-sub').innerText = 'Pi Network ile şeffaf bağış gönderin ve kültürel mirasa katkı sağlayın.';
    document.getElementById('donate-title').innerText = 'Bağış Paneli';
    document.getElementById('donate-desc').innerText = 'Pi Blockchain üzerinde güvenli bağış göndermek için bir miktar seçin:';
  }
}
