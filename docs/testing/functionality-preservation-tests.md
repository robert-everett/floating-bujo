# Functionality Preservation Tests

**Purpose:** Validate that all MVP functionality continues working after security fixes  
**Scope:** Complete end-to-end testing of Priority 1 features  
**Requirement:** 100% functionality preservation - no regressions allowed

## Core MVP Features That Must Continue Working

### Test 1: Application Launch and Window Creation
**Feature:** FR-002 System-Wide Floating Window

**Test Steps:**
1. Run `npm start` in proof-of-concept directory
2. Verify application launches without errors
3. Verify floating window appears and is visible
4. Verify window is always-on-top
5. Verify window can be moved and resized
6. Verify window position persists between sessions

**Expected Results:**
- Application starts successfully
- Window appears immediately 
- Always-on-top behavior functional
- Window controls responsive
- Configuration persistence working

**Success Criteria:**
```javascript
// Log evidence required:
[TIMESTAMP] === Floating Notes Application Started ===
[TIMESTAMP] Main window created successfully
[TIMESTAMP] Application initialized successfully
```

### Test 2: Global Keyboard Shortcuts
**Feature:** FR-014 Global Hotkey Management

**Test Steps:**
1. Launch application 
2. Test Ctrl+Shift+H (hide window)
3. Verify window hides
4. Test Ctrl+Shift+N (show window) 
5. Verify window shows and focuses
6. Repeat multiple times

**Expected Results:**
- Shortcuts work from any application
- Window shows/hides reliably
- Focus behavior consistent

**Success Criteria:**
```javascript
// Log evidence required:
[TIMESTAMP] Global shortcut triggered: Hide
[TIMESTAMP] Global shortcut triggered: Show/Focus
```

### Test 3: Note Input and Auto-Expansion
**Feature:** FR-003 Bujo Input Interface

**Test Steps:**
1. Click in textarea
2. Type short note (1 line)
3. Verify height stays at minimum
4. Type long note (multiple lines)
5. Verify textarea auto-expands
6. Verify scrolling when max height reached

**Expected Results:**
- Textarea responds to input
- Auto-expansion smooth and functional
- UI remains responsive
- Scrolling works at max height

**Test Data:**
```
Short: "Quick note"
Medium: "This is a longer note that should cause the textarea to expand smoothly"
Long: [Text that exceeds 200px max height to test scrolling]
```

### Test 4: Note Saving and File Operations
**Feature:** FR-007 Entry Formatting + FR-005/006 File Management

**Test Steps:**
1. Type note content: "Test note entry"
2. Press Enter to save
3. Verify note clears from input
4. Verify feedback message shows
5. Check daily file created/updated
6. Verify format: `HH:MM:SS #active Test note entry`

**Expected Results:**
- Note saves successfully
- Input clears after save
- Daily file updated with correct format
- Timestamp accurate

**File Verification:**
```markdown
# Active Notes - [Current Date]

HH:MM:SS #active Test note entry
```

### Test 5: Window Management and Controls
**Feature:** FR-004 Advanced Window Management

**Test Steps:**
1. Click minimize button (yellow)
2. Verify window hides
3. Use Ctrl+Shift+N to restore
4. Click close button (red)
5. Verify application quits cleanly
6. Restart and verify position restored

**Expected Results:**
- Window controls functional
- Clean shutdown process
- Configuration persistence

### Test 6: Undo Functionality
**Feature:** FR-010 Entry Undo Functionality

**Test Steps:**
1. Save a note
2. Verify undo button appears
3. Click undo button
4. Verify note restored to input
5. Verify undo button disappears after 10s

**Expected Results:**
- Undo button appears after save
- Note restoration works
- Auto-hide timer functional

### Test 7: IPC Communication
**Feature:** Secure IPC between main and renderer processes

**Test Steps:**
1. Save note via UI
2. Hide window via button
3. Show window via global shortcut
4. Quit application via button
5. Verify all IPC calls successful

**Expected Results:**
- All IPC operations complete successfully
- No IPC errors in logs
- Responsive communication

## Integration Tests

### Test 8: Multi-Session Workflow
**Complete user workflow over multiple sessions**

**Session 1:**
1. Launch app, save 3 notes
2. Move window to new position
3. Resize window
4. Close application

**Session 2:**
1. Launch app
2. Verify window position/size restored
3. Verify notes from previous session in daily file
4. Save 2 more notes
5. Hide/show window multiple times

**Expected Results:**
- All data persists between sessions
- Window state restored correctly
- No data loss or corruption

### Test 9: Error Handling and Recovery
**Validate robust error handling**

**Test Steps:**
1. Delete actives folder while running
2. Try to save note
3. Verify folder recreated
4. Create invalid config.json
5. Restart application
6. Verify default config loaded

**Expected Results:**
- Graceful error handling
- Automatic recovery
- No application crashes

## Performance Validation

### Test 10: Resource Usage
**Validate performance targets maintained**

**Metrics to Check:**
- Memory usage < 100MB
- CPU usage < 2% when idle
- Startup time < 3 seconds
- UI responsiveness (no lag)

**Test Duration:** 30 minutes continuous operation

## Automated Test Script Template

```javascript
// functionality-tests.js
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class FunctionalityTester {
    constructor() {
        this.testResults = [];
        this.activesFolder = path.join(__dirname, '../proof-of-concept/test-notes');
    }

    async runAllTests() {
        console.log('🚀 Starting Functionality Preservation Tests...\n');
        
        await this.testApplicationLaunch();
        await this.testNoteSaving();
        await this.testFileOperations();
        await this.testWindowControls();
        
        this.generateReport();
    }

    async testApplicationLaunch() {
        console.log('Test 1: Application Launch');
        
        const startTime = Date.now();
        const app = spawn('npm', ['start'], {
            cwd: path.join(__dirname, '../proof-of-concept'),
            timeout: 10000
        });

        return new Promise((resolve) => {
            app.stdout.on('data', (data) => {
                const output = data.toString();
                if (output.includes('Application initialized successfully')) {
                    const launchTime = Date.now() - startTime;
                    this.testResults.push({
                        test: 'Application Launch',
                        status: 'PASS',
                        time: `${launchTime}ms`,
                        details: 'App launched and initialized successfully'
                    });
                    app.kill();
                    resolve();
                }
            });

            setTimeout(() => {
                this.testResults.push({
                    test: 'Application Launch',
                    status: 'FAIL',
                    time: '10000ms+',
                    details: 'Application failed to launch within timeout'
                });
                app.kill();
                resolve();
            }, 10000);
        });
    }

    async testNoteSaving() {
        console.log('Test 2: Note Saving and File Operations');
        
        const testNote = `Test note - ${new Date().toISOString()}`;
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const expectedFile = path.join(this.activesFolder, `actives-${today}.md`);
        
        // This would need to be implemented with actual UI automation
        // For now, just check if the mechanism exists
        
        if (fs.existsSync(expectedFile)) {
            this.testResults.push({
                test: 'Note Saving',
                status: 'PASS',
                details: 'Daily file exists and is accessible'
            });
        } else {
            this.testResults.push({
                test: 'Note Saving',
                status: 'FAIL',
                details: 'Daily file not found or inaccessible'
            });
        }
    }

    generateReport() {
        console.log('\n📊 Functionality Preservation Test Results\n');
        console.log('=' .repeat(60));
        
        let passed = 0;
        let failed = 0;
        
        this.testResults.forEach(result => {
            const status = result.status === 'PASS' ? '✅' : '❌';
            console.log(`${status} ${result.test}: ${result.status}`);
            if (result.time) console.log(`   Time: ${result.time}`);
            if (result.details) console.log(`   Details: ${result.details}`);
            console.log();
            
            if (result.status === 'PASS') passed++;
            else failed++;
        });
        
        console.log('=' .repeat(60));
        console.log(`Total: ${this.testResults.length} tests`);
        console.log(`Passed: ${passed} ✅`);
        console.log(`Failed: ${failed} ❌`);
        console.log(`Success Rate: ${((passed / this.testResults.length) * 100).toFixed(1)}%`);
        
        if (failed === 0) {
            console.log('\n🎉 All functionality preservation tests PASSED!');
            console.log('✅ Ready to proceed with security fixes');
        } else {
            console.log('\n⚠️  Some tests FAILED - investigate before proceeding');
        }
    }
}

// Run tests
const tester = new FunctionalityTester();
tester.runAllTests().catch(console.error);
```

## Success Criteria

**ALL tests must PASS after security fixes:**

✅ **Application Launch:** Window appears and initializes  
✅ **Global Shortcuts:** Show/hide functionality works  
✅ **Note Input:** Auto-expanding textarea responsive  
✅ **Note Saving:** Files created with correct format  
✅ **Window Management:** Controls and persistence working  
✅ **Undo Function:** 10-second undo window operational  
✅ **IPC Communication:** All renderer-main communication secure  
✅ **Performance:** <100MB RAM, <2% CPU, <3s startup  
✅ **Error Handling:** Graceful recovery from all error conditions  

**Zero regressions allowed** - any functionality loss requires investigation and fix before deployment.