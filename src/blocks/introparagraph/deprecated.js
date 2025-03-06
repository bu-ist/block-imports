import getAllowedFormats from '../../global/allowed-formats';

// WordPress dependencies.
const {
	__,
} = wp.i18n;
const {
	createBlock,
	registerBlockType,
} = wp.blocks;
const {
	Fragment,
} = wp.element;
const {
	IconButton,
	PanelBody,
	Toolbar,
} = wp.components;
const {
	RichText,
	PlainText,
	InspectorControls,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
	PanelColorSettings,
	withColors,
} = ( 'undefined' === typeof wp.blockEditor ) ? wp.editor : wp.blockEditor;

// Import a library used to manage multiple class names.
import classnames from 'classnames';

// Import common handling of available color options.
import themeOptions from '../../global/theme-options';


/**
 * Render the SVG used for a drop cap when the drop cap has an
 * image assigned to it.
 *
 * This is used in the block editor and stored in post content
 * as part of the block markup.
 *
 * @param {string} character The character to display in the drop cap.
 * @param {string} imageURL  The background image for the drop cap character.
 */
const renderDropCapSVG = ( character, imageURL ) => {
	return (
		<svg>
			<pattern
				id="dropcap-texture"
				viewBox="0 0 1024 1024"
				patternUnits="userSpaceOnUse"
				width="100%" height="100%"
				x="0%" y="0%">
				<image href={ imageURL } width="1024" height="1024"/>
			</pattern>
			<text textAnchor="start"
				x="0"
				y="50%"
				dy=".404em"
				className="dropcap-filltext">{ character }</text>
		</svg>
	);
};


const deprecated = [
    {

    	attributes: {
			heading: {
				type: 'string',
				source: 'html',
				selector: '.wp-block-editorial-introparagraph h4'
			},
			list: {
				type: 'string',
				source: 'html',
				selector: '.wp-block-editorial-introparagraph-toc'
			},
			content: {
				type: 'string',
				source: 'html',
				selector: '.wp-block-editorial-introparagraph-content p',
			},
			dropCapColor: {
				type: 'string',
				default: '',
			},
			paragraphColor: {
				type: 'string',
				default: '',
			},
			className: {
				type: 'string',
				default: '',
			},
			dropCapImageURL: {
				type: 'string',
				default: '',
			},
			dropCapImageId: {
				type: 'number',
			},
		},

        save( { attributes } ) {
			const {
				heading,
				list,
				content,
				dropCapColor,
				dropCapImageURL,
				paragraphColor,
				className,
			} = attributes;

			let isImageDropCap = false;
			if ( 'undefined' !== typeof className ) {
				// Determine if the drop cap SVG should be included in content.
				isImageDropCap = className.includes( 'is-style-dropcap-image' );
			}

			// Pull the first character from the article content use in the drop cap SVG.
			let dropCapCharacter = '';
			if ( 'undefined' !== typeof content ) {
				dropCapCharacter = content.charAt( 0 );
			};

			// Determine if the list is empty and should be excluded from the saved block.
			let saveList = true;
			if ( 'undefined' === typeof list || '<li></li>' === list || RichText.isEmpty( list ) ) {
				saveList = false;
			}

			// Determine if a sepecific dropcap style has been selected.
			let hasDropCapStyle = className && className.includes( 'is-style-dropcap' );

			const classes = classnames(
				className,
				{
					'has-dropcap': hasDropCapStyle,
					[`has-dropcap-color-${dropCapColor}`]: hasDropCapStyle && dropCapColor,
					[`has-paragraph-color-${paragraphColor}`]: ! hasDropCapStyle && paragraphColor,
				},
			);

			return (
				<div className={ classes }>
					{ ! RichText.isEmpty( heading ) && (
						<RichText.Content tagName="h4" value={ heading } />
					) }
					{ saveList && (
						<RichText.Content
							tagName="ul"
							className="wp-block-editorial-introparagraph-toc"
							value={ list }
							multiline="li"
						/>
					) }
					{ ! RichText.isEmpty( content ) && (
						<div className="wp-block-editorial-introparagraph-content">
							{ isImageDropCap && renderDropCapSVG( dropCapCharacter, dropCapImageURL ) }
							<RichText.Content
								tagName="p"
								value= { content }
							/>
						</div>
					) }
				</div>
			);
		},
    }
];

export default deprecated;