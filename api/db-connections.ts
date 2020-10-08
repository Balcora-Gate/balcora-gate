import mongoose from 'mongoose';

const uri = `mongodb+srv://${process.env.CLUSTER_USER_NAME}:${process.env.CLUSTER_USER_PASS}@${process.env.CLUSTER_CONN_STR}`;

export const dbConnection = (db_name: string) => {
	console.log(`createConnection: ${db_name}`);
	return mongoose.createConnection(uri,
	{
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		dbName: db_name
	});
};

export const site_connections: { [key: string]: mongoose.Connection } = {
	site_content: dbConnection(`site_content`)
};

export class PatchConnection {
	version: number;
	conn_string: string;
	connection: mongoose.Connection;

	constructor(version: number, conn_string: string) {
		this.version = version;
		this.conn_string = conn_string;
		this.connection = dbConnection(conn_string);
	}
};

export class PatchConnectionList {
	connections: Array<PatchConnection>;

	get latest (): PatchConnection {
		return this.connections.reduce((highest, current) => {
			if (highest.version < current.version) {
				highest = current;
			}
			return highest;
		});
	}

	constructor(conns: Array<PatchConnection>) {
		this.connections = conns;
	}
};

export const playerspatch_connections = new PatchConnectionList([
	// this should be refactored so we just grab the list from atlas somehow
	new PatchConnection(11, `game_data_playerspatch_11`),
	new PatchConnection(12, `game_data_playerspatch_12`),
	new PatchConnection(13, `game_data_playerspatch_13`),
	new PatchConnection(14, `game_data_playerspatch_14`)
]);
