# Code Signing Guide

## Why "Publisher Unknown" Warning Appears

Windows shows a "Publisher Unknown" warning for installers that aren't digitally signed with a code signing certificate. This is a security feature to protect users from malicious software.

**Current Status:** The installer includes publisher information (Amber Joy) in its metadata, but without a digital signature, Windows cannot verify the publisher and shows the warning.

## Solutions

### Option 1: Accept the Warning (Current Setup)

**For users:**

- Click "More info" on the warning dialog
- Click "Run anyway"
- This is common for open-source software without code signing budgets

**What we've done:**

- Added comprehensive version information
- Included publisher name in metadata
- Added GitHub URL in comments
- Users can verify authenticity by checking file properties

### Option 2: Code Signing Certificate (Professional)

**Cost:** ~$100-400/year

**Benefits:**

- Removes "Publisher Unknown" warning completely
- Builds trust with users
- Professional appearance
- Required for some enterprise environments

**Certificate Providers:**

- [DigiCert](https://www.digecert.com/signing/code-signing-certificates)
- [Sectigo](https://sectigo.com/ssl-certificates-tls/code-signing)
- [SSL.com](https://www.ssl.com/code-signing/)
- [GlobalSign](https://www.globalsign.com/en/code-signing-certificate)

**Types of Certificates:**

1. **Standard Code Signing** (~$200/year)

   - Certificate file (.pfx)
   - Suitable for individuals and small teams

2. **EV Code Signing** (~$400/year)
   - Hardware token required (USB key)
   - Instant SmartScreen reputation (no warnings)
   - Recommended for frequent releases

### How to Sign the Installer

Once you have a certificate:

#### 1. Sign Locally (Windows)

```bash
# Using signtool (part of Windows SDK)
signtool sign /f "certificate.pfx" /p "password" /t http://timestamp.digicert.com /d "Witchy CLI Installer" "WitchyCLI-Setup-1.0.1.exe"
```

#### 2. Sign in GitHub Actions

Add to `.github/workflows/build-release.yml` after building Windows installer:

```yaml
- name: Sign Windows Installer
  if: env.CERTIFICATE_EXISTS == 'true'
  run: |
    # Decode certificate from GitHub secret
    echo "${{ secrets.WINDOWS_CERTIFICATE }}" | base64 --decode > certificate.pfx

    # Sign the installer
    signtool sign /f certificate.pfx /p "${{ secrets.CERTIFICATE_PASSWORD }}" /t http://timestamp.digicert.com /d "Witchy CLI Installer" dist/WitchyCLI-Setup-*.exe

    # Clean up certificate
    rm certificate.pfx
```

**Required GitHub Secrets:**

- `WINDOWS_CERTIFICATE` - Base64-encoded .pfx file
- `CERTIFICATE_PASSWORD` - Certificate password

#### 3. Verify Signature

```bash
# Check if file is signed
signtool verify /pa "WitchyCLI-Setup-1.0.1.exe"
```

### SmartScreen Reputation

Even with a code signing certificate, new applications may still show SmartScreen warnings until they build reputation:

- **Standard Cert:** Requires downloads and positive user interactions over weeks/months
- **EV Cert:** Instant reputation, no SmartScreen warnings

## Recommendation

**For Now:**

- Continue with current setup (unsigned)
- Clearly document installation steps in README
- Users can verify source code on GitHub

**For Future:**

- Consider code signing certificate when project grows
- EV certificate recommended if budget allows ($400/year)
- Builds trust and professionalism

## Alternative: Self-Signed Certificate (NOT Recommended)

You can create a self-signed certificate, but:

- ❌ Windows will still show warnings
- ❌ Users must manually install your root certificate
- ❌ More confusing than unsigned installer
- ❌ Not suitable for public distribution

## Current Installer Metadata

Our installer includes these verified details (viewable in Properties):

- Product Name: Witchy CLI
- Company: Amber Joy
- Description: Witchy CLI Installer - Magical Correspondence Lookup Tool
- Copyright: © 2025 Amber Joy
- Version: 1.0.1
- Comments: Open source magical correspondence tool. Visit github.com/the-amber-joy/witchy-cli

Users can verify this matches the GitHub repository to confirm authenticity.
