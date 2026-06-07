# Security Policy

## Supported versions

`react-native-fabric-rich-text` follows [semantic versioning](https://semver.org/).
Security fixes are released against the latest published version, so please
upgrade to the most recent release before reporting an issue.

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a vulnerability

Please **do not** open a public issue, pull request, or discussion for security
problems — that discloses the vulnerability before a fix is available.

Instead, use GitHub's private vulnerability reporting:

1. Go to the [**Security** tab](https://github.com/mobile-delight/react-native-fabric-rich-text/security)
   of this repository.
2. Click **Report a vulnerability**.
3. Describe the issue, the affected versions, and the steps to reproduce it.

If you're unable to use private reporting, you can contact the maintainer
privately through their [GitHub profile](https://github.com/krnl-panic).

## What to expect

- We'll acknowledge your report as soon as we can.
- We'll investigate, confirm the issue, and keep you updated on remediation.
- Once a fix is released, we'll credit you in the release notes unless you'd
  prefer to remain anonymous.

Because this library renders untrusted HTML, reports about the sanitization
layer (`sanitize-html` configuration), markup parsing, or any input that could
lead to unexpected rendering or code execution are especially appreciated.
