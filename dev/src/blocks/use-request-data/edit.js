/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

import { useState } from '@wordpress/element';

import { useRequestData } from '@bostonuniversity/block-imports';
import { useMedia } from '@bostonuniversity/block-imports';
//import { useRequestData } from '@10up/block-components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';
import { has } from 'lodash';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit() {
	//const [hasPost, setHasPost] = useState(false);
	const [ data, isLoading, invalidateRequest ] = useRequestData(
		'postType',
		'post',
		67
	);
	//const [imgData, imgIsLoading, imgInvalidateRequest] = useRequestData('root', 'media', 68);
	//if (data !== undefined) {
	//	setHasPost(data);
	//	console.log(hasPost);
	//	//if ( umImage  !== undefined)  {
	//	//}
	//}

	//if (hasPost) {
	//	console.log('hp featured', hasPost.featured_media);
	//	const { media: umImage, isResolvingMedia, hasResolvedMedia } = useMedia(hasPost.featured_media);

	//}

	//console.log('Image Data', imgData);
	//console.log('Image Loading', imgIsLoading);

	//console.log('****** ');
	//console.log('Post Data', data);
	//console.log('isLoading', isLoading);
	//console.log('****** ');

	if ( isLoading ) {
		return <h3>Loading...</h3>;
	}

	return (
		<div { ...useBlockProps() }>
			This is some text from the editor.
			{ data && <p>{ data.title.rendered }</p> }
		</div>
	);
}
