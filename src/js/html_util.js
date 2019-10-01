import DomPurify from 'dompurify';
export const unescapeHtml = (unsafe) => {
	if (!unsafe) { return ''; }
	return unsafe
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#039;/g, "'");
};
export const standardPurify = (html) => {
	return DomPurify.sanitize(html, {
		FORBID_TAGS: [
			`style`,
			`form`,
			`input`,
			`script`,
			`svg`,
			`video`,
			`body`,
			`head`,
			`iframe`,
			`source`,
			`button`,
			`math`,
			`link`,
			`picture`,
			`details`,
			`applet`,
			`bgsound`
		]
	});
};
// # sourceMappingURL=html_util.js.map
