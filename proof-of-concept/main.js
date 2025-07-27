// main.js - Comprehensive Floating Notes Application
const { app, BrowserWindow, globalShortcut, ipcMain, Menu, Tray, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

class ComprehensiveFloatingNotes {
    constructor() {
        this.mainWindow = null;
        this.tray = null;
        this.activesFolder = path.join(__dirname, 'test-notes')
        this.logFile = path.join(__dirname, 'floating-notes.log');
        this.configFile = path.join(__dirname, 'config.json');
        this.currentDailyFile = null;
        this.lastFileDate = null;
        
        // Default configuration
        this.config = {
            windowPosition: { x: 100, y: 100 },
            windowSize: { width: 500, height: 150 },
            defaultSize: { width: 500, height: 150 },
            alwaysOnTop: true,
            autoFocus: true,
            activesFolder: this.activesFolder
        };
        
        this.loadConfig();
        this.initializeLogging();
    }

    async loadConfig() {
        try {
            if (fsSync.existsSync(this.configFile)) {
                const configData = await fs.readFile(this.configFile, 'utf8');
                this.config = { ...this.config, ...JSON.parse(configData) };
                this.activesFolder = this.config.activesFolder;
                this.log('Configuration loaded successfully');
            }
        } catch (error) {
            this.log(`Error loading config: ${error.message}`);
        }
    }

    async saveConfig() {
        try {
            await fs.writeFile(this.configFile, JSON.stringify(this.config, null, 2));
            this.log('Configuration saved successfully');
        } catch (error) {
            this.log(`Error saving config: ${error.message}`);
        }
    }

    initializeLogging() {
        // Create log file if it doesn't exist
        if (!fsSync.existsSync(this.logFile)) {
            fsSync.writeFileSync(this.logFile, '');
        }
        this.log('=== Floating Notes Application Started ===');
    }

    log(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}\n`;
        
        console.log(logMessage.trim());
        
        try {
            fsSync.appendFileSync(this.logFile, logMessage, 'utf8');
        } catch (error) {
            console.error('Failed to write to log file:', error);
        }
    }

    async createWindow() {
        this.log('Creating main floating window');
        
        // Get screen dimensions
        const { screen } = require('electron');
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
        
        // Calculate position
        const x = this.config.windowPosition.x < 0 ? 
            screenWidth + this.config.windowPosition.x : 
            this.config.windowPosition.x;

        // Create the browser window
        this.mainWindow = new BrowserWindow({
            width: this.config.windowSize.width,
            height: this.config.windowSize.height,
            x: x,
            y: this.config.windowPosition.y,
            alwaysOnTop: this.config.alwaysOnTop,
            skipTaskbar: true,
            frame: false,
            resizable: true,
            minimizable: false,
            maximizable: false,
            show: false,
            transparent: false,
            backgroundColor: '#1e1e1e',
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        });

        // Load the HTML file
        await this.mainWindow.loadFile(path.join(__dirname, 'floating-notes.html'));

        // Show window immediately and force it to be visible
        this.mainWindow.once('ready-to-show', () => {
            this.mainWindow.show();
            this.mainWindow.focus();
            this.mainWindow.moveTop(); // Force to top
            this.mainWindow.setAlwaysOnTop(true, 'screen-saver'); // Highest level
            
            const [x, y] = this.mainWindow.getPosition();
            const [width, height] = this.mainWindow.getSize();
            this.log(`Main window displayed at position: ${x},${y} size: ${width}x${height}`);
            this.log(`Window visible: ${this.mainWindow.isVisible()}`);
            this.log(`Window focused: ${this.mainWindow.isFocused()}`);
        });
        
        // Force show immediately without waiting
        this.mainWindow.show();
        this.mainWindow.focus();

        // Prevent window from being closed completely
        this.mainWindow.on('close', (event) => {
            event.preventDefault();
            this.mainWindow.hide();
            this.log('Window hidden (not closed)');
        });

        // Handle window moved (save position)
        this.mainWindow.on('moved', () => {
            const [x, y] = this.mainWindow.getPosition();
            this.config.windowPosition.x = x;
            this.config.windowPosition.y = y;
            this.saveConfig();
        });

        // Handle window resized (save size)
        this.mainWindow.on('resized', () => {
            const [width, height] = this.mainWindow.getSize();
            this.config.windowSize.width = width;
            this.config.windowSize.height = height;
            this.saveConfig();
        });

        this.log('Main window created successfully');
    }

    createTray() {
        this.log('System tray disabled - using keyboard shortcuts only');
        this.log('Use Ctrl+Shift+N (Show) / Ctrl+Shift+H (Hide) for window control');
    }

    setupGlobalShortcuts() {
        this.log('Setting up global shortcuts');
        
        // Global hotkey to show/focus window
        globalShortcut.register('CommandOrControl+Shift+N', () => {
            this.log('Global shortcut triggered: Show/Focus');
            if (this.mainWindow) {
                if (this.mainWindow.isVisible()) {
                    this.mainWindow.focus();
                } else {
                    this.mainWindow.show();
                    this.mainWindow.focus();
                }
            }
        });

        // Global hotkey to hide window
        globalShortcut.register('CommandOrControl+Shift+H', () => {
            this.log('Global shortcut triggered: Hide');
            if (this.mainWindow && this.mainWindow.isVisible()) {
                this.mainWindow.hide();
            }
        });

        this.log('Global shortcuts registered successfully');
    }

    setupIPC() {
        this.log('Setting up IPC handlers');
        
        // Handle note saving
        ipcMain.handle('save-note', async (event, noteText) => {
            try {
                await this.saveActiveNote(noteText);
                this.log(`Note saved: "${noteText}"`);
                return { success: true };
            } catch (error) {
                this.log(`Error saving note: ${error.message}`);
                return { success: false, error: error.message };
            }
        });

        // Handle undo functionality
        ipcMain.handle('undo-last-note', async (event) => {
            try {
                // For now, just return success - actual undo logic can be implemented later
                this.log('Undo requested - feature not fully implemented yet');
                return { success: true };
            } catch (error) {
                this.log(`Error with undo: ${error.message}`);
                return { success: false, error: error.message };
            }
        });

        // Handle window operations
        ipcMain.handle('hide-window', () => {
            if (this.mainWindow) {
                this.mainWindow.hide();
                this.log('Window hidden via IPC');
            }
        });

        ipcMain.handle('reset-window-size', () => {
            this.resetWindowSize();
        });

        ipcMain.handle('quit-app', () => {
            this.quitApplication();
        });

        // Handle window size/position updates
        ipcMain.handle('get-window-info', () => {
            if (this.mainWindow) {
                const [width, height] = this.mainWindow.getSize();
                const [x, y] = this.mainWindow.getPosition();
                return { width, height, x, y };
            }
            return null;
        });

        this.log('IPC handlers set up successfully');
    }

    async ensureActivesFolder() {
        try {
            await fs.access(this.activesFolder);
            this.log(`Actives folder exists: ${this.activesFolder}`);
        } catch {
            await fs.mkdir(this.activesFolder, { recursive: true });
            this.log(`Created actives folder: ${this.activesFolder}`);
        }
    }

    getDailyFileName() {
        const now = new Date();
        const timestamp = now.toISOString().slice(0, 10).replace(/-/g, '');
        return `actives-${timestamp}.md`;
    }

    async createOrGetDailyFile() {
        const now = new Date();
        const today = now.toDateString();
        
        // Check if we need a new daily file
        if (this.lastFileDate !== today) {
            const filename = this.getDailyFileName();
            const filePath = path.join(this.activesFolder, filename);
            
            try {
                // Check if file exists
                await fs.access(filePath);
                this.log(`Using existing daily file: ${filename}`);
            } catch {
                // Create new file
                await fs.writeFile(filePath, `# Active Notes - ${now.toDateString()}\n\n`);
                this.log(`Created new daily file: ${filename}`);
            }
            
            this.currentDailyFile = filePath;
            this.lastFileDate = today;
        }
        
        return this.currentDailyFile;
    }

    async saveActiveNote(noteText) {
        await this.ensureActivesFolder();
        
        const filePath = await this.createOrGetDailyFile();
        const now = new Date();
        const timeStr = now.toTimeString().slice(0, 8);
        const noteEntry = `${timeStr} #active ${noteText}\n`;
        
        await fs.appendFile(filePath, noteEntry, 'utf8');
    }

    resetWindowSize() {
        if (this.mainWindow) {
            this.mainWindow.setSize(
                this.config.defaultSize.width, 
                this.config.defaultSize.height
            );
            this.log('Window size reset to default');
        }
    }

    quitApplication() {
        this.log('Application quit requested');
        
        if (this.mainWindow) {
            this.mainWindow.removeAllListeners('close');
            this.mainWindow.close();
        }
        
        this.log('=== Floating Notes Application Stopped ===');
        app.quit();
    }

    async initialize() {
        this.log('Initializing application');
        
        await app.whenReady();
        
        // Create system tray
        this.createTray();
        
        // Create main window
        await this.createWindow();
        
        // Setup global shortcuts
        this.setupGlobalShortcuts();
        
        // Setup IPC handlers
        this.setupIPC();
        
        // Ensure actives folder exists
        await this.ensureActivesFolder();
        
        // Create initial daily file
        await this.createOrGetDailyFile();
        
        this.log('Application initialized successfully');
    }

    cleanup() {
        this.log('Cleaning up application');
        globalShortcut.unregisterAll();
        
        if (this.tray) {
            this.tray.destroy();
        }
    }
}

// Disable GPU acceleration for lightweight operation (must be before app.whenReady)
app.disableHardwareAcceleration();

// Create application instance
const floatingApp = new ComprehensiveFloatingNotes();

// App event handlers
app.whenReady().then(() => {
    floatingApp.initialize();
});

app.on('window-all-closed', () => {
    // Don't quit - keep running in background
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        floatingApp.createWindow();
    }
});

app.on('before-quit', () => {
    floatingApp.cleanup();
});

// Handle app quit
app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});