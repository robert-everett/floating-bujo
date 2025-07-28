# Build Instructions

Build the Floating Bujo Windows executable from source.

## Prerequisites

- Node.js 18+ installed
- Git installed
- Windows 10/11

## Build Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/robert-everett/floating-bujo.git
   cd floating-bujo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the executable:**
   ```bash
   npm run package:zip
   ```

4. **Find your executable:**
   - Location: `releases/floating-bujo-win32-x64.tar.gz`
   - Extract the archive to get `Floating Bujo.exe`

## Development

- **Run in development mode:** `npm start`
- **Run tests:** `npm test`
- **Clean workspace:** Use `/clean-workspace` command in Claude Code

## Troubleshooting

- **Build fails:** Delete `node_modules` and run `npm install` again
- **Executable won't start:** Check Windows Defender/antivirus settings
- **Setup wizard issues:** Delete local config and restart application

## File Sizes

- Uncompressed: ~294MB
- Compressed archive: ~119MB
- Contains full Electron runtime and Chromium engine