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
        this.lastSavedEntry = null; // Store last saved entry for undo
        
        // Default configuration (will be DPI-adjusted on first run)
        this.config = {
            windowPosition: { x: null, y: null }, // null = auto-calculate based on screen
            windowSize: { width: null, height: null }, // null = auto-calculate based on DPI
            defaultSize: { width: 500, height: 150 }, // Base size for scaling
            alwaysOnTop: true,
            autoFocus: true,
            activesFolder: this.activesFolder,
            setupCompleted: false,
            dpiScaleFactor: 1.0, // Store detected scale factor
            useActiveTag: true // Whether to include #active tag in entries
        };
        
        // Config loading deferred until app is ready and paths are set
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
        
        // Get screen dimensions and DPI scaling
        const { screen } = require('electron');
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
        const scaleFactor = primaryDisplay.scaleFactor;
        
        this.log(`Screen: ${screenWidth}x${screenHeight}, Scale: ${scaleFactor}`);
        
        // Calculate DPI-aware dimensions
        const baseWidth = 500;
        const baseHeight = 180;
        const scaledWidth = Math.round(baseWidth * Math.max(1, scaleFactor * 0.8));
        const scaledHeight = Math.round(baseHeight * Math.max(1, scaleFactor * 0.8));
        
        // Use saved size if available, otherwise use scaled defaults
        const windowWidth = this.config.windowSize?.width || scaledWidth;
        const windowHeight = this.config.windowSize?.height || scaledHeight;
        
        // Calculate position (ensure window stays on screen)
        let x = this.config.windowPosition?.x || Math.round(screenWidth * 0.7);
        let y = this.config.windowPosition?.y || Math.round(screenHeight * 0.1);
        
        // Adjust position if window would be off-screen
        if (x + windowWidth > screenWidth) {
            x = screenWidth - windowWidth - 20;
        }
        if (y + windowHeight > screenHeight) {
            y = screenHeight - windowHeight - 20;
        }
        if (x < 0) x = 20;
        if (y < 0) y = 20;

        // Create the browser window with auto-scaling
        this.mainWindow = new BrowserWindow({
            width: windowWidth,
            height: windowHeight,
            minWidth: Math.round(450 * Math.max(1, scaleFactor * 0.8)),
            minHeight: Math.round(180 * Math.max(1, scaleFactor * 0.8)),
            maxWidth: Math.round(800 * Math.max(1, scaleFactor * 0.8)),
            maxHeight: Math.round(400 * Math.max(1, scaleFactor * 0.8)),
            x: x,
            y: y,
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
                nodeIntegration: false,          // ✅ Security: Disable Node.js in renderer
                contextIsolation: true,          // ✅ Security: Isolate contexts
                enableRemoteModule: false,       // ✅ Security: Disable deprecated remote module
                preload: path.join(__dirname, 'preload.js'), // ✅ Security: Secure IPC bridge
                webSecurity: true,               // ✅ Security: Enable web security (default)
                allowRunningInsecureContent: false, // ✅ Security: Block insecure content
                experimentalFeatures: false,     // ✅ Security: Disable experimental features
                sandbox: true,                   // ✅ Security: Enable sandbox
                allowedCSPHashAlgorithms: ['sha256'], // ✅ Security: Restrict CSP algorithms
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
        try {
            // Create system tray icon (try multiple paths for dev/prod)
            const iconPaths = [
                path.join(__dirname, '..', 'build', 'tray.ico'), // Development
                path.join(process.resourcesPath, 'app', 'build', 'tray.ico'), // Packaged
                path.join(__dirname, 'tray.ico') // Fallback
            ];
            
            let iconPath = null;
            for (const tryPath of iconPaths) {
                if (require('fs').existsSync(tryPath)) {
                    iconPath = tryPath;
                    break;
                }
            }
            
            if (!iconPath) {
                throw new Error('Tray icon not found');
            }
            
            this.tray = new Tray(iconPath);
            
            // Set tooltip
            this.tray.setToolTip('Floating Bujo - Quick Note Capture');
            
            // Create context menu
            const contextMenu = Menu.buildFromTemplate([
                {
                    label: 'Show Window',
                    click: () => {
                        if (this.mainWindow) {
                            this.mainWindow.show();
                            this.mainWindow.focus();
                        }
                    }
                },
                {
                    label: 'Hide Window',
                    click: () => {
                        if (this.mainWindow) {
                            this.mainWindow.hide();
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Reset Window Size',
                    click: () => this.resetWindowSize()
                },
                { type: 'separator' },
                {
                    label: 'Forget Configuration',
                    click: () => this.forgetConfiguration()
                },
                {
                    label: 'Quit',
                    click: () => this.quitApplication()
                }
            ]);
            
            this.tray.setContextMenu(contextMenu);
            
            // Double-click to show/hide window
            this.tray.on('double-click', () => {
                if (this.mainWindow) {
                    if (this.mainWindow.isVisible()) {
                        this.mainWindow.hide();
                    } else {
                        this.mainWindow.show();
                        this.mainWindow.focus();
                    }
                }
            });
            
            this.log('System tray created successfully');
            this.log('Use Ctrl+Shift+N (Show) / Ctrl+Shift+H (Hide) for keyboard control');
            
        } catch (error) {
            this.log(`System tray creation failed: ${error.message}`);
            this.log('Falling back to keyboard shortcuts only');
        }
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
        
        // Handle note saving with input validation
        ipcMain.handle('save-note', async (event, noteText) => {
            try {
                // Security: Validate input
                if (typeof noteText !== 'string') {
                    throw new Error('Note text must be a string');
                }
                
                if (noteText.length > 10000) {
                    throw new Error('Note text too long (max 10,000 characters)');
                }
                
                // Additional sanitization (preload script already handles basic sanitization)
                const sanitizedNote = noteText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
                
                await this.saveActiveNote(sanitizedNote);
                this.log(`Note saved: "${sanitizedNote.substring(0, 100)}${sanitizedNote.length > 100 ? '...' : ''}"`);
                return { success: true };
            } catch (error) {
                this.log(`Error saving note: ${error.message}`);
                return { success: false, error: error.message };
            }
        });

        // Handle undo functionality
        ipcMain.handle('undo-last-note', async (event) => {
            try {
                const result = await this.undoLastEntry();
                if (result.success) {
                    this.log('Last entry undone successfully');
                    return { success: true, restoredText: result.restoredText };
                } else {
                    this.log(`Undo failed: ${result.error}`);
                    return { success: false, error: result.error };
                }
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

        // Setup wizard IPC handlers
        ipcMain.handle('detect-obsidian', async () => {
            return await this.detectObsidian();
        });

        ipcMain.handle('validate-folder', async (event, folderPath, mode) => {
            return await this.validateFolder(folderPath, mode);
        });

        ipcMain.handle('select-folder', async () => {
            try {
                const result = await dialog.showOpenDialog({
                    properties: ['openDirectory'],
                    title: 'Select Notes Folder'
                });
                
                if (!result.canceled && result.filePaths.length > 0) {
                    return { path: result.filePaths[0] };
                }
                
                return { path: null };
            } catch (error) {
                this.log(`Error selecting folder: ${error.message}`);
                return { path: null, error: error.message };
            }
        });

        ipcMain.handle('select-subfolder', async (event, vaultPath) => {
            try {
                const result = await dialog.showOpenDialog({
                    properties: ['openDirectory'],
                    title: 'Select Subfolder within Obsidian Vault',
                    defaultPath: vaultPath
                });
                
                if (!result.canceled && result.filePaths.length > 0) {
                    const selectedPath = result.filePaths[0];
                    
                    // Ensure the selected path is within the vault
                    if (selectedPath.startsWith(vaultPath)) {
                        return { path: selectedPath };
                    } else {
                        return { path: null, error: 'Selected folder must be within the Obsidian vault' };
                    }
                }
                
                return { path: null };
            } catch (error) {
                this.log(`Error selecting subfolder: ${error.message}`);
                return { path: null, error: error.message };
            }
        });

        ipcMain.handle('discover-vault-folders', async (event, vaultPath) => {
            try {
                const folders = await this.discoverVaultFolders(vaultPath);
                return { success: true, folders };
            } catch (error) {
                this.log(`Error discovering vault folders: ${error.message}`);
                return { success: false, error: error.message, folders: [] };
            }
        });

        ipcMain.handle('create-vault-folder', async (event, vaultPath, folderName) => {
            try {
                const result = await this.createVaultFolder(vaultPath, folderName);
                return result;
            } catch (error) {
                this.log(`Error creating vault folder: ${error.message}`);
                return { success: false, error: error.message };
            }
        });

        ipcMain.handle('get-default-notes-path', () => {
            return this.getDefaultNotesPath();
        });

        ipcMain.handle('save-setup-config', async (event, setupConfig) => {
            try {
                // Update configuration with setup data
                this.config.mode = setupConfig.mode;
                this.config.setupCompleted = true;
                this.config.rememberConfiguration = setupConfig.rememberConfiguration !== false; // Default to true
                
                if (setupConfig.mode === 'obsidian') {
                    this.config.obsidianVaultPath = setupConfig.folderPath;
                    this.config.obsidianSubfolder = setupConfig.subfolderPath || '';
                    
                    // Use the final path (vault + subfolder) or just vault if no subfolder
                    this.activesFolder = setupConfig.finalPath || setupConfig.folderPath;
                } else {
                    this.activesFolder = setupConfig.folderPath;
                }
                
                this.config.activesFolder = this.activesFolder;
                
                // Save configuration
                await this.saveConfig();
                
                const folderInfo = setupConfig.mode === 'obsidian' && setupConfig.subfolderPath 
                    ? `${setupConfig.folderPath}/${setupConfig.subfolderPath}`
                    : setupConfig.folderPath;
                
                this.log(`Setup completed - Mode: ${setupConfig.mode}, Folder: ${folderInfo}, Remember: ${setupConfig.rememberConfiguration}`);
                
                return { success: true };
            } catch (error) {
                this.log(`Error saving setup config: ${error.message}`);
                return { success: false, error: error.message };
            }
        });

        ipcMain.handle('complete-setup', async () => {
            try {
                // Close setup window and create main window
                const setupWindow = BrowserWindow.getFocusedWindow();
                if (setupWindow) {
                    setupWindow.close();
                }
                
                // Create main application window
                await this.createWindow();
                
                return { success: true };
            } catch (error) {
                this.log(`Error completing setup: ${error.message}`);
                return { success: false, error: error.message };
            }
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
        // Use local time instead of UTC to prevent timezone issues
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const timestamp = `${year}${month}${day}`;
        return `actives-${timestamp}.md`;
    }

    async createOrGetDailyFile() {
        const now = new Date();
        // Use consistent local date string for comparison
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        
        // Check if we need a new daily file
        if (this.lastFileDate !== today) {
            const filename = this.getDailyFileName();
            const filePath = path.join(this.activesFolder, filename);
            
            try {
                // Check if file exists
                await fs.access(filePath);
                this.log(`Using existing daily file: ${filename}`);
            } catch {
                // Create new file with consistent local date
                const dateStr = now.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
                await fs.writeFile(filePath, `# Active Notes - ${dateStr}\n\n`);
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
        const activeTag = this.config.useActiveTag ? '#active ' : '';
        const noteEntry = `${timeStr} ${activeTag}${noteText}\n`;
        
        // Store the entry details for potential undo
        this.lastSavedEntry = {
            text: noteText,
            entry: noteEntry.trim(), // Store without trailing newline for comparison
            filePath: filePath,
            timestamp: now.getTime()
        };
        
        this.log(`Save debug - Stored entry for undo: "${noteEntry.trim()}"`);
        
        await fs.appendFile(filePath, noteEntry, 'utf8');
    }

    async undoLastEntry() {
        try {
            if (!this.lastSavedEntry) {
                return { success: false, error: 'No entry to undo' };
            }

            const { entry, filePath, text, timestamp } = this.lastSavedEntry;
            
            // Check if undo is still allowed (within reasonable time frame - 5 minutes)
            const now = new Date().getTime();
            const timeDiff = now - timestamp;
            if (timeDiff > 5 * 60 * 1000) { // 5 minutes
                this.lastSavedEntry = null;
                return { success: false, error: 'Undo window expired (5 minutes)' };
            }

            // Read the current file content
            let fileContent;
            try {
                fileContent = await fs.readFile(filePath, 'utf8');
            } catch (error) {
                return { success: false, error: 'Could not read file for undo' };
            }

            // Check if the last line matches our saved entry
            const lines = fileContent.split('\n');
            const lastNonEmptyLine = lines.filter(line => line.trim()).pop();
            
            this.log(`Undo debug - Looking for: "${entry.trim()}"`);
            this.log(`Undo debug - Found last line: "${lastNonEmptyLine}"`);
            
            if (lastNonEmptyLine !== entry.trim()) {
                return { success: false, error: 'File has been modified since last entry' };
            }

            // Find and remove the exact matching line
            let foundIndex = -1;
            for (let i = lines.length - 1; i >= 0; i--) {
                if (lines[i].trim() === entry.trim()) {
                    foundIndex = i;
                    break;
                }
            }
            
            if (foundIndex === -1) {
                return { success: false, error: 'Could not find entry to remove' };
            }
            
            // Remove the line at foundIndex
            const newLines = [...lines];
            newLines.splice(foundIndex, 1);
            
            // Clean up trailing empty lines, but keep the file structure
            while (newLines.length > 0 && newLines[newLines.length - 1] === '') {
                newLines.pop();
            }
            
            const newContent = newLines.join('\n') + (newLines.length > 0 ? '\n' : '');
            
            this.log(`Undo debug - Removed line at index ${foundIndex}, new content length: ${newContent.length}`);
            
            // Write back the modified content
            await fs.writeFile(filePath, newContent, 'utf8');
            
            // Clear the last saved entry since it's been undone
            const restoredText = text;
            this.lastSavedEntry = null;
            
            return { success: true, restoredText };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
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

    async forgetConfiguration() {
        try {
            const { dialog } = require('electron');
            
            // Show confirmation dialog
            const response = await dialog.showMessageBox(null, {
                type: 'question',
                buttons: ['Forget Configuration', 'Cancel'],
                defaultId: 1,
                title: 'Forget Configuration',
                message: 'Are you sure you want to forget your configuration?',
                detail: 'This will reset all settings and show the setup wizard on next startup. The application will restart.'
            });
            
            if (response.response !== 0) return;
            
            // Delete config file
            if (require('fs').existsSync(this.configFile)) {
                await require('fs').promises.unlink(this.configFile);
            }
            
            this.log('Configuration forgotten - setup wizard will appear on next startup');
            
            // Close current windows before restart
            if (this.mainWindow) {
                this.mainWindow.close();
            }
            if (this.setupWindow) {
                this.setupWindow.close();
            }
            
            // Restart application
            setTimeout(() => {
                app.relaunch();
                app.quit();
            }, 100);
            
        } catch (error) {
            this.log(`Error forgetting configuration: ${error.message}`);
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
        
        // Setup persistent storage paths in user data directory
        const userDataPath = app.getPath('userData');
        this.activesFolder = path.join(userDataPath, 'test-notes');
        this.logFile = path.join(userDataPath, 'floating-notes.log');
        this.configFile = path.join(userDataPath, 'config.json');
        
        // Reload config from proper location
        await this.loadConfig();
        
        // Setup IPC handlers first (needed for setup wizard)
        this.setupIPC();
        
        // Check if setup has been completed
        if (!this.config.setupCompleted || this.config.rememberConfiguration === false) {
            this.log(this.config.setupCompleted ? 
                'Configuration memory disabled - showing setup wizard' : 
                'Setup not completed - showing setup wizard');
            await this.createSetupWindow();
            return; // Don't proceed with main app initialization
        }
        
        // Create system tray
        this.createTray();
        
        // Create main window
        await this.createWindow();
        
        // Setup global shortcuts
        this.setupGlobalShortcuts();
        
        // Ensure actives folder exists
        await this.ensureActivesFolder();
        
        // Create initial daily file
        await this.createOrGetDailyFile();
        
        this.log('Application initialized successfully');
    }

    // Obsidian detection methods
    async detectObsidian() {
        this.log('Detecting Obsidian installation');
        
        try {
            const os = require('os');
            const platform = os.platform();
            let possiblePaths = [];
            
            if (platform === 'win32') {
                const userProfile = os.homedir();
                possiblePaths = [
                    path.join(userProfile, 'AppData', 'Local', 'Obsidian', 'Obsidian.exe'),
                    path.join(userProfile, 'AppData', 'Local', 'Programs', 'Obsidian', 'Obsidian.exe'),
                    'C:\\Program Files\\Obsidian\\Obsidian.exe',
                    'C:\\Program Files (x86)\\Obsidian\\Obsidian.exe'
                ];
            }
            
            // Check if Obsidian executable exists
            for (const obsidianPath of possiblePaths) {
                if (fsSync.existsSync(obsidianPath)) {
                    this.log(`Obsidian found at: ${obsidianPath}`);
                    
                    // Try to find vault path
                    const vaultPath = await this.findObsidianVault();
                    
                    return {
                        found: true,
                        executablePath: obsidianPath,
                        vaultPath: vaultPath
                    };
                }
            }
            
            this.log('Obsidian not found in standard locations');
            return { found: false };
            
        } catch (error) {
            this.log(`Error detecting Obsidian: ${error.message}`);
            return { found: false, error: error.message };
        }
    }
    
    async findObsidianVault() {
        try {
            const os = require('os');
            const userHome = os.homedir();
            
            // Common vault locations
            const possibleVaultLocations = [
                path.join(userHome, 'Documents', 'Obsidian'),
                path.join(userHome, 'Documents'),
                path.join(userHome, 'OneDrive', 'Documents'),
                path.join(userHome, 'Dropbox'),
                path.join(userHome, 'iCloudDrive'),
                userHome
            ];
            
            for (const location of possibleVaultLocations) {
                if (fsSync.existsSync(location)) {
                    const subdirs = await fs.readdir(location, { withFileTypes: true });
                    
                    for (const dirent of subdirs) {
                        if (dirent.isDirectory()) {
                            const vaultPath = path.join(location, dirent.name);
                            const obsidianConfigPath = path.join(vaultPath, '.obsidian');
                            
                            if (fsSync.existsSync(obsidianConfigPath)) {
                                this.log(`Found Obsidian vault at: ${vaultPath}`);
                                return vaultPath;
                            }
                        }
                    }
                }
            }
            
            return null;
            
        } catch (error) {
            this.log(`Error finding Obsidian vault: ${error.message}`);
            return null;
        }
    }
    
    async validateFolder(folderPath, mode) {
        try {
            // Check if folder exists and is accessible
            await fs.access(folderPath);
            
            if (mode === 'obsidian') {
                // Check if it's a valid Obsidian vault
                const obsidianConfigPath = path.join(folderPath, '.obsidian');
                if (fsSync.existsSync(obsidianConfigPath)) {
                    return {
                        valid: true,
                        message: 'Valid Obsidian vault detected'
                    };
                } else {
                    return {
                        valid: false,
                        message: 'This folder is not an Obsidian vault (missing .obsidian folder)'
                    };
                }
            } else {
                // For markdown mode, just check if it's writable
                const testFile = path.join(folderPath, '.test-write');
                try {
                    await fs.writeFile(testFile, 'test');
                    await fs.unlink(testFile);
                    return {
                        valid: true,
                        message: 'Folder is writable and accessible'
                    };
                } catch (writeError) {
                    return {
                        valid: false,
                        message: 'Folder is not writable'
                    };
                }
            }
            
        } catch (error) {
            return {
                valid: false,
                message: `Cannot access folder: ${error.message}`
            };
        }
    }
    
    getDefaultNotesPath() {
        const os = require('os');
        const userHome = os.homedir();
        return path.join(userHome, 'Documents', 'FloatingBujo');
    }

    async discoverVaultFolders(vaultPath) {
        try {
            const folders = [];
            
            // Add vault root option
            folders.push({
                name: '/ (Vault Root)',
                path: '',
                fullPath: vaultPath,
                isRoot: true
            });
            
            // Recursively discover folders
            await this.scanFoldersRecursive(vaultPath, vaultPath, '', folders, 0, 3); // Max depth of 3
            
            return folders;
        } catch (error) {
            this.log(`Error in discoverVaultFolders: ${error.message}`);
            return [];
        }
    }

    async scanFoldersRecursive(basePath, currentPath, relativePath, folders, depth, maxDepth) {
        if (depth >= maxDepth) return;
        
        try {
            const items = await fs.readdir(currentPath, { withFileTypes: true });
            
            for (const item of items) {
                if (item.isDirectory()) {
                    // Skip hidden folders and Obsidian system folders
                    if (item.name.startsWith('.') || item.name.startsWith('_')) {
                        continue;
                    }
                    
                    const itemPath = path.join(currentPath, item.name);
                    const relativeItemPath = relativePath ? path.join(relativePath, item.name) : item.name;
                    
                    // Add folder to list
                    folders.push({
                        name: '  '.repeat(depth) + item.name,
                        path: relativeItemPath.replace(/\\/g, '/'), // Normalize path separators
                        fullPath: itemPath,
                        isRoot: false,
                        depth: depth
                    });
                    
                    // Recursively scan subfolders
                    await this.scanFoldersRecursive(basePath, itemPath, relativeItemPath, folders, depth + 1, maxDepth);
                }
            }
        } catch (error) {
            // Continue scanning even if one folder fails
            this.log(`Error scanning folder ${currentPath}: ${error.message}`);
        }
    }

    async createVaultFolder(vaultPath, folderName) {
        try {
            // Validate folder name
            if (!folderName || folderName.trim() === '') {
                return { success: false, error: 'Folder name cannot be empty' };
            }
            
            // Sanitize folder name
            const sanitizedName = folderName.trim().replace(/[<>:"/\\|?*]/g, '');
            if (sanitizedName !== folderName.trim()) {
                return { success: false, error: 'Folder name contains invalid characters' };
            }
            
            const folderPath = path.join(vaultPath, sanitizedName);
            
            // Check if folder already exists
            try {
                await fs.access(folderPath);
                return { success: false, error: 'Folder already exists' };
            } catch {
                // Folder doesn't exist, which is what we want
            }
            
            // Create the folder
            await fs.mkdir(folderPath, { recursive: true });
            
            this.log(`Created new vault folder: ${sanitizedName}`);
            
            return { 
                success: true, 
                folderName: sanitizedName,
                folderPath: sanitizedName.replace(/\\/g, '/') // Normalize for UI
            };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    async createSetupWindow() {
        this.log('Creating setup wizard window');
        
        // Get screen dimensions and DPI scaling for setup wizard
        const { screen } = require('electron');
        const primaryDisplay = screen.getPrimaryDisplay();
        const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
        const scaleFactor = primaryDisplay.scaleFactor;
        
        // Calculate DPI-aware setup window dimensions
        const baseWidth = 600;
        const baseHeight = 500;
        const setupWidth = Math.round(baseWidth * Math.max(1, scaleFactor * 0.9));
        const setupHeight = Math.round(baseHeight * Math.max(1, scaleFactor * 0.9));
        
        // Ensure window fits on screen
        const maxWidth = Math.min(setupWidth, screenWidth - 100);
        const maxHeight = Math.min(setupHeight, screenHeight - 100);
        
        this.log(`Setup window: ${maxWidth}x${maxHeight} (scale: ${scaleFactor})`);
        
        const setupWindow = new BrowserWindow({
            width: maxWidth,
            height: maxHeight,
            minWidth: Math.round(500 * Math.max(1, scaleFactor * 0.8)),
            minHeight: Math.round(400 * Math.max(1, scaleFactor * 0.8)),
            center: true,
            resizable: true,
            minimizable: false,
            maximizable: false,
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: path.join(__dirname, 'preload.js')
            }
        });
        
        await setupWindow.loadFile(path.join(__dirname, 'setup-wizard.html'));
        
        setupWindow.on('closed', () => {
            // If setup is cancelled, quit the application
            if (!this.config.setupCompleted) {
                app.quit();
            }
        });
        
        return setupWindow;
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