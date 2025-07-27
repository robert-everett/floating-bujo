# Requirements Review Stage - Community Feedback Phase

**Date:** 2025-07-27  
**Purpose:** Gather community feedback on Priority 2+ features before implementation  
**Status:** Open for community input

## Overview

With Priority 1 MVP and FR-001 (Dual-Mode Setup) successfully implemented, the following features have been moved to the Requirements Review stage to gather community feedback and validate user needs before development.

## Features Under Community Review

### **FR-004: Advanced Window Management**
**Current Status:** Requirements Review  
**Proposed Features:**
- Enhanced resize and positioning controls
- Multi-monitor support and positioning
- Window snap-to-edge functionality
- Advanced persistence settings

**Community Questions:**
- Which window management features are most important to your workflow?
- How do you currently position floating windows on your desktop?
- Are there specific multi-monitor scenarios we should prioritize?

### **FR-010: Entry Undo Functionality**
**Current Status:** Requirements Review (Basic placeholder implemented)  
**Proposed Enhancements:**
- Complete undo implementation with file-level operations
- 10-second undo window with visual countdown
- Multiple undo levels
- Undo history persistence

**Community Questions:**
- How many undo levels would be useful? (1, 3, 5, unlimited?)
- Should undo persist between application sessions?
- What visual feedback would be most helpful for undo operations?

### **FR-014: Global Hotkey Management**
**Current Status:** Requirements Review  
**Proposed Features:**
- Customizable keyboard shortcuts
- Hotkey conflict detection
- System-wide shortcut registration management
- User-configurable key combinations

**Community Questions:**
- What keyboard shortcuts do you prefer for note capture?
- Do you need different shortcuts for different note types or modes?
- How important is automatic conflict detection vs manual configuration?

### **Performance and UX Enhancements**
**Current Status:** Requirements Review  
**Proposed Features:**
- Cross-application testing (games, fullscreen apps)
- System tray icon and enhanced system integration
- Enhanced error messages and user feedback
- Accessibility improvements (screen readers, keyboard navigation)

**Community Questions:**
- What applications do you primarily use floating notes with?
- What error scenarios have you encountered that need better handling?
- Are there accessibility features that would improve your experience?

## How to Provide Feedback

### **GitHub Discussions** (Primary Channel)
- Open discussions for each feature area
- Upvote/downvote specific proposals
- Share use cases and workflow details

### **Feature Request Template**
```markdown
## Feature: [Name]
**Use Case:** Describe your specific workflow need
**Current Workaround:** How do you handle this today?
**Proposed Solution:** Your suggested implementation
**Priority:** High/Medium/Low for your workflow
**Additional Context:** Screenshots, examples, edge cases
```

### **Community Voting**
Each feature under review will have:
- 📊 **Usage Poll** - How many users need this feature?
- 🎯 **Priority Survey** - Implementation order preferences  
- 💡 **Implementation Ideas** - Community-suggested approaches

## Review Criteria

Features will be evaluated based on:

### **User Impact**
- Number of users requesting the feature
- Workflow improvement potential
- Accessibility and inclusivity benefits

### **Implementation Complexity**
- Development effort required
- Security implications
- Testing and maintenance overhead

### **Strategic Alignment**
- Fits with core "zero-friction bullet journaling" mission
- Maintains simplicity and focused scope
- Enhances rather than complicates existing workflows

## Timeline

### **Phase 1: Community Input (4 weeks)**
- Gather feedback through GitHub discussions
- Conduct user surveys and polls
- Document use cases and requirements

### **Phase 2: Requirements Refinement (2 weeks)**
- Analyze community feedback
- Update feature specifications
- Prioritize implementation order

### **Phase 3: Implementation Planning (1 week)**
- Technical design for approved features
- Timeline and resource allocation
- Security and testing considerations

## Current Implementation Status

✅ **Completed (Ready for Production)**
- FR-002: System-Wide Floating Window
- FR-003: Bujo Input Interface  
- FR-007: Entry Formatting
- FR-005/006: Basic File Management
- FR-001: Dual-Mode Setup (Obsidian/Markdown)
- Security hardening and comprehensive testing

⏳ **Under Community Review**
- FR-004: Advanced Window Management
- FR-010: Enhanced Undo Functionality  
- FR-014: Global Hotkey Management
- Performance and UX enhancements

## Community Participation

This Requirements Review phase represents our commitment to community-driven development. Your feedback directly influences:

- **Feature prioritization** - Which capabilities get built first
- **Implementation approaches** - How features are designed and integrated
- **User experience decisions** - Interface and interaction patterns

**Your input matters!** Share your workflow needs, vote on priorities, and help shape the future of Floating Bujo.

---

**Join the conversation:** [GitHub Discussions](https://github.com/robert-everett/obsidian-floating-bujo-plugin/discussions)  
**Report issues:** [GitHub Issues](https://github.com/robert-everett/obsidian-floating-bujo-plugin/issues)  
**Documentation:** [Project Wiki](https://github.com/robert-everett/obsidian-floating-bujo-plugin/wiki)