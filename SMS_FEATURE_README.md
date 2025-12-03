# SMS Management Feature - Hook & Hunt ERP

## Overview

The SMS Management feature integrates Alpha SMS API directly into the Hook & Hunt admin panel, allowing authorized users to send and manage SMS messages without visiting the vendor's website.

## Access Control

**Roles with Access:**
- `super_admin`
- `admin`
- `store_keeper` (Senior Staff)
- `marketer`

## Features

### 1. Send SMS
- Send SMS to single or multiple recipients
- Support for custom Sender ID (if approved by Alpha SMS)
- Phone number validation and formatting
- Character counter (max 1000 characters)
- Add/remove recipients dynamically

### 2. SMS History
- View all sent SMS messages
- Filter by status (sent, pending, failed, complete)
- Search by message content or phone number
- View delivery reports for individual SMS
- Bulk refresh delivery reports for pending SMS
- See SMS cost and sender information

### 3. Account Balance
- Real-time Alpha SMS account balance display
- Refresh balance on demand

### 4. Statistics Dashboard
- Total SMS sent
- Total failed SMS
- SMS sent this month
- Total cost tracking
- Monthly cost tracking

## Backend Implementation

### Database Schema

**Table: `sms_logs`**
```sql
- id: Primary key
- user_id: Foreign key to users table
- request_id: Alpha SMS request ID
- message: SMS content
- recipients: Comma-separated phone numbers
- sender_id: Custom sender ID (optional)
- status: pending, sent, failed, complete
- charge: SMS cost
- scheduled_at: For scheduled SMS (future feature)
- response_data: Full API response (JSON)
- delivery_report: Delivery status details (JSON)
- created_at, updated_at
```

### API Endpoints

**Base URL:** `/api/v1/admin/sms`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get SMS logs (paginated) | Required |
| POST | `/send` | Send new SMS | Required |
| GET | `/balance` | Get account balance | Required |
| GET | `/statistics` | Get SMS statistics | Required |
| GET | `/{id}/report` | Get delivery report | Required |
| POST | `/refresh-reports` | Refresh all pending reports | Required |

### Send SMS Request Format

```json
{
  "message": "Your message here",
  "recipients": [
    "01712345678",
    "8801887654321"
  ],
  "sender_id": "YourSenderID",  // Optional
  "schedule": "2025-12-03 08:14:13"  // Optional
}
```

### Phone Number Formats Supported

- `01XXXXXXXXX` (converted to `8801XXXXXXXXX`)
- `8801XXXXXXXXX` (kept as is)
- `+8801XXXXXXXXX` (converted to `8801XXXXXXXXX`)

## Frontend Implementation

### Navigation

SMS feature is accessible via the sidebar menu under "SMS" with MessageSquare icon.

### UI Components

1. **Statistics Cards**: Display key metrics at a glance
2. **Balance Card**: Shows current Alpha SMS balance
3. **Send SMS Tab**: Form to compose and send new SMS
4. **History Tab**: Table view of all sent SMS with filters

### State Management

Uses Zustand store (`smsStore.ts`) for:
- SMS logs management
- Loading states
- Error handling
- Balance tracking
- Statistics caching

## Configuration

### Backend Setup

1. Add to `.env`:
```env
ALPHA_SMS_API_KEY=your_api_key_here
```

2. Run migration:
```bash
php artisan migrate
```

### Frontend Setup

No additional configuration needed. The feature uses the existing API client setup.

## Alpha SMS API Integration

### Service Class: `AlphaSmsService`

Located at: `app/Services/AlphaSmsService.php`

**Methods:**
- `sendSms()`: Send SMS to recipients
- `getDeliveryReport()`: Get delivery status
- `getBalance()`: Check account balance
- `validatePhoneNumber()`: Format phone numbers

### Error Handling

The service logs all API interactions and handles:
- Network errors
- API errors (insufficient balance, invalid sender ID, etc.)
- Validation errors
- Timeout errors

## Usage Examples

### Sending SMS from Admin Panel

1. Navigate to Dashboard → SMS
2. Click "Send SMS" tab
3. Enter your message (max 1000 chars)
4. Add recipient phone numbers
5. (Optional) Add approved Sender ID
6. Click "Send SMS"

### Checking Delivery Status

1. Go to "History" tab
2. Find your SMS in the list
3. Click "Report" button
4. Delivery status will be updated

### Bulk Refresh Reports

Click "Refresh Reports" button in History tab to update all pending/sent SMS delivery statuses.

## Security Features

- Role-based access control
- API key stored securely in environment variables
- SQL injection protection via Eloquent ORM
- XSS protection on all inputs
- CSRF protection on all forms
- Authorization checks on all endpoints

## Performance Considerations

- Paginated SMS logs (20 per page)
- Lazy loading of delivery reports
- Cached statistics
- Debounced search queries
- Optimized database queries with indexes

## Error Codes Reference

Common Alpha SMS error codes:
- `0`: Success
- `400`: Missing or invalid parameter
- `403`: Permission denied
- `405`: Authorization required
- `410`: Account expired
- `413`: Invalid Sender ID
- `414`: Message is empty
- `417`: Insufficient balance

## Future Enhancements

- [ ] Scheduled SMS sending
- [ ] SMS templates
- [ ] Bulk SMS via CSV upload
- [ ] SMS analytics dashboard
- [ ] Customer group targeting
- [ ] Automated SMS triggers (order confirmation, shipping updates)
- [ ] SMS campaigns management

## Testing

### Manual Testing Checklist

- [ ] Send SMS to single recipient
- [ ] Send SMS to multiple recipients
- [ ] Verify phone number formatting
- [ ] Check balance display
- [ ] Filter SMS history by status
- [ ] Search SMS history
- [ ] View delivery report
- [ ] Refresh all reports
- [ ] Check statistics accuracy
- [ ] Test error handling (invalid API key, insufficient balance)

## Support

For Alpha SMS API issues:
- Website: https://sms.net.bd/
- API Documentation: Available in `/ins/sms.txt`

For Hook & Hunt ERP issues:
- Contact development team
- Check Laravel logs: `storage/logs/laravel.log`
- Check browser console for frontend errors

## License

This feature is part of the Hook & Hunt ERP system.
