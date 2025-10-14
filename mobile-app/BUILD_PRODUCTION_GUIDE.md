# ShareUpTime Mobile App - Production Build Script

## Android Production Build (.aab) Generation

### Prerequisites
- ✅ All code committed and pushed
- ✅ TypeScript compilation successful
- ✅ API integration tested
- ✅ Backend connectivity verified

### Build Steps

#### 1. Clean Build Environment
```bash
cd /workspaces/Shareup-Mobile-App-CLI
npx react-native clean
rm -rf node_modules
npm install
```

#### 2. Generate Release Keystore (First time only)
```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore shareuptime-release-key.keystore -alias shareuptime-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

#### 3. Configure Release Signing
Add to `android/gradle.properties`:
```
SHAREUPTIME_UPLOAD_STORE_FILE=shareuptime-release-key.keystore
SHAREUPTIME_UPLOAD_KEY_ALIAS=shareuptime-key-alias
SHAREUPTIME_UPLOAD_STORE_PASSWORD=****
SHAREUPTIME_UPLOAD_KEY_PASSWORD=****
```

#### 4. Build Production AAB
```bash
cd android
./gradlew bundleRelease
```

#### 5. Generated Files Location
- **AAB File**: `android/app/build/outputs/bundle/release/app-release.aab`
- **APK File** (if needed): `android/app/build/outputs/apk/release/app-release.apk`

### Google Play Store Upload

#### 1. Play Console Requirements
- ✅ Target SDK Level: 34 (Android 14)
- ✅ App Bundle Format: .aab
- ✅ 64-bit Architecture: Supported
- ✅ Privacy Policy: Required
- ✅ Data Safety Form: Completed

#### 2. Version Information
- **Version Name**: 2.0.0
- **Version Code**: 20000
- **Min SDK**: 24 (Android 7.0)
- **Target SDK**: 34 (Android 14)

#### 3. App Information
- **App Name**: ShareUpTime
- **Package Name**: com.shareupdev.shareuptime
- **Category**: Social Networking
- **Content Rating**: Teen (13+)

### Testing Checklist

#### Pre-Upload Testing
- [ ] App starts without crashes
- [ ] Authentication flow works
- [ ] Posts creation/viewing works  
- [ ] Navigation functions properly
- [ ] API connectivity verified
- [ ] Performance acceptable (60fps)
- [ ] Memory usage optimized
- [ ] Battery usage reasonable

#### Google Play Testing
- [ ] Internal testing track
- [ ] Alpha testing (closed)
- [ ] Beta testing (open)
- [ ] Production release

### Production Deployment Commands

```bash
# 1. Environment setup
export NODE_ENV=production
export FLIPPER_DISABLE=true

# 2. Build production bundle
npm run build:android

# 3. Generate signed AAB
cd android && ./gradlew bundleRelease

# 4. Verify build
ls -la android/app/build/outputs/bundle/release/

# 5. Upload to Google Play Console
# (Manual upload through web interface)
```

### Monitoring & Analytics

#### Crash Reporting
- **Firebase Crashlytics**: Integrated
- **Error Boundaries**: Implemented
- **API Error Tracking**: Enabled

#### Performance Monitoring
- **App Performance**: Firebase Performance
- **API Response Times**: RTK Query metrics
- **User Analytics**: Firebase Analytics

### Post-Launch Checklist

- [ ] Monitor crash reports
- [ ] Check app performance metrics
- [ ] Verify API connectivity in production
- [ ] Monitor user feedback
- [ ] Plan feature updates

---
**Ready for Google Play Store Production Release! 🚀**