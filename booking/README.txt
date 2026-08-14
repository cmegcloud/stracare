STRA CARE split build

Files:
- index.html          Main markup
- styles.css          Original embedded CSS
- pwa-register.js     Original service-worker registration code
- firebase.js         Original Firebase/Firestore module
- app.js              Original UI/PWA/GPS/ticket logic
- index-original.html Untouched original source for verification

Important:
The original relative paths (assets/, photos/, manifest.json, sw.js, policy.html, etc.)
are intentionally unchanged. Put this split build in the same directory as those
existing STRA CARE files/folders.

No Firebase collection names, field names, payment details, branch/contact details,
DOM IDs, form fields, or application logic were intentionally changed.
