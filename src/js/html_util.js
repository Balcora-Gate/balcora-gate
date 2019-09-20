export function unescapeHtml (unsafe) {
	if (!unsafe) { return ''; }
	return unsafe
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#039;/g, "'");
}
// # sourceMappingURL=html_util.js.map
