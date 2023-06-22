module.exports = (controllers) =>
	Object.entries(controllers).reduce(
		(obj, [key, value]) => ({
			...obj,
			[key]: (req, res, next) =>
				Promise.resolve(value(req, res, next)).catch(next)
		}),
		{}
	);
