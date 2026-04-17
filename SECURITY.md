# Security Configuration Guide

## Environment Variables Required

### Core Application
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/savdobot"

# AI Integration
DEEPSEEK_API_KEY="your_deepseek_api_key"

# Web Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY="your_vapid_public_key"
VAPID_PUBLIC_KEY="your_vapid_public_key"
VAPID_PRIVATE_KEY="your_vapid_private_key"
WEB_PUSH_SUBJECT="mailto:your-email@example.com"

# Reminder System Security
REMINDER_DISPATCH_SECRET="strong_random_string_for_cron_authorization"

# API Security (NEW)
API_TOKEN="strong_random_api_token_for_internal_communication"

# Logging Configuration
LOG_LEVEL="info" # debug, info, warn, error

# Environment
NODE_ENV="production" # or "development"
```

## Security Improvements Implemented

### 1. API Security
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Headers**: Proper cross-origin resource sharing
- **Input Validation**: Zod schemas for all API endpoints
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.

### 2. Database Security
- **Indexed Queries**: Optimized to prevent slow-query attacks
- **Field Constraints**: Proper VARCHAR limits and NOT NULL constraints
- **Connection Security**: Use SSL in production DATABASE_URL

### 3. Authentication
- **API Token**: Required for protected endpoints
- **Bearer Token**: Standard JWT-like authentication
- **Cron Security**: Secret required for reminder dispatch

### 4. Error Handling
- **Structured Logging**: No sensitive data in logs
- **Error Boundaries**: Graceful error handling in React
- **Safe Error Messages**: No stack traces in production

## Security Headers Added

All API responses now include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## Rate Limiting Configuration

### Default Limits
- **General API**: 100 requests/15 minutes
- **Auth endpoints**: 10 requests/15 minutes (recommended)
- **Heavy operations**: 20 requests/15 minutes (recommended)

### Rate Limit Headers
Responses include:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in window
- `X-RateLimit-Reset`: Window reset timestamp
- `Retry-After`: Seconds to wait when rate limited

## Input Validation

### Zod Schemas
All API endpoints use strict validation:
- **Sales/Expenses**: Positive amounts, required descriptions
- **Clients**: Name length limits, phone format validation
- **Debts**: Direction validation, amount positivity
- **Reminders**: DateTime validation, text length limits

### Validation Examples
```typescript
// Sale validation
{
  amount: number, // must be positive
  description: string, // 1-255 characters
}

// Client validation
{
  name: string, // 1-100 characters
  phone?: string, // optional, regex validation
}
```

## Production Security Checklist

### Before Deployment
- [ ] Generate strong API_TOKEN (32+ characters)
- [ ] Generate strong REMINDER_DISPATCH_SECRET
- [ ] Set LOG_LEVEL to "info" or "error"
- [ ] Enable DATABASE_URL with SSL
- [ ] Configure proper CORS origins
- [ ] Set up monitoring for rate limits

### Database Security
- [ ] Use connection pooling
- [ ] Enable SSL connections
- [ ] Set proper user permissions
- [ ] Regular backups configured
- [ ] Migration testing completed

### Monitoring
- [ ] Error tracking (Sentry recommended)
- [ ] Performance monitoring
- [ ] Rate limit monitoring
- [ ] Database query monitoring
- [ ] Security incident logging

## Recommended Security Tools

### Production Monitoring
- **Sentry**: Error tracking and performance
- **DataDog**: Application performance monitoring
- **Cloudflare**: DDoS protection and rate limiting
- **Vercel Analytics**: Performance metrics

### Development Tools
- **ESLint Security Plugin**: `npm install eslint-plugin-security`
- **TypeScript Strict Mode**: Already enabled
- **OWASP ZAP**: Security testing
- **Burp Suite**: API security testing

## Security Best Practices

### Code Security
1. **Never commit** `.env` files or secrets
2. **Use environment variables** for all configuration
3. **Validate all inputs** at API boundaries
4. **Implement proper error handling** without information leakage
5. **Use HTTPS** in all environments

### Database Security
1. **Principle of least privilege** for database users
2. **Parameterized queries** (handled by Prisma)
3. **Regular security updates** for PostgreSQL
4. **Audit logs** for sensitive operations
5. **Backup encryption** in production

### API Security
1. **Rate limiting** on all endpoints
2. **Input sanitization** and validation
3. **Proper HTTP status codes**
4. **Security headers** on all responses
5. **API versioning** for future changes

## Incident Response

### Security Incident Steps
1. **Identify** the scope and impact
2. **Contain** by blocking IPs or rotating keys
3. **Investigate** logs and audit trails
4. **Communicate** with stakeholders
5. **Remediate** vulnerabilities
6. **Review** and improve processes

### Emergency Contacts
- **Database Admin**: For immediate database issues
- **Security Team**: For security incidents
- **DevOps Team**: For infrastructure issues
