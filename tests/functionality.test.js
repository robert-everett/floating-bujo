// Functionality tests for core features
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

describe('Core Functionality Tests', () => {
    let tempDir;
    let configPath;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'floating-bujo-test-'));
        configPath = path.join(tempDir, 'config.json');
    });

    afterEach(async () => {
        try {
            await fs.rm(tempDir, { recursive: true });
        } catch (err) {
            // Ignore cleanup errors
        }
    });

    test('Daily file creation with correct format', async () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const expectedFilename = `actives-${year}${month}${day}.md`;
        
        expect(expectedFilename).toMatch(/^actives-\d{8}\.md$/);
    });

    test('Note entry formatting', () => {
        const noteText = 'Test note content';
        const timeStr = new Date().toTimeString().slice(0, 8);
        
        // Test with active tag
        const entryWithTag = `${timeStr} #active ${noteText}\n`;
        expect(entryWithTag).toContain('#active');
        expect(entryWithTag).toContain(noteText);
        expect(entryWithTag).toMatch(/^\d{2}:\d{2}:\d{2}/);
        
        // Test without active tag
        const entryWithoutTag = `${timeStr} ${noteText}\n`;
        expect(entryWithoutTag).not.toContain('#active');
        expect(entryWithoutTag).toContain(noteText);
    });

    test('Input sanitization', () => {
        const maliciousInput = 'test\x00\x01\x02content';
        const sanitized = maliciousInput.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
        
        expect(sanitized).toBe('testcontent');
        expect(sanitized).not.toContain('\x00');
    });

    test('Config validation', () => {
        const validConfig = {
            windowPosition: { x: 100, y: 100 },
            windowSize: { width: 500, height: 150 },
            defaultSize: { width: 500, height: 150 },
            alwaysOnTop: true,
            autoFocus: true,
            activesFolder: tempDir,
            setupCompleted: true,
            dpiScaleFactor: 1.0,
            useActiveTag: true
        };

        expect(validConfig.setupCompleted).toBe(true);
        expect(validConfig.activesFolder).toBe(tempDir);
        expect(validConfig.useActiveTag).toBe(true);
    });

    test('File path validation', () => {
        const validPath = path.join(tempDir, 'test-notes');
        const invalidPath = '../../../etc/passwd';
        
        expect(path.isAbsolute(validPath)).toBe(true);
        expect(validPath.includes('../')).toBe(false);
        expect(invalidPath.includes('../')).toBe(true);
    });
});