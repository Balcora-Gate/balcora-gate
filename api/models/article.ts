import mongoose from 'mongoose';
import * as db_conns from '../db-connections';

const schema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	slug: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true,
	},
	body: {
		type: String,
		required: true
	}
});

export default db_conns.connections.site_content.model(`article`, schema, `article`);

//export default mongoose.model(`article`, schema, `article`);