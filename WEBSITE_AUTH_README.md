# Website Authentication System - Complete Guide

## Overview

The Hook & Hunt website now has a fully functional authentication system with SMS OTP verification integrated with the Laravel API backend.

## Features Implemented

### ✅ Registration Flow
1. User enters phone number, password, and optional name
2. API validates and creates user account
3. **OTP sent via Alpha SMS** to user's phone number
4. User enters 6-digit OTP code
5. API verifies OTP and marks phone as verified
6. User receives auth token and is logged in
7. Redirects to account page

### ✅ Login Flow
1. User enters phone number and password
2. API validates credentials and phone verification status
3. Returns auth token
4. User is logged in and redirected to account page

### ✅ OTP Features
- **10-minute validity** period for OTP codes
- **Resend OTP** functionality with 60-second countdown
- **Auto-submit** when all 6 digits are entered
- **Paste support** for OTP codes
- **Development mode**: OTP code shown in API response for testing
- **Production mode**: OTP only sent via SMS (when APP_ENV=production)

## SMS Integration

### Alpha SMS Service
The system uses the Alpha SMS API to send OTP codes:

**Message Format:**
```
Your Hook & Hunt verification code is: 123456. Valid for 10 minutes. Do not share this code.
```

**API Response includes:**
- `sms_sent`: Boolean indicating if SMS was sent successfully
- `otp_code`: OTP code (only in development/local mode)

## API Endpoints

### Base URL
```
http://localhost:8000/api/v1/store
```

### 1. Register
```http
POST /auth/register

Body:
{
  "phone_number": "01712345678",
  "password": "password123",
  "name": "John Doe" (optional)
}

Response:
{
  "message": "Registration successful. Please verify your phone with OTP.",
  "phone_number": "01712345678",
  "sms_sent": true,
  "otp_code": "123456" // Only in development mode
}
```

### 2. Send/Resend OTP
```http
POST /auth/send-otp

Body:
{
  "phone_number": "01712345678"
}

Response:
{
  "message": "OTP sent successfully.",
  "sms_sent": true,
  "otp_code": "123456" // Only in development mode
}
```

### 3. Verify OTP
```http
POST /auth/verify-otp

Body:
{
  "phone_number": "01712345678",
  "otp_code": "123456"
}

Response:
{
  "message": "Phone verified successfully.",
  "token": "1|abc123...",
  "user": {
    "id": 1,
    "phone_number": "01712345678",
    "role": "retail_customer",
    ...
  }
}
```

### 4. Login
```http
POST /auth/login

Body:
{
  "phone_number": "01712345678",
  "password": "password123"
}

Response:
{
  "token": "2|xyz789...",
  "user": {
    "id": 1,
    "phone_number": "01712345678",
    "role": "retail_customer",
    ...
  }
}
```

### 5. Get Current User
```http
GET /account/me

Headers:
Authorization: Bearer {token}

Response:
{
  "user": {
    "id": 1,
    "phone_number": "01712345678",
    "role": "retail_customer",
    ...
  }
}
```

### 6. Logout
```http
POST /account/logout

Headers:
Authorization: Bearer {token}

Response:
{
  "message": "Logged out successfully."
}
```

## Frontend Components

### 1. API Client (`src/lib/api.ts`)
- Handles all API communication
- Automatic token management (localStorage)
- Error handling
- Auth header injection

### 2. Auth Context (`src/context/AuthContext.tsx`)
- Global authentication state
- User session management
- Auto-check auth on app load
- Provides: `user`, `isAuthenticated`, `login()`, `register()`, `verifyOtp()`, `logout()`

### 3. Registration Page (`src/app/registration/page.tsx`)
- Two-step process: Registration → OTP Verification
- Form validation
- Error handling
- Automatic OTP screen transition

### 4. OTP Verification Component (`src/components/OtpVerification.tsx`)
- 6-digit input with auto-focus
- Countdown timer (60 seconds)
- Resend functionality
- Paste support
- Beautiful UI

### 5. Login Page (`src/app/login/page.tsx`)
- Phone + password authentication
- Form validation
- Error messages
- Remember me option

## Configuration

### Backend (.env)
```env
ALPHA_SMS_API_KEY=your_alpha_sms_api_key_here
APP_ENV=local  # Set to 'production' to hide OTP in responses
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### CORS Configuration
The Laravel API allows requests from:
- `http://localhost:3000-3002` (Next.js website)
- `http://localhost:5173-5174` (React admin UI)

## Security Features

### Password Security
- Minimum 6 characters required
- Hashed using Laravel's bcrypt
- Password confirmation during registration

### OTP Security
- 6-digit random code
- 10-minute expiration
- Invalidated after successful verification
- Rate limiting on resend (60-second cooldown on frontend)

### Token Security
- Laravel Sanctum tokens
- Stored in localStorage
- Sent via Authorization header
- Automatically cleared on logout

### Phone Verification
- Must verify phone before login
- OTP required for first-time users
- Verified status stored in database

### Role-Based Access
- Users registered via website get `retail_customer` role
- Admin users blocked from website login (must use admin portal)

## Phone Number Format

**Accepted Formats:**
- `01712345678` (11 digits starting with 01)
- Regex: `/^01[3-9]\d{8}$/`

**Supported Operators:**
- Grameenphone (017)
- Banglalink (014, 019)
- Robi (018)
- Airtel (016)
- Teletalk (015)

## Development vs Production

### Development Mode (APP_ENV=local)
- OTP code returned in API response
- Easier testing without actual SMS
- Can see OTP in browser console

### Production Mode (APP_ENV=production)
- OTP code NOT returned in API response
- OTP only sent via SMS
- Enhanced security

## Testing the System

### 1. Start Laravel API
```bash
cd hooknhunt-api
php artisan serve
```

### 2. Start Next.js Website
```bash
cd website
npm run dev
```

### 3. Test Registration
1. Go to http://localhost:3002/registration
2. Enter phone: `01712345678`
3. Enter password: `password123`
4. Click "Create Account"
5. Check console or SMS for OTP code
6. Enter OTP
7. Should redirect to /account

### 4. Test Login
1. Go to http://localhost:3002/login
2. Enter same credentials
3. Click "Sign In"
4. Should redirect to /account

### 5. Test Session Persistence
1. After logging in, refresh the page
2. Should remain logged in
3. Check localStorage for `auth_token`

## Troubleshooting

### CORS Errors
- Ensure Laravel API is running
- Check `config/cors.php` includes website URL
- Run `php artisan config:clear`

### OTP Not Received
- Check Alpha SMS API key in `.env`
- Verify phone number format (01XXXXXXXXX)
- Check Alpha SMS balance
- In development, OTP shown in API response

### Token Not Working
- Check if token is stored in localStorage
- Verify Authorization header format: `Bearer {token}`
- Ensure user's phone is verified

### Login Failed - Account Not Verified
- User must verify OTP after registration
- Can resend OTP if expired
- Check `phone_verified_at` in database

## Database Schema

### Users Table Relevant Fields
```sql
phone_number VARCHAR(15) UNIQUE
password VARCHAR(255)
otp_code VARCHAR(6) NULLABLE
otp_expires_at TIMESTAMP NULLABLE
phone_verified_at TIMESTAMP NULLABLE
role ENUM(...) DEFAULT 'retail_customer'
```

## Future Enhancements

- [ ] Forgot password functionality
- [ ] Email verification (optional)
- [ ] Social login (Google, Facebook)
- [ ] Two-factor authentication
- [ ] Passwordless login (OTP-only)
- [ ] SMS rate limiting (backend)
- [ ] Captcha for spam prevention

## Support

For issues:
1. Check Laravel logs: `storage/logs/laravel.log`
2. Check browser console for frontend errors
3. Verify Alpha SMS balance and API key
4. Test API endpoints with Postman/Insomnia

## License

Part of Hook & Hunt ERP System
