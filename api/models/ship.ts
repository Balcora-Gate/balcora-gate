import mongoose from 'mongoose';
import { connections } from '../db-connections';

const schema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	attribs: {
		type: Object,
		required: false
	},
	abilities: {
		type: Object,
		required: false
	},
	emp: {
		type: Object,
		required: false
	}
});

export default connections.game_data_playerspatch_11.model(`ship`, schema, `ship`);
//export default mongoose.model(`ship`, schema, `ship`);