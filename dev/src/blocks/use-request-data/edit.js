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

import { useRequestData } from '@bostonuniversity/block-imports';
import { useMedia } from '@bostonuniversity/block-imports';
//import { useRequestData } from '@10up/block-components';

import { Spinner } from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit() {
	let imageID = '';

	const PostImage = ( props ) => {
		const { id } = props;
		console.log( 'in getmedia', id );
		const { media, isResolvingMedia, hasResolvedMedia } = useMedia( id );

		console.log( isResolvingMedia );
		console.log( hasResolvedMedia );

		if ( isResolvingMedia ) {
			return <Spinner />;
		}

		if ( hasResolvedMedia ) {
			console.log( media );
			return (
				<>
					<img src={ media.source_url } width="100" />
				</>
			);
		}
		return null;
	};
	const GetPost = ( props ) => {
		const { id } = props;
		const [ data, isLoading, invalidateRequest ] = useRequestData(
			'postType',
			'post',
			id
		);

		if ( data ) {
			console.log( 'Featured Image', data.featured_media );
			imageID = data.featured_media;
		}
		if ( isLoading ) {
			return <Spinner />;
		}

		return (
			<>
				{ data && (
					<>
						<div>{ data.title.rendered }</div>
						{ imageID && <PostImage id={ imageID } /> }
					</>
				) }
				<button type="button" onClick={ invalidateRequest }>
					Refresh list
				</button>
			</>
		);
	};

	return (
		<p { ...useBlockProps() }>
			<GetPost id={ 5 } />
		</p>
	);
}
