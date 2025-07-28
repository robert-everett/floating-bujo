# GitHub Issue Content

**Title:** Large executable distribution method needed

**Description:**

The compressed Windows executable (floating-bujo-win32-x64.tar.gz) is 119MB, which exceeds GitHub's 100MB file size limit.

Need to implement alternative distribution method:
- GitHub Releases with large file support
- External hosting solution  
- Build instructions for users to compile locally

Current workaround: Users can build locally using `npm run package:zip`

**Labels:** enhancement, distribution