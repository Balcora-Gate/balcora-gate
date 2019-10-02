import mongoose from 'mongoose';
import { Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { connections } from '../db-connections';

interface IUser extends Document {
	name: string,
	pass: string,
	join_date: Date
};

const schema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	pass: {
		type: String,
		required: true
	},
	join_date: {
		type: Date,
		required: true
	}
});

schema.pre<IUser>(`save`, async function () {
	if (this.isModified) {
		// just use default 10 rounds
		const salt = await bcrypt.genSalt();
		this.pass = await bcrypt.hash(this.pass, salt);
	}
});

schema.methods.comparePass = function (incoming_pass: string) {
	return bcrypt.compare(incoming_pass, this.pass);
}

export default connections.site_content.model(`user`, schema, `user`);
//export default mongoose.model(`user`, schema, `user`);