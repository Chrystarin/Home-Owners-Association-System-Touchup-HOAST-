const { Dropbox } = require('dropbox');

const { DBX_KEY, DBX_SECRET, DBX_REFRESH } = process.env;
const { InvalidInputError } = require('./errors');

const dropbox = new Dropbox({
	clientId: DBX_KEY,
	clientSecret: DBX_SECRET,
	refreshToken: DBX_REFRESH
});

/**
 * This function uploads an image to Dropbox and returns a shareable URL for the uploaded image.
 * @param {Object} image - The image to be uploaded. It should have a 'data', 'name', and 'mimetype' property.
 * @param {string} path - The path to which the image should be uploaded.
 * @returns {string} - The shareable URL for the uploaded image.
 */
module.exports = async (image, path) => {
	// Extract the 'data', 'name', and 'mimetype' properties from the 'image' object.
	const { data, name, mimetype } = image;

	// Check if the 'mimetype' of the image is valid. If not, throw an 'InvalidInput' error.
	if (!['image/png', 'image/jpeg'].includes(mimetype))
		throw new InvalidInputError('Invalid file type');

	// Upload the image to Dropbox.
	const {
		result: { path_display }
	} = await dropbox.filesUpload({
		path: `/HOAST/${path}.${name.split('.')[1]}`, // Set the path for the uploaded image.
		contents: data, // Set the contents of the uploaded image.
		mode: 'overwrite' // Overwrite the file if it already exists.
	});

	let url;

	try {
		// Create a shareable link for the uploaded image.
		({
			result: { url }
		} = await dropbox.sharingCreateSharedLinkWithSettings({
			path: path_display
		}));
	} catch (error) {
		// If an error occurs while creating a shareable link, check if the error is 'shared_link_already_exists'.
		const {
			error: {
				error: {
					'.tag': tag,
					shared_link_already_exists: { metadata }
				}
			}
		} = error;

		/**
		 * If the error is 'shared_link_already_exists', get the existing shareable link.
		 * Otherwise, throw the error.
		 */
		if (tag === 'shared_link_already_exists') ({ url } = metadata);
		else throw error;
	}

	// Modify the shareable link to use the 'dl.dropboxusercontent.com' domain instead of 'www.dropbox.com'.
	url = url?.replace('www.dropbox.com', 'dl.dropboxusercontent.com');

	// Return the shareable URL for the uploaded image.
	return url;
};
