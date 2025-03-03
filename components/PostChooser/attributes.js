/**
 * The post chooser component attributes.
 */

const PostChooserAttributes = {
	postChooserPostID: {
		type: 'number',
	},
	postChooserPostType: {
		type: 'string',
	},
	postChooserPostTitle: {
		type: 'string',
	},
	postChooserPostPublication: {
		type: 'string',
	},
	postChooserPostPublicationID: {
		type: 'number',
	},
	postChooserPostThumbnail: {
		type: 'boolean',
		default: false,
	},
	postChooserPostImages: {
		type: 'array',
	},
	postChooserPostImageID: {
		type: 'number',
	},
	postChooserPostImageURL: {
		type: 'string',
	},
	postChooserPostImageAlt: {
		type: 'string',
	},
};

export default PostChooserAttributes;