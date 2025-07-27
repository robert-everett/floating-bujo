# Security Validation Requirements

**Purpose:** Comprehensive testing to validate elimination of RCE vectors and security vulnerabilities  
**Scope:** Electron security configuration, IPC communication, input validation  
**Risk Level:** CRITICAL - Must pass all tests before production deployment

## RCE Vector Elimination Tests

### Test 1: Node.js Access Prevention
**Objective:** Verify renderer process cannot access Node.js APIs directly

**Test Cases:**
```javascript
// These should all FAIL (throw errors) in secure configuration:
window.require('fs')                    // Should be undefined
window.require('child_process')         // Should be undefined  
window.process                          // Should be undefined
window.Buffer                           // Should be undefined
eval('require("fs")')                   // Should throw error
new Function('return require("fs")')()  // Should throw error
```

**Expected Results:** All attempts should throw `ReferenceError` or `TypeError`

### Test 2: Context Isolation Verification
**Objective:** Verify renderer and main process contexts are properly isolated

**Test Cases:**
```javascript
// In renderer - these should be undefined:
window.electronAPI.require             // Should be undefined
window.electronAPI.__proto__.require   // Should be undefined
Object.getPrototypeOf(window.electronAPI).require // Should be undefined

// Prototype pollution attempts should fail:
window.electronAPI.__proto__.require = require  // Should not work
window.electronAPI.constructor.prototype.require = require // Should not work
```

**Expected Results:** No access to privileged APIs through prototype manipulation

### Test 3: IPC Security Validation
**Objective:** Verify only whitelisted IPC methods are exposed

**Test Cases:**
```javascript
// Only these should be available:
window.electronAPI.saveNote            // Should exist
window.electronAPI.hideWindow          // Should exist
window.electronAPI.undoLastNote        // Should exist
window.electronAPI.quitApp             // Should exist

// These should NOT be available:
window.electronAPI.executeCommand      // Should be undefined
window.electronAPI.readFile           // Should be undefined
window.electronAPI.writeFile          // Should be undefined
window.electronAPI.shell              // Should be undefined
```

**Expected Results:** Only explicitly exposed methods available

### Test 4: Malicious Input Injection Tests
**Objective:** Verify input sanitization prevents code execution

**Test Cases:**
```javascript
// Malicious note content that should be safely handled:
const maliciousInputs = [
    '<script>alert("XSS")</script>',
    '${require("child_process").exec("calc")}',
    '`${require("fs").readFileSync("/etc/passwd")}`',
    'eval("require(\\"child_process\\").exec(\\"notepad\\")")',
    '{{constructor.constructor("return process")().exit()}}',
    '\x00\x01\x02\x03',  // Null bytes and control characters
    '../../../windows/system32/cmd.exe',
    'require("electron").shell.openExternal("http://evil.com")'
];
```

**Expected Results:** All inputs saved as plain text without execution

### Test 5: File System Security
**Objective:** Verify file operations are restricted to designated folders

**Test Cases:**
```javascript
// Path traversal attempts in note content:
const pathTraversalTests = [
    '../../../windows/system32/',
    '..\\..\\..\\windows\\system32\\',
    '%USERPROFILE%\\Desktop\\',
    '$HOME/.ssh/',
    '/etc/passwd',
    'C:\\Windows\\System32\\drivers\\etc\\hosts'
];
```

**Expected Results:** All paths normalized to actives folder, no system file access

## Security Configuration Validation

### Test 6: webPreferences Security Settings
**Objective:** Verify Electron security best practices are implemented

**Required Configuration:**
```javascript
webPreferences: {
    nodeIntegration: false,           // ✅ Required
    contextIsolation: true,           // ✅ Required
    enableRemoteModule: false,        // ✅ Required (or removed)
    sandbox: false,                   // ✅ Optional but recommended
    preload: path.join(__dirname, 'preload.js'), // ✅ Required for secure IPC
    webSecurity: true,                // ✅ Required (default)
    allowRunningInsecureContent: false, // ✅ Required (default)
    experimentalFeatures: false       // ✅ Required (default)
}
```

### Test 7: Preload Script Security
**Objective:** Verify preload script only exposes necessary APIs

**Requirements:**
- No direct Node.js API exposure
- Only whitelisted IPC methods
- Input validation on all exposed methods
- No eval() or Function() constructor access

## Automated Security Tests

### Test Script Template
```javascript
// security-tests.js
const { test, expect } = require('@playwright/test');

test.describe('Security Validation', () => {
    test('Node.js APIs should not be accessible', async ({ page }) => {
        await page.goto('file://' + path.join(__dirname, '../proof-of-concept/floating-notes.html'));
        
        const nodeAccess = await page.evaluate(() => {
            try {
                return {
                    require: typeof window.require,
                    process: typeof window.process,
                    Buffer: typeof window.Buffer,
                    global: typeof window.global
                };
            } catch (e) {
                return { error: e.message };
            }
        });
        
        expect(nodeAccess.require).toBe('undefined');
        expect(nodeAccess.process).toBe('undefined');
        expect(nodeAccess.Buffer).toBe('undefined');
        expect(nodeAccess.global).toBe('undefined');
    });
    
    test('Malicious input should not execute', async ({ page }) => {
        await page.goto('file://' + path.join(__dirname, '../proof-of-concept/floating-notes.html'));
        
        const maliciousCode = 'eval("alert(\\"RCE\\")");require("child_process").exec("calc")';
        
        await page.fill('#noteInput', maliciousCode);
        await page.press('#noteInput', 'Enter');
        
        // Should save as plain text, not execute
        const savedNote = await page.evaluate(() => {
            return document.querySelector('#noteInput').value;
        });
        
        expect(savedNote).toBe(''); // Input should be cleared after save
    });
});
```

## Manual Security Testing Checklist

### Pre-Fix Validation (Should FAIL)
- [ ] Can access `window.require('fs')`
- [ ] Can execute `eval('require("child_process").exec("calc")')`
- [ ] Can manipulate IPC through prototype pollution
- [ ] No input validation on note content

### Post-Fix Validation (Should PASS)
- [ ] Cannot access Node.js APIs from renderer
- [ ] Context isolation prevents prototype pollution
- [ ] Only whitelisted IPC methods available
- [ ] All user input properly sanitized
- [ ] File operations restricted to designated folders
- [ ] No XSS or code injection vectors

## Success Criteria

**All security tests must PASS before deployment:**
1. ✅ Zero Node.js API access from renderer
2. ✅ Context isolation fully functional
3. ✅ Secure preload script implementation
4. ✅ Input validation prevents all injection attacks
5. ✅ File system access properly restricted
6. ✅ No remaining RCE vectors identified

**Security validation is MANDATORY** - failure of any test blocks production deployment.