// Email servisi - gelecekte genişletilebilir
export class EmailService {
  static async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    // TODO: Gerçek email servisi entegrasyonu (SendGrid, Nodemailer, etc.)
    console.log(`[EMAIL] Şifre sıfırlama emaili gönderildi: ${email} - Token: ${resetToken}`);
    return true;
  }

  static async sendWelcomeEmail(email: string, username: string): Promise<boolean> {
    // TODO: Hoş geldin emaili
    console.log(`[EMAIL] Hoş geldin emaili gönderildi: ${email} - Kullanıcı: ${username}`);
    return true;
  }

  static async sendVerificationEmail(email: string, verificationToken: string): Promise<boolean> {
    // TODO: Email doğrulama
    console.log(`[EMAIL] Doğrulama emaili gönderildi: ${email} - Token: ${verificationToken}`);
    return true;
  }
}