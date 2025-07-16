document.addEventListener('DOMContentLoaded', function () {
  const kaliteSec = document.getElementById("kaliteSec");
  const markaSec  = document.getElementById("markaSec");
  const olcuSec   = document.getElementById("olcuSec");
  const onaylaBtn = document.getElementById("onaylaBtn");

  let stokVerisi = [];

  const sayfaAdi = window.location.pathname.split("/").pop();
  const kaynak = sayfaAdi === "depo.html"
    ? "depo_stoklar"
    : "stoklar";

  markaSec.disabled = true;
  olcuSec.disabled  = true;

  fetch(`http://localhost:8000/${kaynak}`)
    .then(res => res.json())
    .then(data => {
      stokVerisi = data;
      const kaliteListesi = [...new Set(data.map(i => i.kalite))];
      kaliteListesi.forEach(k => {
        const opt = document.createElement("option");
        opt.value = k;
        opt.textContent = k;
        kaliteSec.append(opt);
      });
    })
    .catch(err => {
      console.error("❌ Veri yüklenemedi:", err);
      alert("Veri yüklenemedi!");
    });

  kaliteSec.addEventListener("change", () => {
    markaSec.innerHTML = `<option value="">Seçiniz</option>`;
    olcuSec.innerHTML  = `<option value="">Seçiniz</option>`;
    markaSec.disabled = false;
    olcuSec.disabled  = true;

    const secKalite = kaliteSec.value;
    const markalar = stokVerisi
      .filter(i => i.kalite === secKalite)
      .map(i => i.marka);
    [...new Set(markalar)].forEach(m => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      markaSec.append(opt);
    });
  });

  markaSec.addEventListener("change", () => {
    olcuSec.innerHTML = `<option value="">Seçiniz</option>`;
    olcuSec.disabled  = false;

    const secKalite = kaliteSec.value;
    const secMarka   = markaSec.value;

    const olculer = stokVerisi
      .filter(i => i.kalite===secKalite && i.marka===secMarka)
      .map(i => i.en);
    [...new Set(olculer)].forEach(e => {
      const opt = document.createElement("option");
      opt.value = e;
      opt.textContent = e;
      olcuSec.append(opt);
    });
  });

  onaylaBtn.addEventListener("click", () => {
    const kalite = kaliteSec.value;
    const marka  = markaSec.value;
    const en     = olcuSec.value;
    if (!kalite||!marka||!en) {
      return alert("Lütfen tüm alanları seçin.");
    }
    const hedef = `stok.html?kalite=${encodeURIComponent(kalite)}&marka=${encodeURIComponent(marka)}&en=${encodeURIComponent(en)}&kaynak=${kaynak==="depo_stoklar"?"depo":"fabrika"}`;
    window.location.href = hedef;
  });
});