# ShareUpTime Backend

Bu klasör, ShareUpTime sosyal medya platformunun Node.js (Express.js, TypeScript) tabanlı backend API'sini içerir.

## Başlangıç

1. Gerekli bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
2. Geliştirme modunda başlatmak için:
   ```bash
   npm run dev
   ```
3. Derleyip başlatmak için:
   ```bash
   npm run build
   npm start
   ```

## Özellikler
- PostgreSQL, MongoDB, Redis, Neo4j ve Elasticsearch ile bağlantı
- Kullanıcı yönetimi, gönderiler, arkadaşlıklar ve arama için RESTful API
- Modern TypeScript kod yapısı

## Yapı
- `src/` — Tüm kaynak kodları
- `dist/` — Derlenmiş JavaScript dosyaları

## Ortam Değişkenleri
`.env` dosyası ile servis bağlantı bilgilerini yönetin.
