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
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';

import {
	useRequestData,
	useMedia,
	LoadingSpinner,
} from '@bostonuniversity/block-imports';

import { TextControl, PanelBody, PanelRow } from '@wordpress/components';

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
 * @param  props
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( props ) {
	const { attributes, setAttributes } = props;
	const { postID } = attributes;

	let imageID = '';

	const [ data, isLoading, invalidateRequest ] = useRequestData(
		'postType',
		'post',
		postID
	);

	if ( data ) {
		console.log( data );
		console.log( 'Featured Image', data.featured_media );
		imageID = data.featured_media;
	}

	const { media, isResolvingMedia, hasResolvedMedia } = useMedia( imageID );

	console.log( isResolvingMedia );
	console.log( hasResolvedMedia );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Post Settings">
					<PanelRow>
						<TextControl
							label="Post ID"
							value={ postID }
							onChange={ ( value ) =>
								setAttributes( { postID: value } )
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<p { ...useBlockProps() }>
				{ isLoading && (
					<>
						<LoadingSpinner
							text="Loading" // Default is undefined.
							shadow={ false } // Default is true.
							className="a-custom-classname-to-add"
						/>
					</>
				) }

				{ data && (
					<>
						<h2>
							<strong>Title 3:</strong> { data.title.rendered }
						</h2>
						{ data?.excerpt?.raw && (
							<p className="excerpt-something">
								{ data.excerpt.raw }
							</p>
						) }
						{ imageID && isResolvingMedia && (
							<LoadingSpinner
								text="Loading" // Default is undefined.
								shadow={ false } // Default is true.
								className="a-custom-classname-to-add"
							/>
						) }
						{ imageID && hasResolvedMedia && (
							<>
								<p>Got image returned 3</p>
								<img src={ media.source_url } width="150" />
							</>
						) }
						<button type="button" onClick={ invalidateRequest }>
							Refresh list
						</button>
					</>
				) }

				{ ! postID && (
					<strong>Enter a post id in the inspector controls</strong>
				) }
			</p>
		</>
	);
}
