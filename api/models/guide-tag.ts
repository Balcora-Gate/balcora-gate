import mongoose, { Schema } from 'mongoose';

import { site_connections } from '../db-connections';

const schema = new mongoose.Schema({
	text: {
		type: String,
		required: true
	},
	user_id: {
		type: Schema.Types.ObjectId,
		required: true
	}
});

export default site_connections.site_content.model(`guide_tag`, schema, `guide_tag`);