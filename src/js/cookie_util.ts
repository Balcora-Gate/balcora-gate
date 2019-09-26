export const allCookies = () => {
	return document.cookie.split(`;`).reduce((acc: {[key: string]: string}, kv_pair: string) => {
		const [k, v] = kv_pair.split(`=`);
		acc[k.trim()] = v;
		return acc;
	}, {});
};
