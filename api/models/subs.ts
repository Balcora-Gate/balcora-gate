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
	attribs: {
		type: Object,
		required: false
	}
});

export default playerspatch_connections.latest.connection.model(`subs`, schema, `subs`);
