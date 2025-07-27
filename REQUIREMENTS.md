# Floating Bujo - Requirements Specification

## Project Overview

**Name:** Floating Bujo  
**Version:** 1.0.0  
**Target Platform:** Windows 10/11  
**Framework:** Electron + Node.js  
**License:** MIT  

**Description:** A standalone system-wide Electron application that enables seamless bullet journal note capture without interrupting workflow. Supports both Obsidian users through external integration and general markdown enthusiasts through simple file management. This is **not an Obsidian plugin** but rather an independent desktop application that works alongside Obsidian.

## Core Value Proposition

- **Standalone desktop application** - Independent Electron app, not an Obsidian plugin
- **Zero-friction bullet journaling** - Always accessible, minimal interface
- **System-wide availability** - Works over any application (browsers, games, IDEs)
- **Dual-mode support** - External Obsidian integration OR general markdown workflow
- **Persistent operation** - Runs as Windows service, survives restarts
- **Principled simplicity** - Capture thoughts instantly without configuration complexity

## Functional Requirements

### FR-001: Dual-Mode Setup and Detection
- **Description:** Intelligent detection and setup for Obsidian or Markdown mode
- **Acceptance Criteria:**
  - Application scans for Obsidian installation on first startup
  - Searches common locations for .obsidian folders (vaults)
  - Presents setup wizard with detected mode recommendations
  - User can override detection and choose preferred mode
  - Mode selection persists across sessions
  - Clear visual indication of current mode in main window
  - One-time setup process with option to reconfigure later
- **Description:** Application shall provide an always-visible floating window
- **Acceptance Criteria:**
  - Window appears above ALL other applications (browsers, games, fullscreen apps)
  - Window remains accessible when Obsidian is not running
  - Window persists across user sessions
  - User can interact with window without losing focus from current application

### FR-002: System-Wide Floating Window
- **Description:** Application shall provide an always-visible floating window
- **Acceptance Criteria:**
  - Window appears above ALL other applications (browsers, games, fullscreen apps)
  - Window remains accessible regardless of current application focus
  - Window persists across user sessions
  - User can interact with window without losing focus from current application
  - Consistent behavior across both Obsidian and Markdown modes
- **Description:** Simple, intuitive bullet journal entry mechanism with vault integration
- **Acceptance Criteria:**
  - Single text input field with placeholder text "Entry..."
  - Support for multi-line entries (auto-expanding textarea)
  - Enter key submits entry, Ctrl+Enter adds new line
  - Escape key clears current input
  - Visual feedback for successful/failed saves
  - Folder selection dropdown/button visible in interface
  - Current vault and folder displayed in window
  - Status indicator for vault connection
  - Undo button appears for 10 seconds after successful submission
  - Ctrl+Z keyboard shortcut for undo last submission

### FR-003: Bujo Input Interface
- **Description:** Simple, intuitive bullet journal entry mechanism
- **Acceptance Criteria:**
  - Single text input field with placeholder text "Entry..."
  - Support for multi-line entries (auto-expanding textarea)
  - Enter key submits entry, Ctrl+Enter adds new line
  - Escape key clears current input
  - Visual feedback for successful/failed saves
  - Current mode and target location displayed in window
  - Status indicator for connection/file access
  - Undo button appears for 10 seconds after successful submission
  - Ctrl+Z keyboard shortcut for undo last submission
- **Description:** User control over window appearance and position
- **Acceptance Criteria:**
  - Draggable window (click and drag to reposition)
  - Resizable window with minimum/maximum size constraints
  - Reset to default size button
  - Position and size persistence across sessions
  - Always-on-top toggle option

### FR-004: Window Management
- **Description:** User control over window appearance and position
- **Acceptance Criteria:**
  - Draggable window (click and drag to reposition)
  - Resizable window with minimum/maximum size constraints
  - Reset to default size button
  - Position and size persistence across sessions
  - Always-on-top toggle option
  - Consistent window management across both modes
- **Description:** Intelligent Obsidian vault integration with user-controlled folder selection
- **Acceptance Criteria:**
  - User specifies Obsidian vault path on first startup
  - Vault selection persists across sessions (configurable)
  - New file created daily with format: `actives-YYYYMMDD.md`
  - File created on first note of the day
  - Subsequent notes append to existing daily file
  - Handles date transitions correctly (midnight rollover)
  - Vault path validation (checks for `.obsidian` folder)
  - Error handling for invalid or moved vaults

### FR-005: Obsidian Mode File Management
- **Description:** Intelligent Obsidian vault integration for seamless workflow
- **Acceptance Criteria:**
  - User selects Obsidian vault from detected vaults during setup
  - Vault selection persists across sessions
  - Daily files created in vault root or configured subfolder
  - New file created daily with format: `actives-YYYYMMDD.md`
  - File created on first entry of the day
  - Subsequent entries append to existing daily file
  - Handles date transitions correctly (midnight rollover)
  - Vault path validation (checks for `.obsidian` folder)
  - Error handling for invalid or moved vaults

### FR-006: Markdown Mode File Management
- **Description:** Simple folder-based file management for general markdown users
- **Acceptance Criteria:**
  - User selects target folder during setup wizard
  - Folder selection persists across sessions
  - Daily files created with format: `actives-YYYYMMDD.md`
  - File created on first entry of the day
  - Subsequent entries append to existing daily file
  - Handles date transitions correctly (midnight rollover)
  - Folder path validation and error handling
  - Support for network drives and cloud-synced folders
- **Description:** Consistent, searchable bullet journal entry format
- **Acceptance Criteria:**
  - Format: `HH:MM:SS #active {entry_content}`
  - Timestamp uses 24-hour format
  - Each entry on separate line
  - Preserves line breaks in multi-line entries
  - Hashtag `#active` for Obsidian compatibility

### FR-007: Bujo Entry Formatting
- **Description:** Consistent, searchable bullet journal entry format
- **Acceptance Criteria:**
  - Format: `HH:MM:SS #active {entry_content}`
  - Timestamp uses 24-hour format
  - Each entry on separate line
  - Preserves line breaks in multi-line entries
  - Hashtag `#active` for Obsidian compatibility (Obsidian mode)
  - Simplified format for Markdown mode: `HH:MM:SS {entry_content}`
- **Description:** Application runs as Windows system service
- **Acceptance Criteria:**
  - Automatically starts with Windows boot
  - Runs in background without user login
  - Service can be managed via Windows Services console
  - Automatic restart on crash (max 5 attempts)
  - Clean shutdown handling

### FR-008: Windows Service Integration
- **Description:** Application runs as Windows system service
- **Acceptance Criteria:**
  - Automatically starts with Windows boot
  - Runs in background without user login
  - Service can be managed via Windows Services console
  - Automatic restart on crash (max 5 attempts)
  - Clean shutdown handling
  - Works consistently across both Obsidian and Markdown modes
- **Description:** User control over application lifecycle
- **Acceptance Criteria:**
  - Close button that completely exits application
  - Hide/show window functionality
  - System tray integration (optional)
  - Confirmation dialog for quit action

### FR-009: Vault Configuration and Setup
- **Description:** First-time vault configuration and management
- **Acceptance Criteria:**
  - Startup wizard prompts for Obsidian vault path on first run
  - Vault path validation (must contain `.obsidian` folder)
  - Option to "Remember this vault" with checkbox
  - Ability to change vault path through settings/menu
  - Auto-detection suggestions for common vault locations
  - Clear error messages for invalid vault paths
  - Fallback to manual folder selection if no vault detected

### FR-010: Dynamic Folder Selection
- **Description:** Real-time folder selection within the vault
- **Acceptance Criteria:**
  - Dropdown/button in floating window for folder selection
  - Lists all folders within the selected vault
  - Shows folder hierarchy (nested folders with indentation)
  - "Create new folder" option in dropdown
  - Selected folder persists until manually changed
  - Files created in: `{vault_path}/{selected_folder}/actives-YYYYMMDD.md`
  - Root vault option (no subfolder)
  - Refresh folder list when vault structure changes
- **Description:** Allow users to undo recently submitted notes
- **Acceptance Criteria:**
  - Undo button appears immediately after successful note submission
  - Button visible for 10 seconds, then auto-hides
  - Clicking undo removes the last submitted line from the daily file
  - Keyboard shortcut Ctrl+Z triggers undo (within 10-second window)
  - Visual confirmation when undo is successful
  - Only one level of undo supported (last submission only)
  - Undo restores the note text to input field for editing
  - Undo unavailable after 10 seconds or new note submission

### FR-012: Obsidian Integration and Navigation
- **Description:** Direct integration with Obsidian application for seamless bullet journal workflow
- **Acceptance Criteria:**
  - "Open in Obsidian" button/icon in floating window
  - Opens Obsidian to the current vault if not already open
  - Navigates to the current daily file (actives-YYYYMMDD.md)
  - Focuses on the last submitted entry
  - Uses Obsidian URI scheme: `obsidian://open?vault=X&file=Y`
  - Fallback to opening vault folder if Obsidian URI fails
  - Button shows appropriate state (Obsidian running/not running)
  - Optional: Auto-switch to current folder in Obsidian file explorer
- **Description:** Real-time folder selection within the vault
- **Acceptance Criteria:**
  - Dropdown/button in floating window for folder selection
  - Lists all folders within the selected vault
  - Shows folder hierarchy (nested folders with indentation)
  - "Create new folder" option in dropdown
  - Selected folder persists until manually changed
  - Files created in: `{vault_path}/{selected_folder}/actives-YYYYMMDD.md`
  - Root vault option (no subfolder)
  - Refresh folder list when vault structure changes
- **Description:** Comprehensive logging for troubleshooting
- **Acceptance Criteria:**
  - Service logs with timestamps and severity levels
  - Application logs for note operations
  - Error tracking and reporting
  - Log rotation to prevent disk space issues
  - Configurable log levels (DEBUG, INFO, WARN, ERROR)

## Non-Functional Requirements

### NFR-001: Performance
- **Startup Time:** Application window appears within 2 seconds of service start
- **Response Time:** Note submission completes within 500ms
- **Memory Usage:** Maximum 100MB RAM usage during normal operation
- **CPU Usage:** Less than 1% CPU when idle

### NFR-002: Reliability
- **Uptime:** 99.9% availability during normal operation
- **Data Integrity:** Zero data loss during normal shutdown
- **Error Recovery:** Automatic recovery from transient failures
- **Crash Resilience:** Service restarts automatically on failure

### NFR-003: Usability
- **Learning Curve:** New users productive within 5 minutes
- **Accessibility:** Keyboard-only operation supported
- **Visual Design:** Clean, minimalist interface
- **Feedback:** Clear status indicators for all operations

### NFR-004: Compatibility
- **OS Support:** Windows 10 version 1809 or newer
- **Node.js:** Version 18 or newer
- **Electron:** Version 28 or newer
- **File System:** NTFS, exFAT support

## Technical Architecture

### TA-001: Application Structure
```
Main Process (Electron)
├── Mode Detection & Setup
├── Window Manager
├── File Operations (Mode-Specific)
├── Configuration Manager
└── IPC Handler

Service Wrapper
├── Process Monitor
├── Auto-restart Logic
├── Logging System
└── Health Checks

Renderer Process
├── Setup Wizard
├── UI Components (Mode-Aware)
├── Event Handlers
└── Status Management
```

### TA-002: Data Flow
**Obsidian Mode:**
1. User types bujo entry in floating window
2. Enter key triggers entry submission
3. Main process receives entry via IPC
4. Timestamp added and Obsidian format applied (`HH:MM:SS #active {entry}`)
5. Entry appended to daily file in vault
6. Success/failure feedback to UI
7. Undo button appears with 10-second timer
8. Operation logged to service log

**Markdown Mode:**
1. User types bujo entry in floating window
2. Enter key triggers entry submission
3. Main process receives entry via IPC
4. Timestamp added and simple format applied (`HH:MM:SS {entry}`)
5. Entry appended to daily file in selected folder
6. Success/failure feedback to UI
7. Undo button appears with 10-second timer
8. Operation logged to service log

**Setup Flow:**
1. Application starts and detects Obsidian installation
2. Scans for .obsidian folders in common locations
3. Presents setup wizard with recommendations
4. User selects mode and configuration
5. Settings saved and main window launched

**Undo Flow:**
1. User clicks undo button or presses Ctrl+Z
2. Last entry removed from daily file
3. Entry text restored to input field
4. Visual confirmation of undo action
5. Undo button disappears

**Obsidian Integration Flow (Obsidian Mode Only):**
1. User clicks "Open in Obsidian" button
2. Application constructs Obsidian URI with vault and file parameters
3. System opens URI (launches/focuses Obsidian)
4. Obsidian navigates to specified vault and daily file

### TA-003: Configuration
- **Config File:** JSON format in application directory
- **User Settings:** Window position, size, selected mode
- **Mode-Specific Settings:** 
  - Obsidian Mode: Vault path, vault name
  - Markdown Mode: Target folder path
- **Service Settings:** Log levels, restart attempts, health check interval

## User Stories

### US-001: Quick Note Capture
**As a** researcher reading articles  
**I want** to quickly jot down insights without leaving my browser  
**So that** I don't lose my train of thought or interrupt my reading flow

### US-002: Meeting Notes
**As a** participant in video calls  
**I want** to capture action items while staying focused on the meeting  
**So that** I can reference them later in my note-taking system

### US-003: Code Documentation
**As a** developer working in an IDE  
**I want** to note bugs or ideas without switching applications  
**So that** I can maintain focus on coding while capturing important thoughts

### US-005: Organized Bujo Management
**As an** Obsidian user with multiple projects  
**I want** to quickly switch between different folders for my bujo entries  
**So that** my captured thoughts are automatically organized by project or topic

### US-007: Quick Error Correction
**As a** user who types quickly and makes mistakes  
**I want** to undo a bujo entry submission I just made  
**So that** I can correct typos or incomplete thoughts without manually editing the file

### US-008: Seamless Obsidian Workflow
**As an** Obsidian power user  
**I want** to quickly jump from my captured bujo entry to the full Obsidian interface  
**So that** I can expand on my quick entry or continue working in my main bullet journaling environment

### US-009: Entry Review and Expansion
**As a** bullet journalist capturing quick insights  
**I want** to open my daily bujo file in Obsidian after capturing several thoughts  
**So that** I can review, organize, and expand on my captured ideas
**As a** new user setting up the application  
**I want** the app to help me find and configure my Obsidian vault  
**So that** I can start capturing notes immediately without technical hassle
**As a** gamer playing fullscreen games  
**I want** to note strategies or observations without alt-tabbing  
**So that** I can improve my gameplay while staying immersed

## Corrected MVP Implementation Phases

### Phase 1: Core System-Wide Functionality (Critical MVP)
**Always-floating is THE core feature - without it, this is just another note app**
- **FR-002: System-Wide Floating Window** (CRITICAL - Primary value proposition)
- **FR-003: Bujo Input Interface** (Text input and basic formatting)
- **FR-007: Entry Formatting** (Timestamp and hashtag formatting)
- **FR-005 OR FR-006: File Management** (Start with one mode - Obsidian OR Markdown)

### Phase 2: Enhanced User Experience
- **FR-001: Dual-Mode Setup** (Setup wizard and mode detection)
- **FR-004: Advanced Window Management** (Resize, positioning, persistence)
- **FR-010: Entry Undo Functionality** (10-second undo window)
- **FR-014: Global Hotkey Management** (System-wide keyboard shortcuts)

### Phase 3: Service Integration and Advanced Features
- **FR-008: Windows Service Integration** (Auto-start, background operation)
- **FR-011: Obsidian Integration** (URI scheme, external app launching)
- **FR-012: Logging and Monitoring** (Comprehensive error tracking)
- **FR-013: Security and Permissions** (Enhanced security measures)
- **FR-015: Professional Installation** (MSI installer, service setup)

## Success Metrics

### Phase 1: Core System-Wide Functionality (Critical MVP)
**Always-floating is THE core feature - without it, this is just another note app**
- **FR-002: System-Wide Floating Window** (CRITICAL - Primary value proposition)
- **FR-003: Bujo Input Interface** (Text input and basic formatting)
- **FR-007: Entry Formatting** (Timestamp and hashtag formatting)
- **FR-005 OR FR-006: File Management** (Start with one mode - Obsidian OR Markdown)

### Phase 2: Enhanced User Experience
- **FR-001: Dual-Mode Setup** (Setup wizard and mode detection)
- **FR-004: Advanced Window Management** (Resize, positioning, persistence)
- **FR-010: Entry Undo Functionality** (10-second undo window)
- **FR-014: Global Hotkey Management** (System-wide keyboard shortcuts)

### Phase 3: Service Integration and Advanced Features
- **FR-008: Windows Service Integration** (Auto-start, background operation)
- **FR-011: Obsidian Integration** (URI scheme, external app launching)
- **FR-012: Logging and Monitoring** (Comprehensive error tracking)
- **FR-013: Security and Permissions** (Enhanced security measures)
- **FR-015: Professional Installation** (MSI installer, service setup)

### Adoption Metrics
- **Download Rate:** Target 100 downloads in first month
- **Retention:** 70% of users still using after 1 week
- **Community:** 10 GitHub stars in first month

### Usage Metrics
- **Daily Entries:** Average 20+ bujo entries per active user per day
- **Session Duration:** Application runs for full workday (8+ hours)
- **Crash Rate:** Less than 1 crash per 100 hours of operation

### Quality Metrics
- **Bug Reports:** Less than 5 bugs per 100 users
- **Support Requests:** Less than 10% of users need setup help
- **User Satisfaction:** 4.5+ stars in community feedback

## Future Enhancements (Out of Scope for v1.0)

### Phase 2 Features
- **Multiple Note Templates:** Different formats for different use cases
- **Export Options:** PDF, plain text, other formats
- **Sync Integration:** Cloud backup and sync across devices
- **Plugin System:** User-extensible functionality

### Phase 3 Features
- **Mobile Companion:** iOS/Android quick capture
- **Voice Notes:** Speech-to-text integration
- **AI Integration:** Smart tagging and organization
- **Team Features:** Shared note streams

## Constraints and Assumptions

### Technical Constraints
- Windows-only for initial release
- **Standalone Electron application** (not an Obsidian plugin)
- Requires administrator privileges for service installation
- Obsidian mode requires Obsidian installation (validated during setup)
- Markdown mode works with any folder structure
- External integration with Obsidian via URI scheme and file system

### Business Constraints
- Open source development model
- No budget for third-party services
- Community-driven feature development

### Assumptions
- Obsidian users have basic vault knowledge
- Markdown users understand folder organization
- Users comfortable with simple setup wizard
- Primary use case is individual productivity (not team collaboration)

## Definition of Done

A feature is considered complete when:
- [ ] All acceptance criteria met
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] Manual testing completed
- [ ] Performance criteria verified