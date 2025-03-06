/**
 * BLOCK: bu/clicktotweet
 *
 * Registers a Click to Tweet block.
 */

// External dependencies.
import classnames from 'classnames';

// Import CSS.
import './style.scss';
import './editor.scss';

// WordPress dependencies.
const {
	__,
} = wp.i18n;
const {
	Fragment,
} = wp.element;
const {
	withSelect,
} = wp.data;
const {
	compose,
	ifCondition,
} = wp.compose;
const {
	registerFormatType,
	toggleFormat,
} = wp.richText;
const {
	RichTextShortcut,
	RichTextToolbarButton,
} = ( 'undefined' === typeof wp.blockEditor ) ? wp.editor : wp.blockEditor;
const {
	createHigherOrderComponent
} = wp.compose;
const {
	addFilter,
} = wp.hooks;

// Define the format name.
const name = 'bu/clicktotweet-highlight';

// Define the opening markup for Click to Tweet content.
const clickToTweetContainer = '<span class="wp-block-bu-clicktotweet-content">';

// Define the opening markup for highlighted Click to Tweet text.
const clickToTweetHighlight = '<span class="wp-block-bu-clicktotweet-highlight">';

// Registers the 'Click to Tweet highlight' format.
registerFormatType( name, {
	title: __( 'Click to Tweet' ),
	tagName: 'span',
	className: 'wp-block-bu-clicktotweet-highlight',
	edit: compose(
		withSelect( select => {
			let getSelectedBlock = ( 'undefined' === typeof select( 'core/block-editor' ) ) ? select( 'core/editor' ).getSelectedBlock : select( 'core/block-editor' ).getSelectedBlock;

			return {
				selectedBlock: getSelectedBlock()
			}
		} ),
		ifCondition( props => {
			return (
				props.selectedBlock &&
				props.selectedBlock.name === 'core/paragraph'
			);
		} )
	)( ( props ) => {
		const {
			isActive,
			onChange,
			selectedBlock,
			value,
		} = props;

		const {
			clickToTweet,
			content,
		} = selectedBlock.attributes;

		// Set up a boolean for displaying the format button as active.
		const active = isActive || ( clickToTweet && !content.includes( clickToTweetHighlight ) );

		const onToggle = () => {
			// A super hacky way to fake `setAttributes` for `clickToTweet`in this context.
			// If it's `true` and the format is being removed from text or the entire block
			// is being toggled back off, we switch it to `false`.
			// In all other cases, we switch it to `true`.
			if ( clickToTweet && ( isActive || ( !isActive && content.includes( clickToTweetContainer ) ) ) ) {
				props.selectedBlock.attributes.clickToTweet = false;
			} else {
				props.selectedBlock.attributes.clickToTweet = true;
			}

			// Handle the toggling of the Click to Tweet Highlight format.
			onChange( toggleFormat( value, { type: name } ) );
		};

		return (
			<Fragment>
				<RichTextShortcut
					character="b"
					onUse={ onToggle }
					type="access"
				/>
				<RichTextToolbarButton
					icon="twitter"
					isActive={ active }
					onClick={ onToggle }
					shortcutCharacter="b"
					shortcutType="access"
					title={ __( 'Click to Tweet' ) }
				/>
			</Fragment>
		);
	} ),
} );

/**
 * Adds the `clickToTweet` attribute to the paragraph block.
 *
 * @param {object} settings The block settings.
 * @param {string} name     The block name.
 */
const registerClickToTweetAttributes = ( settings, name ) => {
	if ( 'core/paragraph' !== name ) {
		return settings;
	}

	const clickToTweetAttributes = {
		clickToTweet: {
			type: 'boolean',
			default: false,
		}
	};

	settings.attributes = Object.assign( settings.attributes, clickToTweetAttributes );

	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'bu-blocks/click-to-tweet-paragraph',
	registerClickToTweetAttributes
);

/**
 * Toggle the block `content` and `className` attributes when the
 * Click to Tweet format is applied.
 */
const registerFields = createHigherOrderComponent( BlockEdit => {
	return ( props ) => {
		if ( 'core/paragraph' !== props.name ) {
			return (
				<BlockEdit { ...props } />
			);
		}

		const {
			attributes: {
				className,
				clickToTweet,
				content,
			},
			setAttributes,
		} = props;

		if ( clickToTweet && content && !content.includes( clickToTweetContainer ) ) {
			const wrappedContent = `<span class="wp-block-bu-clicktotweet-content">${ content }</span>`;
			// Build the new value for the `className` property.
			const wrappedClassName = classnames(
				className,
				'wp-block-bu-clicktotweet',
				{
					'has-format-highlight': content.includes( clickToTweetHighlight ),
				},
			);

			setAttributes( {
				className: wrappedClassName,
				content: wrappedContent,
			} );
		}

		if ( clickToTweet && content ) {
			if ( content.includes( clickToTweetHighlight ) && className && !className.includes( 'has-format-highlight' ) ) {
				setAttributes( { className: classnames( className, 'has-format-highlight' ) } );
			}

			if ( !content.includes( clickToTweetHighlight ) && className && className.includes( 'has-format-highlight' ) ) {
				setAttributes( { className: classnames( className.replace( /has-format-highlight/g, '' ) ).trim() } );
			}
		}

		if ( !clickToTweet && content.includes( clickToTweetContainer ) ) {
			const strippedContent = content.slice( clickToTweetContainer.length, -7 );
			const strippedClassName = !className
				? undefined
				: classnames( className.replace( /wp-block-bu-clicktotweet|has-format-highlight/g, '' ) ).trim();

			setAttributes( {
				className: strippedClassName,
				content: strippedContent,
			} );
		}

		return (
			<BlockEdit { ...props } />
		);
	};
} );

addFilter(
	'editor.BlockEdit',
	'bu-blocks/click-to-tweet-paragraph',
	registerFields
);

/**
 * Modify the result of the paragraph block's `save` function.
 *
 * @param {object} element    The original save element.
 * @param {object} settings   The block settings.
 * @param {object} attributes The block attributes.
 */
const saveClickToTweet = ( element, settings, attributes ) => {
	if ( 'core/paragraph' !== settings.name ) {
		return element;
	}

	const {
		props,
	} = element;
	const {
		value,
	} = props;
	const {
		clickToTweet,
	} = attributes;

	// Stop here if the value property of the save element is empty,
	// or the `clickToTweet` attribute is false.
	if ( !value || !clickToTweet ) {

		// Check if the value previously had Click to Tweet markup.
		if ( value && value.includes( clickToTweetContainer ) ) {

			// Trim the Click to Tweet markup from the value.
			const newValue = value.slice( clickToTweetContainer.length, -7 );

			// Assign our new `value` value to the `element` object.
			element.props = Object.assign(
				props,
				{
					value: newValue,
				}
			);
		}

		return element;
	}

	// Build the new value for the `value` property.
	const newValue = ( !value.includes( clickToTweetContainer ) )
		? `<span class="wp-block-bu-clicktotweet-content">${ value }</span>`
		: value;

	// Assign our new `className` and `value` values to the `element` object.
	element.props = Object.assign(
		props,
		{
			value: newValue,
		}
	);

	return element;
};

addFilter(
	'blocks.getSaveElement',
	'bu-blocks/click-to-tweet-paragraph',
	saveClickToTweet
);
