import mongoose from 'mongoose';
import { playerspatch_connections } from '../db-connections';

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

export default playerspatch_connections.latest.connection.model(`wepn`, schema, `wepn`);
