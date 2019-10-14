import mongoose from 'mongoose';

import { connections } from '../db-connections';

const schema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	global_access: {
		type: Boolean,
		required: false,
		default: false
	}
});

export default connections.site_content.model(`user_role`, schema, `user_role`);