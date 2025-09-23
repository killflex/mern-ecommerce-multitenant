# Email Verification & PDF Invoice Feature

## Fitur yang Diimplementasikan

### 1. Email Verification

- **Registrasi dengan Verifikasi Email**: Setelah user mendaftar, mereka akan menerima email verifikasi
- **Login Diblokir**: User tidak bisa login sebelum email diverifikasi
- **Resend Verification**: User bisa meminta ulang email verifikasi
- **Token Expiry**: Token verifikasi berlaku selama 24 jam

### 2. PDF Invoice Generation

- **Auto-send Invoice**: PDF invoice otomatis dikirim ke email customer setelah pembayaran berhasil
- **Download Invoice**: User bisa download invoice dari halaman order
- **Professional Design**: Invoice dengan design yang profesional dan lengkap

## Setup Environment Variables

Tambahkan variabel berikut ke file `.env`:

```env
# Email Configuration (Sistem untuk mengirim email)
EMAIL_USER=your-system-email@gmail.com    # Email sistem yang mengirim email ke users
EMAIL_PASS=your-app-password               # App password untuk email sistem
FRONTEND_URL=http://localhost:5173

# PayPal Configuration
PAYPAL_CLIENT_ID=your-paypal-client-id
```

### Penjelasan Email Configuration:

- **EMAIL_USER**: Email akun yang digunakan sistem untuk MENGIRIM email ke users
- **EMAIL_PASS**: App password untuk email sistem tersebut
- Email ini akan muncul sebagai pengirim di inbox user
- Berbeda dengan email user yang input saat registrasi (sebagai penerima)

### Cara Setup Gmail App Password:

1. Buka Google Account Settings
2. Pilih Security → 2-Step Verification
3. Pilih App passwords
4. Generate password untuk "Mail"
5. Gunakan password tersebut sebagai `EMAIL_PASS`

**Catatan**: Email yang Anda setup di sini adalah email SISTEM yang akan mengirim email ke users. Bukan email user yang registrasi.

## Perbedaan EMAIL_USER vs User Registration Email

### EMAIL_USER (Environment Variable):

- ✅ Email **sistem/server** untuk mengirim email
- ✅ Muncul sebagai "pengirim" di inbox user
- ✅ Contoh: `support@mystore.com`, `noreply@mycompany.com`
- ✅ Hanya 1 email untuk seluruh sistem

### User Registration Email:

- ✅ Email **user/customer** yang input saat registrasi
- ✅ Sebagai "penerima" email verification dan invoice
- ✅ Contoh: `customer1@gmail.com`, `user123@yahoo.com`
- ✅ Setiap user punya email berbeda

### Contoh Flow Email:

```
User mendaftar dengan: customer@gmail.com
↓
Sistem kirim email DARI: support@mystore.com (EMAIL_USER)
                    KE: customer@gmail.com (user email)
↓
User terima email di inbox customer@gmail.com
```

## API Endpoints Baru

### User Authentication

- `POST /api/users` - Register user (sends verification email)
- `GET /api/users/verify-email/:token` - Verify email
- `POST /api/users/resend-verification` - Resend verification email

### Orders

- `GET /api/orders/:id/invoice` - Download PDF invoice

## Frontend Routes Baru

- `/verify-email/:token` - Email verification page
- `/resend-verification` - Resend verification email page

## User Flow

### Registration Process:

1. User mengisi form registrasi
2. System mengirim email verifikasi
3. User click link di email untuk verifikasi
4. User bisa login setelah email diverifikasi

### Order & Invoice Process:

1. User melakukan pemesanan
2. User melakukan pembayaran via PayPal
3. System otomatis generate PDF invoice
4. PDF invoice dikirim ke email user
5. User bisa download invoice dari halaman order

## Dependencies Baru

### Backend:

- `nodemailer` - Untuk mengirim email
- `puppeteer` - Untuk generate PDF
- `crypto` - Untuk generate token (built-in Node.js)

### Frontend:

- Route baru untuk email verification

## Database Changes

### User Model:

- `isEmailVerified` (Boolean) - Status verifikasi email
- `emailVerificationToken` (String) - Token verifikasi
- `emailVerificationExpires` (Date) - Tanggal kadaluarsa token

## Security Features

1. **Token Expiry**: Token verifikasi email berlaku 24 jam
2. **Secure PDF Generation**: PDF hanya bisa diakses oleh user yang memiliki order
3. **Email Validation**: Validasi format email yang proper
4. **Error Handling**: Proper error handling untuk email service

## Testing

### Email Verification:

1. Register user baru
2. Check email inbox untuk verification link
3. Click verification link
4. Coba login dengan akun yang sudah diverifikasi

### PDF Invoice:

1. Buat order dan lakukan pembayaran
2. Check email untuk PDF invoice
3. Test download invoice dari halaman order

## Production Considerations

1. **Email Service**: Gunakan professional email service (SendGrid, AWS SES) untuk production
2. **PDF Storage**: Consider storing PDFs untuk performa yang lebih baik
3. **Rate Limiting**: Implementasi rate limiting untuk prevent spam
4. **Error Monitoring**: Monitor email delivery failures
5. **Backup Email Service**: Fallback email service jika primary service down

## Troubleshooting

### Email Not Sending:

- Pastikan Gmail App Password sudah benar
- Check spam folder
- Verify environment variables

### PDF Generation Issues:

- Pastikan Puppeteer terinstall dengan benar
- Check Chrome/Chromium dependencies di server
- Monitor memory usage untuk PDF generation

### Frontend Issues:

- Pastikan routes sudah didefinisikan dengan benar
- Check React Router configuration
- Verify API endpoints accessibility

## Future Enhancements

1. **Email Templates**: Lebih banyak template email yang customizable
2. **Multi-language Support**: Support untuk berbagai bahasa
3. **PDF Customization**: Allow users customize invoice template
4. **Email Preferences**: User bisa setting preferensi email notifications
5. **Invoice History**: History semua invoice yang pernah dikirim
