import mongoose from 'mongoose';

import { site_connections } from '../db-connections';

const schema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	slug: {
		type: String,
		required: true,
		unique: true
	},
	title: {
		type: String,
		required: true,
	},
	body: {
		type: String,
		required: true
	},
	user: {
		type: String,
		required: true
	},
	collaborators: [
		{
			type: String,
			required: false
		}
	],
});

export default site_connections.site_content.model(`guide`, schema, `guide`);