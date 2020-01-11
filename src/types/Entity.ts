export enum ENTITY_TYPE { SHIP = 'ship', WEAPON = 'wepn', SUBSYSTEM = 'subs' };
export type Hardpoint = {
	name: string,
	joint_name: string,
	type: string,
	family: string,
	destructability: string,
	default_sub: string,
	potential_sub_0: string,
	potential_sub_1: string,
	potential_sub_2: string,
	potential_sub_3: string,
	potential_sub_4: string,
	potential_sub_5: string,
	potential_sub_6: string,
	potential_sub_7: string
};
export enum HARDPOINT_TYPE { WEAPON = '"Weapon"', PRODUCTION = '"Production"', SYSTEM = '"System"' };
export type Subsystem = {
	name: string,
	category: `subs`,
	attribs: { [key: string]: any },
	weapon?: string
};
