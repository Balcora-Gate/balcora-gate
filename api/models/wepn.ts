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
	config: {
		type: Object,
		required: false
	},
	result: {
		type: Object,
		required: false
	},
	penetration: {
		type: Object,
		required: false
	},
	accuracy: {
		type: Object,
		required: false
	}
});

export default connections.game_data_playerspatch_11.model(`wepn`, schema, `wepn`);
