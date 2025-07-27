// preload.js - Secure IPC Bridge
const { contextBridge, ipcRenderer } = require('electron');

// Input validation functions
function validateNoteInput(input) {
    if (typeof input !== 'string') {
        throw new Error('Note input must be a string');
    }
    
    if (input.length > 10000) {
        throw new Error('Note input too long (max 10,000 characters)');
    }
    
    // Remove null bytes and control characters except newlines and tabs
    const sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    return sanitized;
}

function validateIpcCall(channel, ...args) {
    const allowedChannels = [
        'save-note',
        'undo-last-note', 
        'hide-window',
        'quit-app',
        'reset-window-size',
        'get-window-info',
        'detect-obsidian',
        'validate-folder',
        'select-folder',
        'select-subfolder',
        'discover-vault-folders',
        'create-vault-folder',
        'get-default-notes-path',
        'save-setup-config',
        'complete-setup'
    ];
    
    if (!allowedChannels.includes(channel)) {
        throw new Error(`IPC channel '${channel}' not allowed`);
    }
    
    return true;
}

// Secure API exposure
contextBridge.exposeInMainWorld('electronAPI', {
    // Note operations
    saveNote: async (noteText) => {
        try {
            const sanitizedNote = validateNoteInput(noteText);
            validateIpcCall('save-note');
            return await ipcRenderer.invoke('save-note', sanitizedNote);
        } catch (error) {
            console.error('Save note error:', error.message);
            return { success: false, error: error.message };
        }
    },
    
    undoLastNote: async () => {
        try {
            validateIpcCall('undo-last-note');
            return await ipcRenderer.invoke('undo-last-note');
        } catch (error) {
            console.error('Undo note error:', error.message);
            return { success: false, error: error.message };
        }
    },
    
    // Window operations
    hideWindow: async () => {
        try {
            validateIpcCall('hide-window');
            return await ipcRenderer.invoke('hide-window');
        } catch (error) {
            console.error('Hide window error:', error.message);
            return { success: false, error: error.message };
        }
    },
    
    quitApp: async () => {
        try {
            validateIpcCall('quit-app');
            return await ipcRenderer.invoke('quit-app');
        } catch (error) {
            console.error('Quit app error:', error.message);
            return { success: false, error: error.message };
        }
    },
    
    resetWindowSize: async () => {
        try {
            validateIpcCall('reset-window-size');
            return await ipcRenderer.invoke('reset-window-size');
        } catch (error) {
            console.error('Reset window size error:', error.message);
            return { success: false, error: error.message };
        }
    },
    
    getWindowInfo: async () => {
        try {
            validateIpcCall('get-window-info');
            return await ipcRenderer.invoke('get-window-info');
        } catch (error) {
            console.error('Get window info error:', error.message);
            return null;
        }
    },

    // Setup wizard methods
    detectObsidian: async () => {
        try {
            validateIpcCall('detect-obsidian');
            return await ipcRenderer.invoke('detect-obsidian');
        } catch (error) {
            console.error('Detect Obsidian error:', error.message);
            return { found: false, error: error.message };
        }
    },

    validateFolder: async (folderPath, mode) => {
        try {
            validateIpcCall('validate-folder');
            return await ipcRenderer.invoke('validate-folder', folderPath, mode);
        } catch (error) {
            console.error('Validate folder error:', error.message);
            return { valid: false, error: error.message };
        }
    },

    selectFolder: async () => {
        try {
            validateIpcCall('select-folder');
            return await ipcRenderer.invoke('select-folder');
        } catch (error) {
            console.error('Select folder error:', error.message);
            return { path: null, error: error.message };
        }
    },

    selectSubfolder: async (vaultPath) => {
        try {
            validateIpcCall('select-subfolder');
            return await ipcRenderer.invoke('select-subfolder', vaultPath);
        } catch (error) {
            console.error('Select subfolder error:', error.message);
            return { path: null, error: error.message };
        }
    },

    discoverVaultFolders: async (vaultPath) => {
        try {
            validateIpcCall('discover-vault-folders');
            return await ipcRenderer.invoke('discover-vault-folders', vaultPath);
        } catch (error) {
            console.error('Discover vault folders error:', error.message);
            return { success: false, error: error.message, folders: [] };
        }
    },

    createVaultFolder: async (vaultPath, folderName) => {
        try {
            validateIpcCall('create-vault-folder');
            return await ipcRenderer.invoke('create-vault-folder', vaultPath, folderName);
        } catch (error) {
            console.error('Create vault folder error:', error.message);
            return { success: false, error: error.message };
        }
    },

    getDefaultNotesPath: () => {
        try {
            validateIpcCall('get-default-notes-path');
            return ipcRenderer.invoke('get-default-notes-path');
        } catch (error) {
            console.error('Get default notes path error:', error.message);
            return null;
        }
    },

    saveSetupConfig: async (setupConfig) => {
        try {
            validateIpcCall('save-setup-config');
            return await ipcRenderer.invoke('save-setup-config', setupConfig);
        } catch (error) {
            console.error('Save setup config error:', error.message);
            return { success: false, error: error.message };
        }
    },

    completeSetup: async () => {
        try {
            validateIpcCall('complete-setup');
            return await ipcRenderer.invoke('complete-setup');
        } catch (error) {
            console.error('Complete setup error:', error.message);
            return { success: false, error: error.message };
        }
    }
});

// Security validation for development/testing
if (process.env.NODE_ENV === 'development') {
    contextBridge.exposeInMainWorld('securityTest', {
        // Test that Node.js APIs are not accessible
        testNodeAccess: () => {
            const tests = {
                require: typeof window.require,
                process: typeof window.process,
                Buffer: typeof window.Buffer,
                global: typeof window.global,
                __dirname: typeof window.__dirname,
                __filename: typeof window.__filename
            };
            
            console.log('Security Test - Node.js API Access:', tests);
            return tests;
        },
        
        // Test that only allowed APIs are exposed
        testAPIExposure: () => {
            const allowedAPIs = [
                'saveNote',
                'undoLastNote', 
                'hideWindow',
                'quitApp',
                'resetWindowSize',
                'getWindowInfo'
            ];
            
            const exposedAPIs = Object.keys(window.electronAPI || {});
            const unauthorized = exposedAPIs.filter(api => !allowedAPIs.includes(api));
            
            console.log('Security Test - API Exposure:', {
                allowed: allowedAPIs,
                exposed: exposedAPIs,
                unauthorized: unauthorized
            });
            
            return { authorized: unauthorized.length === 0, unauthorized };
        }
    });
}

console.log('Secure preload script loaded successfully');