/**
 * BLOCK: bu-editorial-drawer
 *
 * A block that works a bit like BU Collapsible to open and close a drawer of content.
 */

// External dependencies.
import classnames from 'classnames';

// Import CSS.
import './style.scss';
import './editor.scss';

// Internal dependencies.
import Background, { BackgroundAttributes } from '../../components/background';
import themeOptions from '../../global/theme-options';
import allowedBlocks from '../../components/allowed-blocks';
import getAllowedFormats from '../../global/allowed-formats';
import blockIcons from '../../components/block-icons/';

// WordPress dependencies.
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { PanelBody, Path, RadioControl, SVG, ToggleControl } = wp.components;
const {
	RichText,
	InnerBlocks,
	InspectorControls,
	PanelColorSettings,
	withColors,
} = 'undefined' === typeof wp.blockEditor ? wp.editor : wp.blockEditor;
const { select } = wp.data;

// Populate selectors that were in core/editor until WordPress 5.2 and are
// now located in core/block-editor.
const { hasSelectedInnerBlock, isBlockSelected } =
	'undefined' === typeof select( 'core/block-editor' )
		? select( 'core/editor' )
		: select( 'core/block-editor' );

/**
 * Returns the class list for the block based on the current settings.
 *
 * @param {number}  background Whether the block has background media assigned.
 * @param {string}  className  Default classes assigned to the block.
 * @param {boolean} round      Whether to display round images.
 * @param {boolean} hideTeaser Whether to display the teaser.
 * @param           size
 * @param {string}  themeColor The assigned background color.
 */
const getClasses = (
	background,
	className,
	hideTeaser,
	round,
	size,
	themeColor
) => {
	return classnames( 'js-bu-block-drawer', {
		'has-hide-teaser': hideTeaser,
		'is-style-round': round,
		[ className ]: className,
		[ `has-${ themeColor }-background` ]: themeColor,
		[ size ]: size && size !== '',
		'has-media': background,
	} );
};

// Register the block.
registerBlockType( 'editorial/drawer', {
	title: __( 'Drawer' ),
	description: __( 'Add content that can be toggled.' ),
	icon: blockIcons( 'drawer' ),
	category: 'bu-editorial',
	attributes: {
		button: {
			type: 'string',
			default: 'Read More',
			source: 'text',
			selector: '.button.js-bu-block-drawer-open',
		},
		className: {
			type: 'string',
		},
		clientId: {
			type: 'number',
		},
		hed: {
			type: 'string',
			default: '',
			source: 'html',
			selector: 'h2',
		},
		hideTeaser: {
			type: 'boolean',
			default: false,
		},
		lede: {
			type: 'string',
			default: '',
			source: 'html',
			selector: 'p',
		},
		round: {
			type: 'boolean',
			default: false,
		},
		size: {
			type: 'string',
			default: '',
		},
		themeColor: {
			type: 'string',
			default: '',
		},
		...BackgroundAttributes,
	},
	supports: {
		align: [ 'left', 'right', 'full' ],
	},

	// Add the `selected-drawer` data attribute when this block or its descendants are selected.
	getEditWrapperProps( { clientId } ) {
		if ( clientId ) {
			const drawerHasSelectedBlock =
				hasSelectedInnerBlock( clientId, true ) ||
				isBlockSelected( clientId );

			return {
				'data-selected-drawer': drawerHasSelectedBlock
					? 'true'
					: undefined,
			};
		}
	},

	edit: withColors( 'themeColor' )( ( props ) => {
		// Get the properties and attributes we'll need.
		const {
			attributes: {
				backgroundId,
				button,
				hed,
				hideTeaser,
				lede,
				round,
				size,
			},
			className,
			clientId,
			isSelected,
			setAttributes,
			setThemeColor,
			themeColor,
		} = props;

		// Set the clientId attribute so it can be accessed in the `getEditWrapperProps` function.
		if (
			hasSelectedInnerBlock( clientId, true ) ||
			isBlockSelected( clientId )
		) {
			setAttributes( { clientId } );
		}

		return (
			<aside
				className={ getClasses(
					backgroundId,
					className,
					hideTeaser,
					round,
					size,
					themeColor.slug
				) }
			>
				<div className="wp-block-editorial-drawer-teaser">
					{ ( backgroundId ||
						isSelected ||
						hasSelectedInnerBlock( clientId, true ) ) && (
						<figure>
							<Background
								allowedMediaTypes={ [ 'image' ] }
								blockProps={ props }
								inlinePlaceholder={ true }
								options={ [] }
								placeholderText={ __( 'Add Image' ) }
							/>
						</figure>
					) }
					<RichText
						formattingControls={ getAllowedFormats(
							'formattingControls',
							[]
						) }
						allowedFormats={ getAllowedFormats(
							'allowedFormats',
							[]
						) }
						keepPlaceholderOnFocus={ true }
						onChange={ ( value ) =>
							setAttributes( { hed: value } )
						}
						placeholder={ __( 'Enter heading…' ) }
						tagName="h2"
						value={ hed }
					/>
					<RichText
						formattingControls={ getAllowedFormats(
							'formattingControls',
							[ 'bold', 'italic', 'link' ]
						) }
						allowedFormats={ getAllowedFormats( 'allowedFormats', [
							'core/bold',
							'core/italic',
							'core/link',
						] ) }
						keepPlaceholderOnFocus={ true }
						onChange={ ( value ) =>
							setAttributes( { lede: value } )
						}
						placeholder={ __( 'Enter text…' ) }
						tagName="p"
						value={ lede }
					/>
					<div className="wp-block-editorial-drawer-open-wrapper">
						<RichText
							formattingControls={ getAllowedFormats(
								'formattingControls',
								[]
							) }
							allowedFormats={ getAllowedFormats(
								'allowedFormats',
								[]
							) }
							keepPlaceholderOnFocus={ true }
							className="button js-bu-block-drawer-open"
							onChange={ ( value ) =>
								setAttributes( { button: value } )
							}
							placeholder={ __( 'Enter button label…' ) }
							tagName="p"
							value={ button }
						/>
					</div>
				</div>
				<section className="wp-block-editorial-drawer-content js-bu-block-drawer-content">
					<div className="wp-block-editorial-drawer-wrapper">
						<InnerBlocks allowedBlocks={ allowedBlocks() } />
						<div className="wp-block-editorial-drawer-close">
							<button className="wp-block-editorial-drawer-close-button js-bu-block-drawer-close">
								Close
							</button>
						</div>
					</div>
				</section>
				<InspectorControls>
					<PanelColorSettings
						title={ __( 'Background Color' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: themeColor.color,
								onChange: setThemeColor,
								label: __( 'Background' ),
								disableCustomColors: true,
								colors: themeOptions(),
							},
						] }
					/>
					<PanelBody title={ __( 'Display Options' ) }>
						<ToggleControl
							label={ __( 'Hide teaser when drawer is open' ) }
							checked={ hideTeaser }
							onChange={ () =>
								setAttributes( { hideTeaser: ! hideTeaser } )
							}
						/>
						{ backgroundId && (
							<ToggleControl
								label={ __( 'Round photos' ) }
								checked={ round }
								onChange={ () =>
									setAttributes( { round: ! round } )
								}
							/>
						) }
						<RadioControl
							label={ __( 'Size' ) }
							selected={ size }
							options={ [
								{
									label: 'Default',
									value: '',
								},
								{
									label: 'Narrow',
									value: 'is-size-narrow',
								},
								{
									label: 'Small',
									value: 'is-size-small',
								},
								{
									label: 'Medium',
									value: 'is-size-medium',
								},
								{
									label: 'Wide',
									value: 'is-size-wide',
								},
							] }
							onChange={ ( option ) =>
								setAttributes( { size: option } )
							}
						/>
					</PanelBody>
				</InspectorControls>
			</aside>
		);
	} ),

	save( props ) {
		// Get the properties and attributes we'll need.
		const {
			attributes: {
				backgroundId,
				button,
				className,
				hed,
				hideTeaser,
				lede,
				round,
				size,
				themeColor,
			},
		} = props;

		return (
			<aside
				className={ getClasses(
					backgroundId,
					className,
					hideTeaser,
					round,
					size,
					themeColor
				) }
			>
				<div className="wp-block-editorial-drawer-teaser">
					{ backgroundId && (
						<figure>
							<Background blockProps={ props } />
						</figure>
					) }
					{ ! RichText.isEmpty( hed ) && (
						<RichText.Content tagName="h2" value={ hed } />
					) }
					{ ! RichText.isEmpty( lede ) && (
						<RichText.Content tagName="p" value={ lede } />
					) }
					{ button && (
						<a href="#" className="button js-bu-block-drawer-open">
							{ button }
						</a>
					) }
				</div>
				<section className="wp-block-editorial-drawer-content js-bu-block-drawer-content">
					<div className="wp-block-editorial-drawer-wrapper">
						<InnerBlocks.Content />
						<div className="wp-block-editorial-drawer-close">
							<button className="wp-block-editorial-drawer-close-button js-bu-block-drawer-close">
								Close
							</button>
						</div>
					</div>
				</section>
			</aside>
		);
	},
} );
