// dort_aylik_stok_app.js
document.addEventListener('DOMContentLoaded', function () {
    const kaliteSec = document.getElementById("kaliteSec");
    const markaSec = document.getElementById("markaSec");
    const olcuSec = document.getElementById("olcuSec");
    const hesaplaBtn = document.getElementById("hesaplaBtn");
    const resultPanel = document.querySelector(".result-panel");
    const urunBilgisiSpan = document.getElementById("urunBilgisi");
    const ortalamaMiktarSpan = document.getElementById("ortalamaMiktar");
    const geriDonBtn = document.getElementById("geriDonBtn");

    // Ortak ürün veri seti 
    const genelUrunVerisi = [
        { kalite: "AKRİLİK KUŞE", marka: "UPM", en: "200" },
        { kalite: "AKRİLİK KUŞE", marka: "AVERY", en: "210" },
        { kalite: "HOTMELT KUŞE", marka: "UPM", en: "190" },
        { kalite: "HOTMELT KUŞE", marka: "AVERY", en: "200" },
        { kalite: "OPAK", marka: "FRIMPEKS", en: "175" },
        { kalite: "OPAK", marka: "UPM", en: "180" },
    ];

    const gecmisStokVerileri = {
        "AKRİLİK KUŞE-UPM-200": [1000, 1100, 950, 1050],
        "AKRİLİK KUŞE-AVERY-210": [800, 850, 900, 780],
        "HOTMELT KUŞE-UPM-190": [1200, 1150, 1300, 1250],
        "HOTMELT KUŞE-AVERY-200": [900, 920, 880, 950],
        "OPAK-FRIMPEKS-175": [700, 750, 680, 720],
        "OPAK-UPM-180": [500, 520, 480, 550],
        // Diğer ürünleriniz için de buraya ekleme yapmalısınız
    };


    // Choices.js kurulumu
    const kaliteChoices = new Choices(kaliteSec, {
        searchEnabled: true,
        itemSelectText: '',
        shouldSort: false,
        removeItemButton: false
    });

    const markaChoices = new Choices(markaSec, {
        searchEnabled: true,
        itemSelectText: '',
        shouldSort: false,
        removeItemButton: false,
        choices: [{ value: "", label: "Önce kalite seçin", selected: true, disabled: true }]
    });

    const olcuChoices = new Choices(olcuSec, {
        searchEnabled: true,
        itemSelectText: '',
        shouldSort: false,
        removeItemButton: false,
        choices: [{ value: "", label: "Önce marka seçin", selected: true, disabled: true }]
    });

    // Sayfa yüklendiğinde kalite seçeneklerini doldur
    const initialKaliteOptions = [{ value: "", label: "Seçiniz", selected: true, disabled: true }].concat(
        [...new Set(genelUrunVerisi.map(v => v.kalite))].map(k => ({ value: k, label: k }))
    );
    kaliteChoices.setChoices(initialKaliteOptions, 'value', 'label', true);


    // Kalite seçimi değiştiğinde Marka ve Ölçü seçeneklerini güncelle
    kaliteSec.addEventListener("change", () => {
        const secilenKalite = kaliteSec.value;

        markaChoices.clearChoices();
        olcuChoices.clearChoices();

        markaChoices.disable();
        olcuChoices.disable();
        resultPanel.style.display = 'none'; // Sonuç panelini gizle

        let markaOptions = [{ value: "", label: "Seçiniz", selected: true, disabled: true }];

        if (secilenKalite) {
            const markalar = [...new Set(genelUrunVerisi.filter(v => v.kalite === secilenKalite).map(v => v.marka))];
            markaOptions = markaOptions.concat(markalar.map(m => ({ value: m, label: m })));
            markaChoices.enable();
        } else {
            markaOptions = [{ value: "", label: "Önce kalite seçin", selected: true, disabled: true }];
        }

        markaChoices.setChoices(markaOptions, 'value', 'label', true);
        olcuChoices.setChoices([{ value: "", label: "Önce marka seçin", selected: true, disabled: true }], 'value', 'label', true);
    });

    // Marka seçimi değiştiğinde Ölçü seçeneklerini güncelle
    markaSec.addEventListener("change", () => {
        const secilenKalite = kaliteSec.value;
        const secilenMarka = markaSec.value;

        olcuChoices.clearChoices();
        olcuChoices.disable();
        resultPanel.style.display = 'none'; // Sonuç panelini gizle

        let enOptions = [{ value: "", label: "Önce marka seçin", selected: true, disabled: true }];

        if (secilenMarka) {
            const enler = [...new Set(genelUrunVerisi.filter(v => v.kalite === secilenKalite && v.marka === secilenMarka).map(v => v.en))];
            enOptions = enOptions.concat(enler.map(en => ({ value: en, label: en })));
            olcuChoices.enable();
        } else {
            enOptions = [{ value: "", label: "Önce marka seçin", selected: true, disabled: true }];
        }
        olcuChoices.setChoices(enOptions, 'value', 'label', true);
    });

    // Hesapla butonuna basıldığında ortalamayı göster
    hesaplaBtn.addEventListener("click", () => {
        const secilenKalite = kaliteSec.value;
        const secilenMarka = markaSec.value;
        const secilenOlcu = olcuSec.value;

        if (!secilenKalite || !secilenMarka || !secilenOlcu) {
            alert("Lütfen tüm seçimleri yapınız (Kalite, Marka, EN).");
            resultPanel.style.display = 'none';
            return;
        }

        const urunAnahtari = `${secilenKalite}-${secilenMarka}-${secilenOlcu}`;
        const stokMiktarlari = gecmisStokVerileri[urunAnahtari];

        if (stokMiktarlari && stokMiktarlari.length === 4) { // Son 4 ayın verisi olduğundan emin olalım
            const toplamStok = stokMiktarlari.reduce((sum, current) => sum + current, 0);
            const ortalama = toplamStok / stokMiktarlari.length;

            urunBilgisiSpan.textContent = `${secilenKalite} - ${secilenMarka} - ${secilenOlcu}`;
            ortalamaMiktarSpan.textContent = ortalama.toFixed(2); // Ortalamayı 2 ondalık basamağa yuvarla
            resultPanel.style.display = 'block'; // Sonuç panelini göster
        } else {
            alert("Seçilen ürün için 4 aylık stok verisi bulunamadı veya eksik. Lütfen örnek verileri güncelleyin.");
            resultPanel.style.display = 'none';
        }
    });

    // Geri Dön butonu
    geriDonBtn.addEventListener('click', () => {
        window.location.href = 'anasayfa.html'; // Ana sayfaya dön
    });
});