export const compactArray = (arr: Array<any>, sub_size: number): Array<Array<any>> => {
	const out = [];
	for (const [i, v] of arr.entries()) {
		if (i % sub_size === 0) {
			out.push([arr[i]]);
		} else {
			out[out.length - 1].push(arr[i]);
		}
	}
	return out;
};
