/**
 * BLOCK: editorial/custom-html
 *
 * A block used for arbitrary custom HTML that is not sanitized
 * or escaped in any way on output.
 */

//  Import CSS.
import './editor.scss';

// Internal dependencies.
import blockIcons from '../../components/block-icons';

// WordPress dependencies.
const { __ } = wp.i18n;

const { registerBlockType } = wp.blocks;

const { withState, compose } = wp.compose;

const { withSelect, select, subscribe } = wp.data;

const { PlainText } =
	'undefined' === typeof wp.blockEditor ? wp.editor : wp.blockEditor;

const { addQueryArgs } = wp.url;

const { apiFetch } = wp;

// Register the block.
registerBlockType( 'editorial/custom-html', {
	title: __( 'BU Custom HTML' ),

	description: __( 'Enter arbitrary custom HTML.' ),

	icon: blockIcons( 'html' ),

	category: 'bu-editorial',

	attributes: {
		// This block ID is used when storing individual block content as post meta.
		customBlockID: {
			type: 'string',
			default: '',
		},
	},

	edit: compose( [
		withState( {
			customHTML: '',
			hasLoaded: false,
			doingHTMLFetch: false,
			errorMessage: false,
		} ),
		withSelect( ( select, props ) => {
			const {
				setState,
				customHTML,
				hasLoaded,
				doingHTMLFetch,
				errorMessage,
			} = props;

			const { customBlockID } = props.attributes;

			// Do an initial load of the block's stored data from meta.
			if ( '' !== customBlockID && ! doingHTMLFetch && ! hasLoaded ) {
				setState( {
					doingHTMLFetch: true, // Prevent concurrent API calls for the same data.
				} );

				apiFetch( {
					path: addQueryArgs( '/bu-blocks/v1/customhtml', {
						post_id: select( 'core/editor' ).getCurrentPostId(),
						custom_block_id: customBlockID,
					} ),
				} )
					.then( ( html ) => {
						setState( {
							customHTML: html,
							doingHTMLFetch: false,
							hasLoaded: true,
						} );
					} )
					.catch( ( error ) => {
						setState( {
							doingHTMLFetch: false,
							errorMessage: error.message,
							hasLoaded: true,
						} );
					} );
			}

			return {
				hasLoaded, // Whether the initial load is complete.
				customHTML, // HTML to display in the block.
				errorMessage, // A string to display in the block if an API request failed.
			};
		} ),
	] )( ( { hasLoaded, customHTML, errorMessage, attributes, ...props } ) => {
		const { className, setState, setAttributes } = props;

		const { customBlockID } = attributes;

		// Update the block's content state whenever content in this block
		// is changed.
		const updateBlockValue = ( updatedHTML ) => {
			// HTML is passed around as a state rather than an attribute
			// because it is stored in meta rather than in content.
			setState( {
				customHTML: updatedHTML,
			} );
		};

		// Save post meta via REST Endpoint.
		const savePostMeta = function () {
			const postID = select( 'core/editor' ).getCurrentPostId();

			// This may be true on the first load of some posts.
			if ( null === postID ) {
				return;
			}

			const customTextArea = document.querySelector(
				'#block-' + customBlockID + ' textarea'
			);

			// This may be true on the first load of some posts.
			if ( null === customTextArea ) {
				return;
			}

			const post = {
				post_id: postID,
				custom_block_id: customBlockID,
				html: customTextArea.value,
			};

			// Save the data for this block using a custom endpoint.
			//
			// This is saved this way vs the standard block->attribute->meta
			// approach so that the HTML is left intact as is and is not rendered
			// to post_content. The intent with this block is to support HTML as
			// entered, including unclosed tags or other issues that WP will try
			// to fix in the core HTML block.
			//
			// Also, when the HTML is stored as an attribute it is part of the block
			// markup. However all of the blocks are parsed on loading of the post in
			// the editor and run through some functions to validate the markup. Any
			// unclosed tags or other issues trigger a warning and the user would be
			// prompted to have WP fix it. Therby breaking the intended code output.
			//
			// Why would you want unclosed tags or other issues? Normally you don't
			// but in some edge cases you may need to "wrap" html like a div tag around
			// other content in the post. This block unlike the core HTML block will allow
			// you to open a tag and then close it in another BU Custom HTML block later.
			// It's the responsiblity of the user to make sure to close the tags in those
			// situations but it is important to have that ability.
			if ( '' !== customBlockID ) {
				apiFetch( {
					path: '/bu-blocks/v1/customhtml',
					method: 'POST',
					data: post,
				} )
					.then( ( html ) => {
						// Success!
					} )
					.catch( ( error ) => {
						// How to handle this error?
					} );
			}
		};

		/* In 5.4 the previous method of saving the html to post meta was
		not working properly. A temporary fix of using wp.data.subscribe() to
		monitor for post save and update the post meta then is being used here.

		Ultimately a better solution is needed. A suggested approach to bypass validation
		by the block editor instead of this method of storing in postmeta via the rest
		api would be to encode the html as base64 so it appears to be a nonsensical string
		and store that in a normal block attribute and then decode the base64 "hidden" html
		on the frontend to convert back to html. */

		const { isSavingPost } = select( 'core/editor' );
		const { isAutosavingPost } = select( 'core/editor' );
		const { didPostSaveRequestSucceed } = select( 'core/editor' );
		let saving = false;

		subscribe( () => {
			if (
				isSavingPost() &&
				! isAutosavingPost() &&
				didPostSaveRequestSucceed()
			) {
				saving = true;
			} else if ( saving ) {
				savePostMeta();
				saving = false;
			}
		} );

		// Set a timestamp based block ID if it does not yet exist. It is okay
		// for multiple posts to share similar block IDs, but not okay for multiple
		// blocks on the same post. Using `Date().getTime()` here provides a unique
		// enough identifier at a low cost.
		if ( '' === customBlockID ) {
			setAttributes( {
				customBlockID: 'manual-' + new Date().getTime(),
			} );
		}

		// Selectors technically can't start with a number, so prepend a string to
		// build the ID attribute of the wrapping container.
		const containerID = 'block-' + customBlockID;

		return (
			<div id={ containerID } className={ className }>
				{ ! hasLoaded && <span>Looking for existing content...</span> }
				{ hasLoaded && (
					<PlainText
						label="Enter custom HTML"
						value={ customHTML }
						onChange={ updateBlockValue }
					></PlainText>
				) }
			</div>
		);
	} ),

	// The front-end HTML for this block is handled in PHP, but
	// the save function is required.
	save( { attributes } ) {
		return null;
	},
} );
