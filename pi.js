// Pi Network Browser SDK yükleme
const Pi = window.Pi;

Pi.init({
    version: "2.0",
    sandbox: false // gerçek mod
});

async function connectWallet() {
    try {
        const scopes = ['username', 'payments'];

        const user = await Pi.authenticate(scopes, onIncompletePayment);

        console.log("Wallet connected:", user);
        alert("Cüzdan başarıyla bağlandı: " + user.username);

        return user;

    } catch (err) {
        console.error(err);
        alert("Cüzdan bağlanamadı.");
    }
}


// Ödenmemiş işlemler olursa Pi tarafından otomatik çağrılır
function onIncompletePayment(payment) {
    console.log("Incomplete payment detected:", payment);
}
