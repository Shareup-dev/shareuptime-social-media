#!/bin/bash
# Script to update test expectations to match Turkish messages

cd /workspaces/shareuptime-social-media/backend

# Update userController test messages
sed -i 's/Username, email, password, first_name, and last_name are required/Kullanıcı adı, email ve şifre gereklidir/g' tests/controllers/userController.test.ts
sed -i 's/Invalid email format/Geçersiz email formatı/g' tests/controllers/userController.test.ts
sed -i 's/Username must be 3-20 characters and contain only letters, numbers, and underscores/Kullanıcı adı 3-20 karakter arası olmalı ve sadece harf, rakam ve _ içerebilir/g' tests/controllers/userController.test.ts
sed -i 's/Password must be at least 8 characters long/Şifre en az 6 karakter olmalıdır/g' tests/controllers/userController.test.ts
sed -i 's/Email or username already exists/Bu email veya kullanıcı adı zaten kullanılıyor/g' tests/controllers/userController.test.ts
sed -i 's/User registered successfully/Kullanıcı başarıyla oluşturuldu/g' tests/controllers/userController.test.ts
sed -i 's/Internal server error/Sunucu hatası/g' tests/controllers/userController.test.ts
sed -i 's/Invalid user ID/Kullanıcı ID gereklidir/g' tests/controllers/userController.test.ts
sed -i 's/User not found/Kullanıcı bulunamadı/g' tests/controllers/userController.test.ts
sed -i 's/User profile retrieved successfully/Kullanıcı profili getirildi/g' tests/controllers/userController.test.ts

# Update authController test messages
sed -i 's/Email and password are required/Email ve şifre gereklidir/g' tests/controllers/authController.test.ts
sed -i 's/Invalid credentials/Geçersiz email veya şifre/g' tests/controllers/authController.test.ts
sed -i 's/Login successful/Giriş başarılı/g' tests/controllers/authController.test.ts
sed -i 's/Access token required/Geçersiz token/g' tests/controllers/authController.test.ts
sed -i 's/Invalid token format/Geçersiz token/g' tests/controllers/authController.test.ts
sed -i 's/Invalid token/Geçersiz token/g' tests/controllers/authController.test.ts
sed -i 's/Token is valid/Token geçerli/g' tests/controllers/authController.test.ts

echo "Test messages updated!"