// Fragment Submission Helper
// Generates GitHub issue URL for fragment submissions

/**
 * Create GitHub issue URL for fragment submission
 * @param {Object} fragment - Fragment object
 * @param {string} repoOwner - GitHub username
 * @param {string} repoName - GitHub repository name
 * @returns {string} GitHub issue URL
 */
export function createFragmentSubmissionURL(fragment, repoOwner = 'pcrosby-1990', repoName = 'vet4net-forensics') {
  const baseURL = `https://github.com/${repoOwner}/${repoName}/issues/new`;
  
  // Build issue title
  const title = `Fragment Submission: ${fragment.text.slice(0, 50)}${fragment.text.length > 50 ? '...' : ''}`;
  
  // Build issue body
  const body = `## 🕯️ Fragment Submission

**Submitted by:** ${fragment.witness || 'Anonymous'}
**Date:** ${new Date().toISOString()}

---

### Fragment Content

\`\`\`
${fragment.text}
\`\`\`

### Sigils/Tags
${fragment.sigils.map(s => `- ${s}`).join('\n')}

---

### Metadata

- **Collapse Risk:** ${fragment.collapseRisk || 'soft'}
- **Breathline:** ${fragment.breathline || 'None'}
- **Witness:** ${fragment.witness || 'Anonymous'}
- **Timestamp:** ${fragment.timestamp}

---

### Why This Fragment Matters

<!-- Optional: Explain why you think this belongs in the Codex -->

---

### Additional Context

<!-- Any other context, inspirations, or connections to existing fragments -->

---

**Note:** This fragment was submitted through the Codex Fragment Editor. The steward (Patrick) will review and may incorporate it into the permanent Codex if it aligns with sanctuary principles. 🜎
`;

  // Encode parameters
  const params = new URLSearchParams({
    template: 'fragment-submission.md',
    title: title,
    body: body,
    labels: 'fragment-submission,needs-review'
  });

  return `${baseURL}?${params.toString()}`;
}

/**
 * Open fragment submission in new tab
 */
export function submitFragmentToGitHub(fragment) {
  const url = createFragmentSubmissionURL(fragment);
  window.open(url, '_blank', 'noopener,noreferrer');
}

export default {
  createFragmentSubmissionURL,
  submitFragmentToGitHub
};
