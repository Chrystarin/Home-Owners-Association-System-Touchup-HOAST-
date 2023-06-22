module.exports = {
	roles: {
		USER: 'user',
		ADMIN: 'admin',
		GUARD: 'guard',
		HOMEOWNER: 'homeowner',
		RESIDENT: 'resident'
	},
	types: {
		EMPLOYEE: new Set(['admin', 'guard']),
		RESIDENT: new Set(['homeowner', 'resident'])
	}
};
