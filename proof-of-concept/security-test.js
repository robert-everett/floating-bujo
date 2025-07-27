// security-test.js - Comprehensive Security and Functionality Validation
const fs = require('fs');
const path = require('path');

class SecurityFunctionalityValidator {
    constructor() {
        this.results = {
            security: [],
            functionality: [],
            overall: { passed: 0, failed: 0 }
        };
        this.logFile = path.join(__dirname, 'floating-notes.log');
        this.dailyFile = this.getDailyFileName();
    }

    getDailyFileName() {
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        return path.join(__dirname, 'test-notes', `actives-${today}.md`);
    }

    async runAllTests() {
        console.log('🔐 SECURITY & FUNCTIONALITY VALIDATION TESTS');
        console.log('=' .repeat(60));
        console.log('Testing secure Electron configuration and MVP functionality\n');

        // Security Tests
        await this.testSecurityConfiguration();
        await this.testApplicationLaunch();
        await this.testFileOperations();
        
        this.generateReport();
    }

    async testSecurityConfiguration() {
        console.log('🔍 Testing Security Configuration...\n');

        // Test 1: Verify secure webPreferences in main.js
        const mainJsContent = fs.readFileSync(path.join(__dirname, 'main.js'), 'utf8');
        
        this.addSecurityTest(
            'Node Integration Disabled',
            mainJsContent.includes('nodeIntegration: false'),
            'nodeIntegration should be false'
        );

        this.addSecurityTest(
            'Context Isolation Enabled', 
            mainJsContent.includes('contextIsolation: true'),
            'contextIsolation should be true'
        );

        this.addSecurityTest(
            'Remote Module Disabled',
            mainJsContent.includes('enableRemoteModule: false'),
            'enableRemoteModule should be false'
        );

        this.addSecurityTest(
            'Preload Script Configured',
            mainJsContent.includes('preload: path.join(__dirname, \'preload.js\')'),
            'preload script should be configured'
        );

        // Test 2: Verify preload script exists
        this.addSecurityTest(
            'Preload Script Exists',
            fs.existsSync(path.join(__dirname, 'preload.js')),
            'preload.js file should exist'
        );

        // Test 3: Verify secure HTML (no direct require calls)
        const htmlContent = fs.readFileSync(path.join(__dirname, 'floating-notes.html'), 'utf8');
        
        this.addSecurityTest(
            'No Direct Require Calls',
            !htmlContent.includes('window.require(\'electron\')'),
            'HTML should not contain direct require calls'
        );

        // Test 4: Verify input validation in main.js
        this.addSecurityTest(
            'Input Validation Present',
            mainJsContent.includes('typeof noteText !== \'string\'') && 
            mainJsContent.includes('noteText.length > 10000'),
            'Input validation should be implemented'
        );
    }

    async testApplicationLaunch() {
        console.log('🚀 Testing Application Launch and Initialization...\n');

        // Test 1: Check if log shows successful startup
        if (fs.existsSync(this.logFile)) {
            const logContent = fs.readFileSync(this.logFile, 'utf8');
            const lastStart = logContent.lastIndexOf('=== Floating Notes Application Started ===');
            
            if (lastStart !== -1) {
                const recentLogs = logContent.substring(lastStart);
                
                this.addFunctionalityTest(
                    'Application Launch',
                    recentLogs.includes('Application initialized successfully'),
                    'Application should initialize successfully'
                );

                this.addFunctionalityTest(
                    'Window Creation',
                    recentLogs.includes('Main window created successfully'),
                    'Main window should be created'
                );

                this.addFunctionalityTest(
                    'Global Shortcuts',
                    recentLogs.includes('Global shortcuts registered successfully'),
                    'Global shortcuts should be registered'
                );

                this.addFunctionalityTest(
                    'IPC Handlers',
                    recentLogs.includes('IPC handlers set up successfully'),
                    'IPC handlers should be configured'
                );
            } else {
                this.addFunctionalityTest(
                    'Application Launch',
                    false,
                    'No recent startup found in logs'
                );
            }
        } else {
            this.addFunctionalityTest(
                'Log File Creation',
                false,
                'Log file should exist after startup'
            );
        }
    }

    async testFileOperations() {
        console.log('📁 Testing File Operations and Persistence...\n');

        // Test 1: Check if test-notes folder exists
        const testNotesFolder = path.join(__dirname, 'test-notes');
        this.addFunctionalityTest(
            'Actives Folder Creation',
            fs.existsSync(testNotesFolder),
            'test-notes folder should exist'
        );

        // Test 2: Check if daily file exists or can be created
        this.addFunctionalityTest(
            'Daily File Access',
            fs.existsSync(this.dailyFile) || fs.existsSync(testNotesFolder),
            'Daily file should exist or folder should be ready'
        );

        // Test 3: Check config file
        const configFile = path.join(__dirname, 'config.json');
        if (fs.existsSync(configFile)) {
            try {
                const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
                this.addFunctionalityTest(
                    'Configuration Persistence',
                    config.windowPosition && config.windowSize && config.alwaysOnTop !== undefined,
                    'Config should contain required window settings'
                );
            } catch (e) {
                this.addFunctionalityTest(
                    'Configuration Validity',
                    false,
                    'Config file should be valid JSON'
                );
            }
        }

        // Test 4: Verify preload script security implementation
        if (fs.existsSync(path.join(__dirname, 'preload.js'))) {
            const preloadContent = fs.readFileSync(path.join(__dirname, 'preload.js'), 'utf8');
            
            this.addSecurityTest(
                'Secure Context Bridge',
                preloadContent.includes('contextBridge.exposeInMainWorld') &&
                preloadContent.includes('validateNoteInput'),
                'Preload should use contextBridge with validation'
            );

            this.addSecurityTest(
                'IPC Channel Validation',
                preloadContent.includes('allowedChannels') &&
                preloadContent.includes('validateIpcCall'),
                'Preload should validate IPC channels'
            );
        }
    }

    addSecurityTest(name, passed, description) {
        this.results.security.push({ name, passed, description });
        if (passed) {
            console.log(`✅ ${name}: PASS`);
            this.results.overall.passed++;
        } else {
            console.log(`❌ ${name}: FAIL - ${description}`);
            this.results.overall.failed++;
        }
    }

    addFunctionalityTest(name, passed, description) {
        this.results.functionality.push({ name, passed, description });
        if (passed) {
            console.log(`✅ ${name}: PASS`);
            this.results.overall.passed++;
        } else {
            console.log(`❌ ${name}: FAIL - ${description}`);
            this.results.overall.failed++;
        }
    }

    generateReport() {
        console.log('\n' + '=' .repeat(60));
        console.log('📊 VALIDATION RESULTS SUMMARY');
        console.log('=' .repeat(60));

        console.log('\n🔐 SECURITY TESTS:');
        this.results.security.forEach(test => {
            const status = test.passed ? '✅ PASS' : '❌ FAIL';
            console.log(`  ${status} ${test.name}`);
            if (!test.passed) console.log(`      └─ ${test.description}`);
        });

        console.log('\n🚀 FUNCTIONALITY TESTS:');
        this.results.functionality.forEach(test => {
            const status = test.passed ? '✅ PASS' : '❌ FAIL';
            console.log(`  ${status} ${test.name}`);
            if (!test.passed) console.log(`      └─ ${test.description}`);
        });

        const total = this.results.overall.passed + this.results.overall.failed;
        const passRate = ((this.results.overall.passed / total) * 100).toFixed(1);

        console.log('\n' + '=' .repeat(60));
        console.log(`OVERALL RESULTS:`);
        console.log(`  Total Tests: ${total}`);
        console.log(`  Passed: ${this.results.overall.passed} ✅`);
        console.log(`  Failed: ${this.results.overall.failed} ❌`);
        console.log(`  Success Rate: ${passRate}%`);

        if (this.results.overall.failed === 0) {
            console.log('\n🎉 ALL TESTS PASSED!');
            console.log('✅ Security fixes implemented successfully');
            console.log('✅ All MVP functionality preserved');
            console.log('✅ Ready for production deployment');
        } else {
            console.log('\n⚠️  SOME TESTS FAILED');
            console.log('❌ Review failed tests before deployment');
            
            const securityFailed = this.results.security.filter(t => !t.passed).length;
            const functionalityFailed = this.results.functionality.filter(t => !t.passed).length;
            
            if (securityFailed > 0) {
                console.log(`🔐 ${securityFailed} SECURITY TESTS FAILED - CRITICAL`);
            }
            if (functionalityFailed > 0) {
                console.log(`🚀 ${functionalityFailed} FUNCTIONALITY TESTS FAILED`);
            }
        }

        console.log('\n' + '=' .repeat(60));
    }
}

// Run validation
const validator = new SecurityFunctionalityValidator();
validator.runAllTests().catch(console.error);