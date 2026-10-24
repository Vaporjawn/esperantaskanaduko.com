# Security Policy

## Supported Versions

We actively support the following versions of Esperanto Hangman:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Esperanto Hangman seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to:
- **Email**: victor.williams.dev@gmail.com
- **Subject**: [SECURITY] Esperanto Hangman Vulnerability Report

### What to Include

Please include the following information in your report:

1. **Description**: A clear description of the vulnerability
2. **Impact**: The potential impact of the vulnerability
3. **Steps to Reproduce**: Detailed steps to reproduce the issue
4. **Proof of Concept**: If possible, include a proof of concept
5. **Suggested Fix**: If you have suggestions for fixing the issue

### Response Timeline

- We will acknowledge receipt of your vulnerability report within **48 hours**
- We will provide a more detailed response within **7 days** indicating the next steps
- We will keep you informed of the progress towards a fix
- We will notify you when the vulnerability is fixed

### Disclosure Policy

- We request that you do not publicly disclose the vulnerability until we have had a chance to address it
- Once the vulnerability is fixed, we will publish a security advisory
- We will give credit to the reporter (unless they prefer to remain anonymous)

## Security Best Practices for Users

Since this is a client-side only application:

1. **No Sensitive Data**: This game does not collect or transmit any personal data
2. **LocalStorage Only**: All data is stored locally in your browser
3. **Open Source**: The entire codebase is available for review on GitHub
4. **No Backend**: There is no backend server; all game logic runs in your browser
5. **Regular Updates**: Keep your browser updated for the latest security patches

## Known Security Considerations

This application:
- Does not use cookies
- Does not collect personal information
- Does not make external API calls
- Uses only localStorage for game statistics
- Is entirely client-side (no server-side processing)

## Security Update Process

When security updates are released:

1. A new version is tagged and released on GitHub
2. The application is automatically redeployed to GitHub Pages and Surge
3. A security advisory is published if the vulnerability is significant
4. Users are notified through the README and release notes

## Contact

For non-security issues, please open a regular GitHub issue.

For security concerns, email: victor.williams.dev@gmail.com
