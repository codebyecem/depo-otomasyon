# Proje Yol Haritası

Bu dosya, Depo Takip Sistemi projesinin geliştirme sürecini ve gelecekteki hedeflerini belgelemek için oluşturulmuştur.

## Mevcut Durum (9 Temmuz 2025)

Proje, bir Node.js/Express arka ucu ve HTML/CSS/JavaScript ön ucundan oluşan bir web uygulamasıdır. Mevcut işlevsellik aşağıdaki gibidir:

*   **Stok Görüntüleme:** MySQL veritabanından stok verilerini okuyup listeleyebilir.
*   **Ürün Filtreleme:** Kullanıcıların kalite, marka ve ölçüye göre ürünleri filtrelemesine olanak tanır.
*   **Raporlama:** 4 aylık stok eşiğinin altında olan ürünleri gösteren bir rapor sayfası bulunur.
*   **İşlem Arayüzü:** Stok ekleme ve çıkarma işlemleri için kullanıcı arayüzleri mevcuttur.

### Eksiklikler ve Geliştirme Alanları

1.  **Veritabanı Güncelleme:** Stok ekleme veya çıkarma işlemlerini veritabanına kaydeden arka uç mantığı (API endpoint) eksiktir. Mevcut durumda işlemler sadece arayüzde simüle edilmektedir.
2.  **Hata Yönetimi:** Hem sunucu hem de istemci tarafında daha sağlam bir hata yönetimi mekanizması kurulabilir.
3.  **Kullanıcı Geri Bildirimi:** İşlemlerin sonucu hakkında kullanıcıya daha net ve bilgilendirici geri bildirimler (örneğin, başarılı veya başarısız bildirimleri) sağlanabilir.

## Gelecek Planları

- [ ] Stok güncelleme (artırma/azaltma) işlemlerini gerçekleştiren API endpoint'inin oluşturulması.
- [ ] `onay.html` ve `fabrika.html` sayfalarındaki "Onayla" butonlarının bu yeni API'yi çağıracak şekilde güncellenmesi.
- [ ] "Azalan Ürünler" sayfası için bir raporlama özelliği eklenmesi.
- [ ] Kodun yeniden düzenlenmesi (refactoring) ve okunabilirliğin artırılması.
