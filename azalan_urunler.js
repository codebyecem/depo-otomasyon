document.addEventListener("DOMContentLoaded", function () {
    let tumAzalanlar = []; // 🔁 Arama için tüm veriyi saklayalım

    fetch("http://localhost:8000/stoklar")
        .then(res => res.json())
        .then(data => {
            tumAzalanlar = data.filter(urun => parseInt(urun.kalan_mt) < 1000);
            guncelleListe(tumAzalanlar); // ilk yükleme
        })
        .catch(err => {
            console.error("Veri yüklenemedi!", err);
        });

    // 🔁 Listeyi çizen fonksiyon
    function guncelleListe(urunler) {
        const liste = document.getElementById("azalanListe");
        liste.innerHTML = "";

        if (urunler.length === 0) {
            liste.innerHTML = "<li>Aramaya uyan ürün bulunamadı 😕</li>";
            return;
        }

        urunler.forEach(urun => {
            const li = document.createElement("li");
            li.innerHTML = `❗ <strong>${urun.kalite} ${urun.marka} - ${urun.en}</strong>: ${urun.mevcut_stok} mt kaldı`;
            liste.appendChild(li);
        });
    }

    // 🔍 Arama kutusuna göre filtreleme
    const aramaInput = document.getElementById("aramaInput");
    if (aramaInput) {
        aramaInput.addEventListener("input", function () {
            const aranan = this.value.toLowerCase();
            const filtreli = tumAzalanlar.filter(urun =>
                (`${urun.kalite} ${urun.marka} ${urun.en}`).toLowerCase().includes(aranan)
            );
            guncelleListe(filtreli);
        });
    }
});
