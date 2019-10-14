export const snip = (str: string, rough_cutoff: number = 32): string => {
	if (str.length <= rough_cutoff) {
		return str;
	}
	const snip_at = str.slice(rough_cutoff).split(``).findIndex(char => /\s/m.test(char)) + rough_cutoff;
	return str.slice(0, snip_at);
};

export type PassRequirements = {
	length: number,
	alpha: boolean,
	numeric: boolean,
	special: boolean,
	whitespace: boolean
};
export const validatePassword = (pass: string, requirements: PassRequirements = {
	length: 8,
	alpha: true,
	numeric: true,
	special: true,
	whitespace: false
}) => {
	const errs: Array<string> = [];
	if (pass.length < requirements.length) {
		errs.push(`Password must be at least ${requirements.length} characters long`);
	}
	if (requirements.alpha === true && /[a-zA-Z_]/gm.test(pass) === false) {
		errs.push(`Password must contain at least one regular alpha character / underscore (a-z, A-Z, _)`);
	}
	if (requirements.numeric === true && /\d/gm.test(pass) === false) {
		errs.push(`Password must contain at least one digit (0-9)`);
	}
	if (requirements.special === true && /\W/gm.test(pass) === false) {
		errs.push(`Password must contain at least one special character (!?#[ etc.)`);
	}
	if (requirements.whitespace === true && / /gm.test(pass) === false) {
		errs.push(`Password must contain at least one space`);
	}
	return errs;
};
