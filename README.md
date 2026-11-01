# 🌍 DÜNYA FATİHİ 3: 1939 DÜNYA HARBİ (World Conqueror 3 Tarzı Sıra Tabanlı Strateji Oyunu)

Attığınız silah, tank ve uçak çizimleriyle hazırlanmış, **Dünya Fatihi 3 (World Conqueror 3)** mekaniklerine ve görsel atmosferine sahip sıra tabanlı grand strategy oyunu.

---

## 🎮 Nasıl Oynanır?

### 1. Oyunu Başlatma
- **Tarayıcı Üzerinden:** Doğrudan tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidebilir veya `index.html` dosyasını çift tıklayarak açabilirsiniz.
- **Sunucuyu Başlatmak İsterseniz:** Terminalde `node server.js` komutunu çalıştırmanız yeterlidir.

---

## ⚔️ Temel Oyun Mekanikleri

1. **Sıra Tabanlı Sistem (Turn-Based):**
   - Her tur başında sahip olduğunuz şehir ve bölgelerden **Altın 🪙**, **Çelik ⚙️** ve **Petrol 🛢️** geliri elde edersiniz.
   - Hamlelerinizi tamamladığınızda sağ üstteki kırmızı **"TURU BİTİR ➔"** butonuna basarsınız (Kısayol: `Boşluk / Space`).
   - Sırasıyla yapay zeka ülkeleri (Almanya, SSCB, ABD, İngiltere, Japonya vb.) ekranda akan özel bayrak anonslarıyla kendi hamlelerini ve takviyelerini yaparlar.

2. **SVG Vektör Dünya Haritası:**
   - Harita tamamen interaktif SVG vektör çizimleriyle hazırlanmıştır.
   - **Yakınlaşma / Uzaklaşma:** Fare tekerleği veya harita kontrolleri (`+` / `−` tuşları).
   - **Sürükleme:** Harita üzerinde farenin sol tuşuyla basılı tutarak dünyayı gezebilirsiniz.
   - **Minimap Radar:** Sağ alttaki radardan tüm dünyadaki güç dengesini izleyebilirsiniz.
   - **Başkente Odaklanma:** `🏛️` butonuyla anında başkentinize geri dönebilirsiniz.

3. **Birlik Hareketi ve Dünya Fatihi 3 Canlı Muharebesi:**
   - Kendi bölgenizdeki bir birliği seçin (Tank, Piyade veya Uçak).
   - Harita üzerinde yeşil halkalar gidebileceğiniz komşu bölgeleri, kırmızı nişangahlar ise saldırabileceğiniz düşman hedeflerini gösterir.
   - Düşman bölgesine saldırdığınızda **Dünya Fatihi 3 tarzı animasyonlu savaş sahnesi** açılır:
     - Namlu geri tepmesi, top atışı, duman ve makineli tüfek ses efektleri.
     - Düşman birliği yok edildiğinde bölge sizin renginize bürünür ve marş eşliğinde fethedilir!

4. **Kışla, Fabrika ve Havalimanı Üretimi:**
   - Kendi kontrolünüzdeki şehirlere tıklayıp **"🏭 Birlik Üret"** menüsünü açın:
     - **Piyadeler:** Hafif Piyade (Tüfek), Taarruz Piyadesi (MP40/Thompson/PPSh), Tanksavar Piyadesi (Panzerschreck/Bazooka).
     - **Zırhlı Birlikler:** Hafif Tank (T-26/Stuart), Orta Tank (Panzer IV/T-34/Sherman), Ağır Tank (Tiger I/KV-1/Churchill).
     - **Hava Kuvvetleri:** Avcı Uçağı (Spitfire/Bf 109/Mustang/Zero), Bombardıman Uçağı (Ju 87 Stuka/B-17 Uçan Kale/Lancaster).

5. **Efsanevi Ordu Komutanları (Generaller):**
   - **Mareşal M. Kemal Atatürk:** Tüm orduya +30% Taarruz, +25% Savunma ve +1 Hareket menzili.
   - **İsmet İnönü:** Vatan savunması +35% ve tahkimat direnci.
   - **Heinz Guderian & Erwin Rommel:** Blitzkrieg tank dehası ve kritik darbe artışı.
   - **Georgy Zhukov:** Ağır can ve kuşatma avantajı.
   - **George S. Patton & Bernard Montgomery & Isoroku Yamamoto** ve diğer büyük komutanlar.

6. **Ses Efektleri (Web Audio API):**
   - Tank topu gümbürtüsü, makineli tüfek serileri, hava saldırısı sireni, fetih trompeti ve zafer marşı tamamen entegredir.

