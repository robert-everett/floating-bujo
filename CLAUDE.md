# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an early-stage Obsidian plugin project for creating a priority floating bullet window for note taking. The repository currently contains only basic project setup files.

## Current State

The repository is in initial setup phase with:
- Basic README describing the plugin concept
- MIT License
- No source code, build configuration, or package files yet

## Development Setup

This project will need standard Obsidian plugin development setup:
- TypeScript for plugin development
- Node.js package management
- Obsidian plugin build toolchain
- manifest.json for plugin metadata

## Next Steps for Development

Future development will require:
1. Setting up TypeScript/Node.js build environment
2. Creating main plugin entry point
3. Implementing floating window UI components
4. Adding bullet journal functionality
5. Plugin manifest and build configuration

## Architecture Notes

As an Obsidian plugin, this will follow the standard plugin architecture:
- Main plugin class extending Obsidian's Plugin class
- UI components for floating windows
- Integration with Obsidian's workspace and note management APIs
- Settings and configuration management

# Claude Code Guidelines for Floating Bujo

## Documentation Style
- Write like you're explaining to a colleague, not marketing to customers
- Use plain, direct language - no corporate-speak or dramatic phrases
- Minimal formatting - only use headers/formatting when it adds clarity
- Get straight to the point - skip introductory fluff
- Focus on technical decisions and practical implementation

## Code Comments
- Explain why, not what (code shows what)
- Keep comments short and practical
- No ASCII art or decorative formatting
- Document non-obvious business logic and decisions

## Examples
❌ Avoid: "🚀 Revolutionary Implementation Strategy for Cutting-Edge Security! 💪"
✅ Use: "Security fixes: enable context isolation, disable node integration"

❌ Avoid: "This comprehensive, enterprise-grade security implementation..."
✅ Use: "Add input validation to prevent code injection"