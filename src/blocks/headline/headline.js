/**
 * BLOCK: bu-headline-cgb
 *
 * A headline with anchor support and pre- and post-text formatting options.
 */

// Import CSS.
import './style.scss';
import './editor.scss';

// Import internal dependencies.
import HeadingToolbar from './heading-toolbar';
import './pretext-format.js';
import './posttext-format.js';
import getAllowedFormats from '../../global/allowed-formats';
import blockIcons from '../../components/block-icons/';

// WordPress dependencies.
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { Fragment } = wp.element;
const { PanelBody } = wp.components;
const { RichText, BlockControls, InspectorControls } =
	'undefined' === typeof wp.blockEditor ? wp.editor : wp.blockEditor;
const { select } = wp.data;

// Populate selectors that were in core/editor until WordPress 5.2 and are
// now located in core/block-editor.
const { getBlocks } =
	'undefined' === typeof select( 'core/block-editor' )
		? select( 'core/editor' )
		: select( 'core/block-editor' );

// Register the block.
registerBlockType( 'editorial/headline', {
	title: __( 'Headline' ),
	description: __(
		'Add a section heading with an anchor and pre- and post-text formatting options.'
	),
	icon: blockIcons( 'headline' ),
	category: 'bu-editorial',
	supports: {
		anchor: true,
	},
	attributes: {
		content: {
			type: 'string',
			source: 'html',
			selector: '.wp-block-editorial-headline',
		},
		level: {
			type: 'number',
			default: 2,
		},
		anchor: {
			type: 'string',
			source: 'attribute',
			attribute: 'id',
			selector: '.wp-block-editorial-headline',
		},
	},
	styles: [
		{
			name: 'default',
			label: __( 'Regular' ),
			isDefault: true,
		},
		{
			name: 'emphasis-weight',
			label: __( 'Emphasize weight' ),
		},
		{
			name: 'emphasis-color',
			label: __( 'Emphasize color' ),
		},
	],

	edit( props ) {
		const { attributes, setAttributes, className } = props;
		const { content, level, anchor } = attributes;
		const tagName = 'h' + level;

		// Generate an index-based value for the anchor attribute if it is not set.
		if ( ! anchor ) {
			const headlineBlocks = getBlocks().filter(
				( e ) => e.name === 'editorial/headline'
			);
			const id = 'headline-' + headlineBlocks.length;

			setAttributes( { anchor: id } );
		}

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={ __( 'Help' ) } initialOpen={ false }>
						<Fragment>
							<p>
								<strong>PreText and PostText Formats</strong>
								<br />
								These formats are intended to style text such as
								"Chapter 3:" as part of a headline text either
								before or after the main Headline text. Enter
								the Headline and then select text in the
								headline and apply a pre or post text format
								from the Format Control Toolbar on the block.
							</p>
							<p>
								<strong>Emphasis Color & Weight</strong>
								<br />
								Emphasis Color and Emphasis weight can be
								selectively applied to a word(s) by selecting
								those characters and applying a{ ' ' }
								<strong>Bold</strong> style. The color or weight
								change will apply to any bold text inside the
								Headline tag.
							</p>
						</Fragment>
					</PanelBody>
				</InspectorControls>
				<BlockControls>
					<HeadingToolbar
						minLevel={ 1 }
						maxLevel={ 7 }
						selectedLevel={ level }
						onChange={ ( newLevel ) =>
							setAttributes( { level: newLevel } )
						}
					/>
				</BlockControls>
				<RichText
					tagName={ tagName }
					className={ className }
					value={ content }
					onChange={ ( content ) => setAttributes( { content } ) }
					placeholder={ __( 'Write headline…' ) }
					formattingControls={ getAllowedFormats(
						'formattingControls',
						[ 'pretext', 'posttext', 'bold', 'italic' ]
					) }
					allowedFormats={ getAllowedFormats( 'allowedFormats', [
						'editorial/pretext',
						'editorial/posttext',
						'core/bold',
						'core/italic',
					] ) }
					withoutInteractiveFormats={ true }
				/>
			</Fragment>
		);
	},

	save( { attributes } ) {
		const { content, level } = attributes;
		const tagName = 'h' + level;

		return <RichText.Content tagName={ tagName } value={ content } />;
	},
} );
