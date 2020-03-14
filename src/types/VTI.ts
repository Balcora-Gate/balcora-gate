export type VTITag = {
	_id?: string,
	text: string,
	tiClasses?: Array<string>
};

export class VTIConfig {
	model_tag: string = ``;
	tags: Array<VTITag> = [];
	autocomplete_tags: Array<VTITag>;
	debounce?: number;

	constructor (config: { autocomplete_tags?: Array<VTITag>, debounce?: number } = {}) {
		this.autocomplete_tags = config.autocomplete_tags || [];
		this.debounce = config.debounce;
	}
}
