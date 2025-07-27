```
# Contributing Guide
- Draft state / accepting suggestions

Floating Bujo uses a Claude-assisted workflow: humans define and refine requirements, Claude Code generates implementation, and humans validate and integrate (for now).

## Workflow Overview

1. **Requirements**: Humans specify or enhance functional requirements with clear, testable acceptance criteria.  
2. **Implementation**: Claude Code generates code based on those criteria.  
3. **Validation**: Humans review, test, and integrate the generated code.  

This division lets contributors focus on design, edge cases, and validation rather than boilerplate.

## Prerequisites

- **Tools**  
  - Claude Code extension in your IDE ([install guide](https://docs.anthropic.com))  
  - Git and a GitHub account  
  - Node.js 18+ for local testing  
- **Knowledge**  
  - Requirements-engineering fundamentals  
  - Electron and JavaScript basics  
  - Prompt-engineering concepts  
  - Programming expertise (optional, for human audits)

## Pull Requests & Contribution Paths
1. Requirements Enhancement
2. Code Implementation
3. Quality Assurance
4. Prompt Engineering

## Project Structure

```
floating-bujo/
├── REQUIREMENTS.md
├── CONTRIBUTING.md
├── src/
│   ├── main/
│   ├── renderer/
│   └── shared/
├── docs/
│   ├── claude-patterns/
│   ├── implementation/
│   └── integration/
├── tests/
│   ├── claude-generated/
│   └── integration/
└── .github/
    ├── ISSUE_TEMPLATE/
    └── workflows/
```

## Labels

* `requirements-enhancement`
* `ready-for-implementation`
* `claude-code-implementation`
* `human-validation-needed`
* `prompt-engineering`
* `needs-testing`
* `ready-for-integration`

## Getting Started

1. Review **REQUIREMENTS.md**.
2. Choose a contribution path.
3. Find issues with the appropriate label.
5. Submit a PR with code, tests, and documentation.
```