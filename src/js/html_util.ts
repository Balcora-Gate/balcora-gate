import DomPurify from 'dompurify';

export const unescapeHtml = (unsafe: String) => {
	if (!unsafe) return '';
	return unsafe
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#039;/g, "'");
};

export const standardPurify = (html: string | Node): string => {
	return DomPurify.sanitize(html, {
		FORBID_TAGS: [
			`style`,
			`form`,
			`script`,
			`svg`,
			`body`,
			`head`,
			`iframe`,
			`source`,
			`button`,
			`math`,
			`details`,
			`applet`
		],
		FORBID_ATTR: [
			`style`,
			`background`,
			`onclick`,
			`ondblclick`,
			`onmousedown`,
			`onmousemove`,
			`onmouseover`,
			`onmouseout`,
			`onmouseup`,
			`onkeydown`,
			`onkeypress`,
			`onkeyup`,
			`onchange`,
			`onsubmit`,
			`onreset`,
			`onselect`,
			`onblur`,
			`onfocus`,
			`onload`,
			`onunload`
		]
	});
};
