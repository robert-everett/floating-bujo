# Floating Bujo - Requirements Specification

## Project Overview

**Name:** Floating Bujo  
**Version:** 1.0.0  
**Target Platform:** Windows 10/11  
**Framework:** Electron + Node.js  
**License:** MIT  

**Description:** A standalone system-wide Electron application that enables seamless bullet journal note capture without interrupting workflow. Works with any markdown system through simple file management.

## Core Value Proposition

- **Standalone desktop application** - Independent Electron app
- **Zero-friction bullet journaling** - Always accessible, minimal interface
- **System-wide availability** - Works over any application (browsers, games, IDEs)
- **Universal markdown support** - Works with any folder structure or markdown system
- **Principled simplicity** - Capture thoughts instantly without configuration complexity

## Functional Requirements

### FR-002: System-Wide Floating Window ✅ IMPLEMENTED
- **Description:** Application shall provide an always-visible floating window
- **Implementation Status:** COMPLETE - DPI-aware floating window with global shortcuts and session persistence
- **Acceptance Criteria:**
  - ✅ Window appears above ALL other applications (browsers, games, fullscreen apps)
  - ✅ Window remains accessible regardless of current application focus
  - ✅ Window persists across user sessions
  - ✅ User can interact with window without losing focus from current application
  - ✅ Global keyboard shortcuts (Ctrl+Shift+N show, Ctrl+Shift+H hide)
  - ✅ DPI-aware scaling for high-resolution displays
  - ✅ Smart positioning to prevent off-screen placement

### FR-003: Bujo Input Interface ✅ IMPLEMENTED
- **Description:** Simple, intuitive bullet journal entry mechanism
- **Implementation Status:** COMPLETE - Auto-expanding textarea with full keyboard shortcuts and visual feedback
- **Acceptance Criteria:**
  - ✅ Single text input field with placeholder text "Entry..."
  - ✅ Support for multi-line entries (auto-expanding textarea)
  - ✅ Enter key submits entry, Escape clears input
  - ✅ Visual feedback for successful/failed saves
  - ✅ Current mode and target location displayed in window
  - ✅ Status indicator for connection/file access
  - ✅ Undo button appears for 30 seconds after successful submission
  - ✅ Ctrl+Z keyboard shortcut for undo last submission
  - ✅ Auto-expanding animation with smooth transitions
  - ✅ Real-time status updates and error handling

### FR-004: Window Management ✅ IMPLEMENTED
- **Description:** User control over window appearance and position  
- **Implementation Status:** COMPLETE - Full window management with DPI awareness and persistence
- **Acceptance Criteria:**
  - ✅ Draggable window (click and drag to reposition)
  - ✅ Resizable window with minimum/maximum size constraints
  - ✅ Reset to default size button (via IPC)
  - ✅ Position and size persistence across sessions
  - ✅ Always-on-top functionality enabled by default
  - ✅ Consistent window management across both modes
  - ✅ DPI-aware scaling for different screen resolutions
  - ✅ Smart bounds checking to prevent off-screen windows

### FR-005: File Management ✅ IMPLEMENTED
- **Description:** Simple folder-based file management for markdown systems
- **Implementation Status:** COMPLETE - Universal folder management with validation and persistence
- **Acceptance Criteria:**
  - ✅ User selects target folder during setup wizard
  - ✅ Folder selection persists across sessions
  - ✅ Daily files created with format: `actives-YYYYMMDD.md`
  - ✅ File created on first entry of the day
  - ✅ Subsequent entries append to existing daily file
  - ✅ Handles date transitions correctly (midnight rollover with local timezone)
  - ✅ Folder path validation and error handling
  - ✅ Support for network drives and cloud-synced folders
  - ✅ Default folder suggestions for user convenience
- **Description:** Consistent, searchable bullet journal entry format
- **Acceptance Criteria:**
  - Format: `HH:MM:SS #active {entry_content}`
  - Timestamp uses 24-hour format
  - Each entry on separate line
  - Preserves line breaks in multi-line entries
  - Hashtag `#active` for Obsidian compatibility

### FR-007: Bujo Entry Formatting ✅ IMPLEMENTED
- **Description:** Consistent, searchable bullet journal entry format
- **Implementation Status:** COMPLETE - Mode-specific formatting with proper timestamps and tagging
- **Acceptance Criteria:**
  - ✅ Format: `HH:MM:SS #active {entry_content}` (optional #active tag)
  - ✅ Timestamp uses 24-hour format with local timezone
  - ✅ Each entry on separate line
  - ✅ Preserves line breaks in multi-line entries
  - ✅ Optional hashtag `#active` for markdown system compatibility
  - ✅ Consistent timestamp generation with proper local time handling
- **Description:** Application runs as Windows system service
- **Acceptance Criteria:**
  - Automatically starts with Windows boot
  - Runs in background without user login
  - Service can be managed via Windows Services console
  - Automatic restart on crash (max 5 attempts)
  - Clean shutdown handling

### FR-011: Entry Undo Functionality ✅ IMPLEMENTED  
- **Description:** Allow users to undo recently submitted notes
- **Implementation Status:** COMPLETE - Robust undo system with file integrity validation
- **Acceptance Criteria:**
  - ✅ Undo button appears immediately after successful note submission
  - ✅ Button visible for 30 seconds, then auto-hides
  - ✅ Clicking undo removes the last submitted line from the daily file
  - ✅ Keyboard shortcut Ctrl+Z triggers undo (within time window)
  - ✅ Visual confirmation when undo is successful
  - ✅ Only one level of undo supported (last submission only)
  - ✅ Undo restores the note text to input field for editing
  - ✅ Undo includes 5-minute server-side time limit for safety
  - ✅ File integrity checking before undo operation

### FR-013: Comprehensive Logging ✅ IMPLEMENTED
- **Description:** Comprehensive logging for troubleshooting and monitoring
- **Implementation Status:** COMPLETE - Detailed logging with timestamps and error tracking
- **Acceptance Criteria:**
  - ✅ Service logs with timestamps and severity levels
  - ✅ Application logs for note operations
  - ✅ Error tracking and reporting
  - ✅ Log persistence to floating-notes.log file
  - ✅ Debug information for troubleshooting
  - ✅ Setup wizard and configuration change logging
  - ✅ Undo operation logging with detailed debug information

### FR-014: Desktop Application Distribution 🔄 IN PROGRESS
- **Description:** Provide standalone executable with proper system integration
- **Implementation Status:** IN PROGRESS - Config persistence fixed, packaging pending
- **Acceptance Criteria:**
  - ✅ Application uses user data directory for config persistence
  - ⏳ Application packages as standalone executable (.exe on Windows)
  - ⏳ Installation creates Start Menu entry with application icon
  - ⏳ Installation offers Desktop shortcut option
  - ⏳ Uninstaller removes all application files and registry entries
  - ⏳ Executable code-signed to prevent security warnings
  - ⏳ Installation completes without requiring administrator privileges
  - ⏳ Package size remains under 200MB
  - ⏳ Installation completes within 30 seconds

### FR-015: System Tray Integration 🔄 IN PROGRESS
- **Description:** Provide persistent system presence and quick access
- **Implementation Status:** IN PROGRESS - System tray integration implementation needed
- **Acceptance Criteria:**
  - ⏳ Application displays system tray icon when running
  - ⏳ Tray icon shows context menu with show/hide/quit options
  - ⏳ Application minimizes to tray instead of taskbar when minimized
  - ⏳ Tray icon tooltip shows application status
  - ⏳ Double-click tray icon shows/hides main window
- **Description:** User control over application lifecycle
- **Acceptance Criteria:**
  - Close button that completely exits application
  - Hide/show window functionality
  - System tray integration (optional)
  - Confirmation dialog for quit action

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

## Requirements Review 

**Status:** PENDING COMMUNITY FEEDBACK  
**Purpose:** Features identified during development but deferred for community input and prioritization after initial deployment

### RR-001: Windows Service Integration (formerly FR-008)
- **Description:** Application runs as Windows system service for automatic startup and background operation
- **Priority:** MEDIUM - Enhancement for enterprise/power users
- **Implementation Complexity:** HIGH - Requires service wrapper, installer changes, and Windows service management
- **Community Feedback Needed:**
  - Is automatic Windows startup important for your workflow?
  - Would you prefer manual startup control vs. always-running service?
  - Enterprise vs. personal use case preferences?
- **Acceptance Criteria:**
  - Automatically starts with Windows boot
  - Runs in background without user login
  - Service can be managed via Windows Services console
  - Automatic restart on crash (max 5 attempts)
  - Clean shutdown handling
### RR-002: Advanced Integration Features
- **Description:** Direct integration with external markdown applications
- **Priority:** LOW - Nice-to-have for power users
- **Implementation Complexity:** MEDIUM - Requires application detection and URI schemes
- **Community Feedback Needed:**
  - Would "Open in [App]" button functionality be valuable?
  - What external integrations would be most useful?
- **Potential Features:**
  - Integration with popular markdown editors
  - URI scheme support for external applications
  - File navigation to current daily note

### RR-003: Advanced Window Management
- **Description:** Enhanced window management features for power users
- **Priority:** LOW - Quality of life improvements
- **Implementation Complexity:** LOW-MEDIUM
- **Community Feedback Needed:**
  - Are additional window management features needed?
  - What window behaviors would improve your workflow?
- **Potential Features:**
  - System tray integration with context menu
  - Multiple window size presets
  - Window opacity/transparency controls
  - Snap-to-edge behaviors
  - Multi-monitor awareness and positioning

### RR-004: Enhanced Entry Management
- **Description:** Advanced entry management and organization features
- **Priority:** LOW-MEDIUM - Power user features
- **Implementation Complexity:** MEDIUM
- **Community Feedback Needed:**
  - Would entry search/filtering within the app be valuable?
  - Are custom entry templates needed?
  - What entry management features would improve productivity?
- **Potential Features:**
  - Search recent entries within floating window
  - Custom entry templates (meeting notes, ideas, tasks)
  - Entry categorization with custom tags
  - Quick entry history/review panel
  - Entry statistics and analytics

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

**Main Process (Electron)**
- Window Manager
- File Operations
- Configuration Manager
- IPC Handler

**Renderer Process**
- Setup Wizard
- UI Components
- Event Handlers
- Status Management

### TA-002: Data Flow

**Entry Capture Flow:**
1. User types bujo entry in floating window
2. Enter key triggers entry submission
3. Main process receives entry via IPC
4. Timestamp added and format applied (`HH:MM:SS [#active] {entry}`)
5. Entry appended to daily file in selected folder
6. Success/failure feedback to UI
7. Undo button appears with 10-second timer
8. Operation logged

**Setup Flow:**
1. Application starts on first launch
2. Presents setup wizard
3. User selects target folder for notes
4. User configures optional #active tag usage
5. Settings saved and main window launched

**Undo Flow:**
1. User clicks undo button or presses Ctrl+Z
2. Last entry removed from daily file
3. Entry text restored to input field
4. Visual confirmation of undo action
5. Undo button disappears

### TA-003: Configuration
- **Config File:** JSON format in user data directory
- **User Settings:** Window position, size, target folder
- **Application Settings:** 
  - Target folder path for notes
  - Optional #active tag usage
  - Setup completion status

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

## Implementation Status Summary

### ✅ COMPLETED - Core MVP (11/15 Requirements)
**Production-ready proof-of-concept with all essential features implemented**

**Phase 1: Core System-Wide Functionality** ✅ COMPLETE
- **FR-002: System-Wide Floating Window** ✅ IMPLEMENTED - DPI-aware floating window with global shortcuts
- **FR-003: Bujo Input Interface** ✅ IMPLEMENTED - Auto-expanding textarea with full keyboard support
- **FR-007: Entry Formatting** ✅ IMPLEMENTED - Flexible formatting with proper timestamps
- **FR-005: File Management** ✅ IMPLEMENTED - Universal folder-based file management

**Phase 2: Enhanced User Experience** ✅ COMPLETE  
- **FR-001: Setup Wizard** ✅ IMPLEMENTED - Simple setup wizard with folder selection
- **FR-004: Advanced Window Management** ✅ IMPLEMENTED - Complete window management with DPI awareness
- **FR-011: Entry Undo Functionality** ✅ IMPLEMENTED - Robust undo system with file integrity validation
- **FR-013: Comprehensive Logging** ✅ IMPLEMENTED - Detailed logging with error tracking

**Phase 3: Desktop Application Integration** 🔄 IN PROGRESS
- **FR-014: Desktop Application Distribution** 🔄 IN PROGRESS - Config persistence fixed, packaging pending
- **FR-015: System Tray Integration** 🔄 IN PROGRESS - System tray implementation needed

**Additional Implemented Features:**
- **Security Hardening** ✅ IMPLEMENTED - Context isolation, input validation, secure IPC
- **Smart Folder Management** ✅ IMPLEMENTED - Dynamic folder discovery and creation within vaults
- **Configuration Memory** ✅ IMPLEMENTED - Optional setup wizard bypass for returning users

### 📋 REQUIREMENTS REVIEW - Community Feedback Needed (2/15 Requirements)
**Features deferred for community input after initial deployment**
- **RR-001: Windows Service Integration** (formerly FR-008) - Auto-start and background service operation
- **RR-002: Direct Obsidian Integration** (formerly FR-012) - URI scheme and external app launching

## Success Metrics

### Current Implementation Success (MVP Core Complete)
**Target Status:** CORE ACHIEVED ✅  
**Implementation Completion:** 11/15 Core Requirements (73.3%)

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
- **Standalone Electron application**
- Standard user permissions sufficient for operation
- Works with any folder structure and markdown system
- Universal compatibility with markdown editors

### Business Constraints
- Open source development model
- No budget for third-party services
- Community-driven feature development

### Assumptions
- Users understand basic folder organization
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