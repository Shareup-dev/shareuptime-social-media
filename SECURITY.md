# Security Policy

## Supported Versions

We support security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| 1.x.x   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in ShareUpTime, please report it responsibly:

### Reporting Process

1. **Do NOT create a public GitHub issue**
2. **Email us privately**: `security@shareuptime.com`
3. **Include detailed information**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Your contact information

### Response Timeline

- **Initial Response**: Within 24 hours
- **Status Update**: Within 72 hours
- **Resolution**: Within 30 days (depending on severity)

### What to Expect

- We will acknowledge receipt of your report
- We will investigate and validate the issue
- We will work on a fix and coordinate disclosure
- We will credit you for responsible disclosure (if desired)

## Security Measures

### Backend Security

- JWT token authentication
- Input validation and sanitization
- SQL injection prevention
- Rate limiting
- CORS configuration
- Environment variable protection

### Mobile Security

- Secure API communication (HTTPS)
- Token storage best practices
- Input validation
- Secure file uploads
- Certificate pinning (planned)

### Infrastructure Security

- Database access controls
- Network security
- Regular dependency updates
- Monitoring and logging

## Best Practices for Contributors

- Never commit secrets or passwords
- Use environment variables for configuration
- Validate all user inputs
- Follow OWASP guidelines
- Keep dependencies updated

## Contact

For security-related questions or concerns:

- **Security Team**: `security@shareuptime.com`
- **General Contact**: `shareuptimex@gmail.com`

We appreciate your help in keeping ShareUpTime secure! 🔒