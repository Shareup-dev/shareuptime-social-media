# ShareUpTime Mobile App

React Native tabanlı ShareUpTime mobil uygulaması. Bu proje, backend API ile bütünleşik çalışır ve modern UI/UX bileşenleri ile ekranları içerir.

## Gereksinimler

- Node.js >= 18
- npm >= 8
- Android/iOS geliştirme ortamı (Android Studio / Xcode)

## Komutlar

- `npm start` - Metro bundler başlatır
- `npm run android` - Android emülatör/cihazda çalıştırır
- `npm run ios` - iOS simülatörde çalıştırır (macOS)
- `npm run pod-install` - iOS bağımlılıklarını kurar
- `npm run type-check` - TypeScript tip kontrolü

## Yapı

```text
app/
  components/
    headers/
    forms/
    common/
  navigation/
  screens/
  assets/
    emoji/
    feelings/
    images/
  backendless/    # API/WS yardımcıları
  config/         # API tabanı ve tema
```

## Ortam Değişkenleri

`.env` dosyasını repository'e dahil etmeyin. Örnek:

```env
API_BASE_URL=http://localhost:4000/api
WS_BASE_URL=http://localhost:4000
```

## Notlar

- `android/app/debug.keystore` ve `.env` dosyaları .gitignore ile hariçtir.
- `HeaderWithBackArrow` için `.d.ts` tip deklarasyonu eklenmiştir.
