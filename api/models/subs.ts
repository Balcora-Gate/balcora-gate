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
	}
});

export default connections.game_data_playerspatch_11.model(`subs`, schema, `subs`);
