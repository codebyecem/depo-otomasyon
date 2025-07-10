document.addEventListener('DOMContentLoaded', function () {
    const kaliteSec = document.getElementById("kaliteSec");
    const markaSec = document.getElementById("markaSec");
    const olcuSec = document.getElementById("olcuSec");
    const onaylaBtn = document.getElementById("onaylaBtn");
    const geriDonBtn = document.getElementById("geriDonBtn");

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
        removeItemButton: false
    });

    const olcuChoices = new Choices(olcuSec, {
        searchEnabled: true,
        itemSelectText: '',
        shouldSort: false,
        removeItemButton: false
    });

    let urunVerisi = [];

    fetch("http://localhost:8000/stoklar")
        .then(res => res.json())
        .then(data => {
            urunVerisi = data;

            // Kalite verilerini yükle
            const kaliteListesi = [...new Set(data.map(item => item.kalite))];
            const kaliteOptions = [{ value: "", label: "Seçiniz", selected: true, disabled: true }]
                .concat(kaliteListesi.map(k => ({ value: k, label: k })));
            kaliteChoices.setChoices(kaliteOptions, 'value', 'label', true);
        })
        .catch(err => {
            alert("Veri yüklenemedi!");
            console.error(err);
        });

    kaliteSec.addEventListener("change", () => {
        const secilenKalite = kaliteSec.value;

        markaChoices.clearChoices();
        markaChoices.disable();
        olcuChoices.clearChoices();
        olcuChoices.disable();

        if (!secilenKalite) return;

        const markaListesi = [...new Set(urunVerisi
            .filter(item => item.kalite === secilenKalite)
            .map(item => item.marka))];

        const markaOptions = [{ value: "", label: "Seçiniz", selected: true, disabled: true }]
            .concat(markaListesi.map(m => ({ value: m, label: m })));

        markaChoices.setChoices(markaOptions, 'value', 'label', true);
        markaChoices.enable();
    });

    markaSec.addEventListener("change", () => {
        const secilenKalite = kaliteSec.value;
        const secilenMarka = markaSec.value;

        olcuChoices.clearChoices();
        olcuChoices.disable();

        if (!secilenKalite || !secilenMarka) return;

        const enListesi = [...new Set(urunVerisi
            .filter(item => item.kalite === secilenKalite && item.marka === secilenMarka)
            .map(item => item.en))];

        const enOptions = [{ value: "", label: "Seçiniz", selected: true, disabled: true }]
            .concat(enListesi.map(en => ({ value: en, label: en })));

        olcuChoices.setChoices(enOptions, 'value', 'label', true);
        olcuChoices.enable();
    });

    onaylaBtn.addEventListener("click", () => {
        const kalite = kaliteSec.value;
        const marka = markaSec.value;
        const en = olcuSec.value;

        if (!kalite || !marka || !en) {
            alert("Lütfen tüm seçimleri yapınız.");
            return;
        }

        window.location.href = `stok.html?kalite=${kalite}&marka=${marka}&en=${en}`;
    });

    geriDonBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});

