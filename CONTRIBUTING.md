# Contributing to Floating Bujo
## A Claude-Assisted Open Source Project

Welcome to pioneering the future of collaborative software development! 🚀

Floating Bujo uses a **Claude-assisted development workflow** where Claude Code handles implementation while humans focus on requirements engineering, validation, and integration.

## 🎯 Why Claude-Assisted Development?

Traditional open source: Human writes code → Human reviews code → Merge
**Claude-assisted approach:** Human refines requirements → Claude Code implements → Human validates → Integrate

This approach allows contributors to focus on **problem-solving and design thinking** rather than syntax and boilerplate, while leveraging AI for consistent, high-quality code generation.

## 🛠️ Prerequisites

### Required Tools
- **Claude Code** installed in your IDE ([Installation Guide](https://docs.anthropic.com))
- **Git** and **GitHub** account
- **Node.js** 18+ for local testing
- **Basic understanding** of our [REQUIREMENTS.md](./REQUIREMENTS.md)

### Recommended Knowledge
- Requirements engineering principles
- Electron/JavaScript basics (helpful but not required)
- Prompt engineering fundamentals

## 🚀 Contribution Paths

We welcome four types of contributions, each leveraging Claude in different ways:

### Path 1: Requirements Enhancement 📋
**Perfect for:** Domain experts, UX thinkers, bullet journal enthusiasts

**What you do:**
1. Choose a Functional Requirement (FR) that needs more detail
2. Use Claude to analyze user scenarios and edge cases
3. Enhance acceptance criteria with specific, testable conditions
4. Submit refined requirements for implementation

**Example Enhancement:**
```markdown
# Before
FR-003: "Resizable window with min/max constraints"

# After (Your Enhancement)
FR-003: "Resizable window with constraints"
- Minimum size: 300x80 pixels
- Maximum size: 800x400 pixels
- Resize handles: Bottom-right corner + all edges
- Snap-to-edge: Within 20px of screen boundaries
- Keyboard shortcuts: Ctrl+R (reset), Ctrl+Plus/Minus (resize)
- Preserve aspect ratio when Shift key held during resize
- Window position saved on resize completion
```

**Claude Prompt Example:**
```
Analyze FR-003 for a floating note-taking window. What edge cases, user scenarios, 
and specific constraints should be considered for window resizing? Focus on 
accessibility, user experience, and technical feasibility.
```

### Path 2: Claude Code Implementation 💻
**Perfect for:** Developers curious about AI-assisted coding, prompt engineers

**What you do:**
1. Take a refined FR with detailed acceptance criteria
2. Use Claude Code to implement the feature
3. Document your prompting approach and iterations
4. Submit both working code and methodology notes

**Workflow Example:**
```bash
# 1. Analyze the requirement
claude code analyze --requirement "FR-003"

# 2. Generate initial implementation
claude code create window-manager --spec "resizable window with constraints min:300x80 max:800x400"

# 3. Add specific features iteratively
claude code add feature snap-to-edge --threshold "20px"
claude code add feature keyboard-shortcuts --keys "Ctrl+R,Ctrl+Plus,Ctrl+Minus"

# 4. Generate tests
claude code test window-manager --coverage-target "90%"

# 5. Document patterns
claude code document implementation-approach --output "patterns/window-management.md"
```

**What to Include in Your PR:**
- Working implementation code
- Test cases and results
- Documentation of successful prompts
- Any prompt iterations or refinements discovered
- Integration notes for other contributors

### Path 3: Quality Assurance & Integration 🔍
**Perfect for:** Experienced developers, testing specialists, integration experts

**What you do:**
1. Test Claude-generated implementations thoroughly
2. Identify edge cases and integration challenges
3. Provide human validation and debugging
4. Ensure code quality and maintainability standards

**Focus Areas:**
- **Cross-platform testing** (Windows versions, different setups)
- **Integration testing** between Claude-generated modules
- **Performance validation** against requirements metrics
- **Security review** of generated code
- **Accessibility compliance** checking
- **User experience validation**

**Testing with Claude:**
```bash
# Generate comprehensive test scenarios
claude code create test-scenarios --requirement "FR-003" --edge-cases

# Analyze performance implications
claude code analyze performance --implementation "window-manager.js"

# Generate integration test suite
claude code test integration --modules "window-manager,file-operations"
```

### Path 4: Prompt Engineering & Patterns 🎨
**Perfect for:** AI enthusiasts, prompt engineers, methodology developers

**What you do:**
1. Experiment with different Claude Code approaches
2. Optimize prompt patterns for better code generation
3. Document successful methodologies
4. Help refine our Claude-assisted development process

**Areas to Explore:**
- **Requirement-to-code translation** patterns
- **Iterative refinement** techniques
- **Testing strategy** prompts
- **Code review** automation with Claude
- **Documentation generation** patterns

**Pattern Documentation Format:**
```markdown
## Pattern: Feature Implementation from FR

### Context
Implementing a new feature from detailed functional requirement

### Prompt Template
```
Implement [FEATURE] based on requirement [FR-XXX]. 

Requirements:
- [Specific acceptance criteria]
- [Technical constraints]
- [Integration points]

Generate:
1. Core implementation
2. Unit tests
3. Integration hooks
4. Error handling
```

### Success Indicators
- Generated code passes all acceptance criteria
- Tests achieve >90% coverage
- Integration points clearly defined
- Error handling comprehensive

### Learned Optimizations
[Document what worked well and what didn't]
```

## 📁 Project Structure for Contributors

```
floating-bujo/
├── REQUIREMENTS.md           # Single source of truth for features
├── CONTRIBUTING.md          # This file
├── src/
│   ├── main/               # Electron main process
│   ├── renderer/           # UI components
│   └── shared/             # Shared utilities
├── docs/
│   ├── claude-patterns/    # Successful prompt patterns
│   ├── implementation/     # Claude Code methodologies
│   └── integration/        # Human validation approaches
├── tests/
│   ├── claude-generated/   # Tests created by Claude Code
│   └── integration/        # Human-written integration tests
└── .github/
    ├── ISSUE_TEMPLATE/     # Structured contribution requests
    └── workflows/          # CI/CD including Claude Code validation
```

## 🔄 Claude-Native Workflow

### For Requirements Enhancement:
1. **Choose an FR** from our [contribution board](../../issues?q=is%3Aissue+is%3Aopen+label%3Arequirements-enhancement)
2. **Analyze with Claude** to identify gaps and improvements
3. **Create detailed enhancement** with specific acceptance criteria
4. **Submit PR** with enhanced requirement specification
5. **Collaborate on refinement** with maintainers and community

### For Implementation:
1. **Select refined FR** marked as `ready-for-implementation`
2. **Set up local environment** following our setup guide
3. **Use Claude Code** to implement according to acceptance criteria
4. **Document your approach** including successful prompts and iterations
5. **Test thoroughly** using both generated and manual test cases
6. **Submit PR** with implementation + methodology documentation

### For Quality Assurance:
1. **Choose implementation PR** needing validation
2. **Set up test environment** and run comprehensive tests
3. **Use Claude** to help generate edge case scenarios
4. **Validate against requirements** and provide feedback
5. **Approve or request changes** with detailed notes

## 🏷️ Issue Labels and Organization

- `requirements-enhancement` - FRs needing more detail
- `ready-for-implementation` - Refined requirements ready for Claude Code
- `claude-code-implementation` - Implementation using Claude Code
- `human-validation-needed` - Code ready for quality assurance
- `prompt-engineering` - Methodology and pattern improvements
- `good-first-claude` - Beginner-friendly Claude Code tasks
- `integration-challenge` - Complex human validation required

## 📚 Learning Resources

### Claude Code Mastery
- [Official Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [Our Successful Patterns Repository](./docs/claude-patterns/)
- [Requirements Engineering with Claude](./docs/requirements-with-claude.md)

### Project-Specific Guides
- [Setting Up Development Environment](./docs/setup-guide.md)
- [Understanding Our Requirements Structure](./REQUIREMENTS.md)
- [Floating Bujo Architecture Overview](./docs/architecture.md)

## 🤝 Community Guidelines

### Code of Conduct
We follow the [Contributor Covenant](CODE_OF_CONDUCT.md). This is a learning environment where we're all experimenting with new development methodologies together.

### Communication Channels
- **GitHub Issues** - Primary collaboration space
- **GitHub Discussions** - Methodology discussions and Q&A
- **Pull Requests** - Code and requirements review
- **Documentation** - Shared learning and pattern development

### Review Process
1. **Requirements PRs** - Reviewed for clarity, completeness, and implementability
2. **Implementation PRs** - Reviewed for functionality, methodology documentation, and integration
3. **Quality Assurance** - Comprehensive testing by human validators
4. **Methodology Documentation** - Peer review of prompt patterns and approaches

## 🎯 Current Contribution Opportunities

### High Priority (Ready for Implementation)
- [ ] **FR-002: System-Wide Floating Window** - Core window management
- [ ] **FR-003: Bujo Input Interface** - Text input and formatting
- [ ] **FR-007: Entry Formatting** - Dual-mode timestamp formatting

### Needs Requirements Enhancement
- [ ] **FR-001: Dual-Mode Setup** - More detailed wizard flow needed
- [ ] **FR-011: Obsidian Integration** - URI scheme specifics required
- [ ] **FR-012: Logging and Monitoring** - Log format and rotation details

### Quality Assurance Needed
- [ ] **Window Management** - Cross-platform testing required
- [ ] **File Operations** - Edge case validation needed
- [ ] **Service Integration** - Windows service behavior verification

### Prompt Engineering Opportunities
- [ ] **Electron-specific patterns** - Optimize for Electron app generation
- [ ] **Test generation patterns** - Better automated test creation
- [ ] **Integration patterns** - Seamless module connection approaches

## 🚀 Getting Started

1. **Read our [REQUIREMENTS.md](./REQUIREMENTS.md)** to understand the project vision
2. **Choose your contribution path** based on your interests and skills
3. **Join the conversation** in [GitHub Discussions](../../discussions)
4. **Pick your first issue** from our [contribution board](../../issues)
5. **Set up Claude Code** and start experimenting!

## 📈 Success Metrics for Contributors

We're tracking the success of our Claude-assisted approach:

### Individual Contribution Success
- **Requirements Enhancement** - Clear, implementable acceptance criteria
- **Claude Code Implementation** - Working code that passes all acceptance criteria
- **Quality Assurance** - Thorough validation with clear feedback
- **Prompt Engineering** - Documented patterns that others can reuse

### Community Success
- **Methodology Documentation** - Growing library of successful approaches
- **Knowledge Sharing** - Contributors learning from each other's techniques
- **Project Velocity** - Faster development through effective Claude Code usage
- **Innovation** - New patterns and approaches that advance Claude-assisted development

## 🎉 Recognition

Contributors who help pioneer this Claude-assisted approach will be:
- **Featured in project documentation** as methodology pioneers
- **Credited in blog posts and talks** about Claude-assisted development
- **Invited to co-author** case studies and methodology papers
- **Given maintainer status** for significant methodology contributions

---

**Ready to make history?** Choose your path and start contributing to the future of open source development!

Questions? Start a [discussion](../../discussions) or reach out in your first PR. We're all learning this together! 🌟