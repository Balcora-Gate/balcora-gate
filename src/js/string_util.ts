export const snip = (str: string, rough_cutoff: number = 32): string => {
	if (str.length <= rough_cutoff) {
		return str;
	}
	const snip_at = str.slice(rough_cutoff).split(``).findIndex(char => /\s/m.test(char)) + rough_cutoff;
	return str.slice(0, snip_at);
};
