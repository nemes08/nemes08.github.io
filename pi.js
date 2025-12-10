// Demo pi.js stub - replace with real Pi integration if available
async function connectWallet(passive=false){
    await new Promise(r=>setTimeout(r,300));
    if(passive) return { publicKey: null };
    return { publicKey: 'PI' + Math.random().toString(36).slice(2,10).toUpperCase() };
}
if(typeof Pi === 'undefined'){
  window.Pi = {
    async createPayment(payload, callbacks){
      const id = 'PAY_' + Math.random().toString(36).slice(2,8).toUpperCase();
      if(callbacks && callbacks.onReadyForServerApproval) callbacks.onReadyForServerApproval(id);
      await new Promise(r=>setTimeout(r,900));
      const tx = 'TX_' + Math.random().toString(36).slice(2,10).toUpperCase();
      if(callbacks && callbacks.onReadyForServerCompletion) callbacks.onReadyForServerCompletion(id, tx);
      return { paymentId: id, txid: tx };
    }
  }
}
