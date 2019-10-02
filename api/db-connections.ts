import mongoose from 'mongoose';

const uri = `mongodb+srv://${process.env.CLUSTER_USER_NAME}:${process.env.CLUSTER_USER_PASS}@${process.env.CLUSTER_CONN_STR}`;

export const dbConnection = (db_name: string) => {
	console.log(`createConnection: ${db_name}`);
	return mongoose.createConnection(uri,
		{
			useCreateIndex: true,
			useNewUrlParser: true,
			// useUnifiedTopology: true,
			dbName: db_name
		});
}

export const connections: {[key: string]: mongoose.Connection} = {
	game_data_playerspatch_11: dbConnection(`game_data_playerspatch_11`),
	site_content: dbConnection(`site_content`)
};