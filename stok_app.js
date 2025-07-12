 document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const kalite = urlParams.get('kalite');
    const marka = urlParams.get('marka');
    const en = urlParams.get('en');
    const kaynak = urlParams.get('kaynak');
    const endpoint = kaynak === 'depo' ? 'depo_stoklar' : 'stoklar';

    // Veriyi çek
    fetch(`http://localhost:8000/${endpoint}`)
        .then(res => res.json())
        .then(data => {
            const urun = data.find(item =>
                item.kalite === kalite &&
                item.marka === marka &&
                item.en.toString() === en.toString()
            );

            if (!urun) {
                alert("Ürün veritabanında bulunamadı!");
                mevcutStokSpan.textContent = "Yok";
                return;
            }

            seciliUrun = urun;
            mevcutStokSpan.textContent = urun.mevcut_stok;
            toplamAlanSpan.textContent = ((parseFloat(urun.en) / 1000) * urun.mevcut_stok).toFixed(2);
        })
        .catch(err => {
            console.error("Veri çekme hatası:", err);
            alert("Veri çekilirken hata oluştu.");
        });

    // Üretime Ver
    uretmeVerBtn.addEventListener("click", () => {
        const miktar = parseFloat(uretmeMiktarInput.value);
        if (!seciliUrun || isNaN(miktar) || miktar <= 0) return alert("Geçerli bir miktar giriniz.");

        const yeniStok = seciliUrun.mevcut_stok - miktar;
        if (yeniStok < 0) return alert("Yetersiz stok!");

        guncelleStok(yeniStok, `✔️ ${miktar} mt üretime verildi.`);
    });

    // Stoka Ekle
    stokaEkleBtn.addEventListener("click", () => {
        const miktar = parseFloat(eklemeMiktarInput.value);
        if (!seciliUrun || isNaN(miktar) || miktar <= 0) return alert("Geçerli bir miktar giriniz.");

        const yeniStok = seciliUrun.mevcut_stok + miktar;
        guncelleStok(yeniStok, `➕ ${miktar} mt stoka eklendi.`);
    });

    // Geri Dön
    geriDonBtn.addEventListener("click", () => {
        window.location.href = kaynak === "depo" ? "depo.html" : "fabrika.html";
    });

    // Veritabanına güncelleme isteği gönder
    function guncelleStok(yeniStok, mesaj) {
        fetch(`http://localhost:8000/${endpoint}/${seciliUrun.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mevcut_stok: yeniStok })
        })
        .then(res => res.json())
        .then(data => {
            alert(mesaj);
            mevcutStokSpan.textContent = yeniStok;
            toplamAlanSpan.textContent = ((parseFloat(seciliUrun.en) / 1000) * yeniStok).toFixed(2);
            seciliUrun.mevcut_stok = yeniStok;
        })
        .catch(err => {
            console.error("Stok güncelleme hatası:", err);
            alert("Stok güncellenemedi.");
        });
    }
});


