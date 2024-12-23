# Link to jira ticket in github pr

Script that automatically converts JIRA ticket IDs in GitHub PR titles into clickable links.

## Features
- Detects JIRA ticket IDs (e.g., PROJ-123) in PR titles
- Converts them to clickable links pointing to your JIRA instance
- Updates dynamically when navigating between PRs
- Configurable JIRA domain

## Installation Options

### Option 1: Browser Extensions
Use these extensions to run the script:

1. **Tampermonkey**
2. **Javascript Injector**


### Option 2: Custom Extension Setup

1. Create directory with:

`manifest.json`:
```json
{
  "manifest_version": 3,
  "name": "GitHub JIRA Ticket Linker",
  "version": "1.0",
  "description": "Converts JIRA tickets in GitHub PR titles to clickable links",
  "permissions": [
    "activeTab"
  ],
  "content_scripts": [
    {
      "matches": ["https://github.com/*"],
      "js": ["content.js"]
    }
  ]
}
```

2. Add `content.js` with the script code
3. Load unpacked in Chrome extensions page

## Configuration

Modify JIRA domain:
```javascript
new GithubJiraTicket('https://your-domain.atlassian.net/browse/');
```

## Debug Mode
Set `isDebug: true` in constructor for console logging.
