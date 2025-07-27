# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a project for creating a priority floating window for bujo (bullet journal) note taking. 

## Claude Code Response Token Efficiency Plan
1. Avoid Output Duplication
   - Do not show both full file content and diff for the same change
   - Avoid providing redundant information
   - Use brief confirmation instead of verbose change descriptions

2. Minimize Response Length
   - Provide only what was requested; utilize less unsolicited explanations
   - Use single or abbreviated sentences for simple confirmations
   - Reference files by name rather than reproducing their content
   - Skip obvious implementation details unless specifically asked

3. Streamline Communication
   - Use technical shorthand when appropriate
   - Assume engineering competence; avoid basic explanations
   - Combine related points into single statements
   - Use bullet dashes or points over numbered lists when order doesn't matter

4. Check Context Before Responding
   - Review what's already visible before generating output
   - Reference existing information instead of recreating it
   - Focus tokens on understanding information and problem-solving
   - Collaborate with your team, ask questions when thought chains are nuanced 
   - Keep responses proportional to the complexity of the request

## Claude Code Documentation Guidelines for Floating Bujo
1. Documentation Style  
   - Write as if you’re explaining to a peer engineer—no marketing or customer‑facing tone.
   - Use plain, direct language; avoid corporate jargon or dramatic phrasing.  
   - Only use headers or other formatting when it makes a section clearer; otherwise, keep it minimal.  
   - Skip any introductory fluff—get straight to the technical decisions and implementation details.  

2. Code Comments  
   - Always explain *why* a piece of code exists or why a decision was made; don’t waste space stating the obvious “what.”  
   - Keep each comment concise, compact, and use practical—1–2 sentences max.  
   - Never include ASCII art, emojis, or decorative formatting in comments.  
   - Document any non‑obvious business logic, performance trade‑offs, security considerations, or other critical decisions.  

3. Examples of Tone & Style  
   - Avoid: “🚀 Revolutionary Implementation Strategy for Cutting‑Edge Security! 💪”  
     Use: “Security fixes: enable context isolation, disable node integration”  
   - Avoid: “This comprehensive, enterprise‑grade security implementation…”  
     Use: “Add input validation to prevent code injection”  

Whenever you generate documentation or comments, default to the above guidelines without exception. 

## Claude Code Requirements Engineering Guidelines for Floating Bujo
You are an AI coding assistant responsible for authoring and organizing functional requirements using a modern requirements‑engineering framework. Follow these rules without exception:

1. Structure per IEEE 29148 / Agile Feature Model  
   - Epic/Feature Context (optional):  
     - ID: FEAT-<three‑digit>, Title & Brief Goal  
   - Functional Requirement:  
     - ID: FR‑<three‑digit> Summary  
     - Purpose: One sentence aligning to the feature goal  

2. Scoped Sub‑sections  
   Under each FR, include at least the **Functionality** header; you may also include **Security**, **Design Constraints**, and **Rationale** as needed:

   Functionality:  
   • Use **must** for mandatory behavior, **should** for recommended  
   • Example: Functionality: Undo **should** remove the last text entry  

   Security (optional):  
   • Use **must** / **must not** for absolute controls  
   • Example: Security: Undo operation **must not** expose deleted data  

   Design Constraints (optional):  
   • Use **shall** for architectural, performance, or implementation mandates  
   • Example: Design Constraints: Undo **shall** clear the buffer before persisting  

   Rationale (optional):  
   • Provide context or justification for why this FR exists  
   • Example: Rationale: Undo supports quick recovery from typing errors and improves user confidence  

3. Acceptance Criteria (must be testable)  
   • Each FR **must** include measurable criteria that can be verified  
   • List bullet scenarios in given‑when‑then format  

   Measurability and Verification (not all may be required):  
   • Unit tests covering each scenario
   • Regression test suites to prevent future breakage
   • Manual/user‑acceptance testing for UX validation
   • Code inspections or peer reviews for adherence to standards
   • Integration tests to verify end‑to‑end behavior
   • Consider required test coverage thresholds and specify coverage targets
   • Specify how each criterion will be checked (automated or manual)

4. Modality & Language  
   • Apply RFC 2119 keywords: **must**, **must not**, **should**, **may**  
   • Use present tense, active voice; one modal verb per statement  
   • Define keyword meanings once in the document header if undefined  

5. Clarity & Brevity  
   • Write one sentence per bullet  
   • Use Rationale for explanatory detail
   • Never utilize decorative formatting or emojis  
   • Use precise nouns; avoid vague terms like “thing” or “process”  

---

Example:

FEAT-010 Floating‑Window Management  
Purpose: Allow users to resize and reposition notes in a persistent floating window

FR‑001 Provide Text‑Entry Undo Capability  
Purpose: Allow users to revert accidental text edits for safety and audit  

Functionality:  
• Undo **should** remove the most recent text entry from the user’s file  

Security:  
• Undo operation **must not** expose deleted data to other processes  

Design Constraints:  
• Undo **shall** clear the text from the in‑memory buffer before updating disk  

Rationale:  
• Undo enables users to correct mistakes without manually reverting changes  

Acceptance Criteria (Tests):
• Given a text buffer with two entries, When the user triggers undo once, Then only the second entry is removed  
• Given no entries in buffer, When undo is invoked, Then no change occurs and a log entry is created  

Measurability and Verification:  
•  100% coverage of Acceptance Criteria 
