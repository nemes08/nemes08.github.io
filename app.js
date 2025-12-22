document.addEventListener("DOMContentLoaded", () => {
  if (!window.Pi) {
    alert("Pi Browser ile açmalısın!");
    return;
  }

  Pi.init({
    version: "2.0",
    sandbox: true
  });

  console.log("Pi SDK yüklendi ✅");
});

async function pay() {
  try {
    const auth = await Pi.authenticate(["payments"]);

    const res = await fetch(
      "https://pi-trust-market-backend.onrender.com/create-payment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 1,
          memo: "Pi Trust Market Test",
          uid: auth.user.uid
        })
      }
    );

    const data = await res.json();
    console.log(data);
    alert("Ödeme isteği oluşturuldu 🚀");

  } catch (err) {
    alert("Hata: " + err.message);
  }
}
