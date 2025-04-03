/**
 * BLOCK: bu/leadin
 *
 * Register a leadin block with Gutenberg.
 */

// External dependencies.
import classnames from 'classnames';

// Import CSS.
import './style.scss';
import './editor.scss';

// Internal dependencies
import themeOptions from '../../global/theme-options';
import getAllowedFormats from '../../global/allowed-formats';
import publicationSlug from '../../global/publication-slug';
import Background, { BackgroundAttributes } from '../../components/background';
import blockIcons from '../../components/block-icons/';

// WordPress dependencies.
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { Fragment } = wp.element;
const { PanelBody, Path, RangeControl, SelectControl, SVG, ToggleControl } =
	wp.components;
const {
	InspectorControls,
	PanelColorSettings,
	RichText,
	URLInput,
	withColors,
} = 'undefined' === typeof wp.blockEditor ? wp.editor : wp.blockEditor;
const { applyFilters } = wp.hooks;

// Block attributes.
const blockAttributes = {
	head: {
		type: 'string',
	},
	deck: {
		type: 'string',
	},
	caption: {
		type: 'string',
	},
	imageFocus: {
		type: 'string',
		default: 'center-middle',
	},
	textPositionX: {
		type: 'string',
		default: 'x-center',
	},
	textPositionY: {
		type: 'string',
		default: '',
	},
	wide: {
		type: 'boolean',
		default: false,
	},
	box: {
		type: 'boolean',
		default: false,
	},
	flip: {
		type: 'boolean',
		default: false,
	},
	className: {
		type: 'string',
	},
	themeColor: {
		type: 'string',
	},
	primaryTerm: {
		type: 'string',
	},
	metabar: {
		type: 'boolean',
		default: true,
	},
	metabardate: {
		type: 'boolean',
		default: false,
	},
	boxOpacity: {
		type: 'number',
		default: 100,
	},
	videoUncropped: {
		type: 'boolean',
		default: false,
	},
	url: {
		type: 'string',
		default: '',
	},
	...BackgroundAttributes,
};

// Block styles.
const blockStyles = [
	{
		name: 'default',
		label: __( 'Default (uncropped unscaled)' ),
		isDefault: true,
	},
	{
		name: 'default-alt',
		label: __( 'Default Alternate Order' ),
		isDefault: true,
	},
	{
		name: 'text-to-image',
		label: __( 'Text over Horizontal Image' ),
	},
	{
		name: 'image-to-text',
		label: __( 'Horizontal Image over Text' ),
	},
	{
		name: 'emphasis-on-text',
		label: __( 'Overlapping Text' ),
	},
	{
		name: 'text-over-image',
		label: __( 'Image with Text Overlay' ),
	},
	{
		name: 'side-by-side',
		label: __( 'Vertical Image and Text Side By Side' ),
	},
];

const blockSupports = {
	className: false,
	customClassName: false,
	multiple: false,
};

registerBlockType( 'bu/leadin', {
	title: __( 'Leadin' ),
	description: __( 'The opening headline and image of an article.' ),
	icon: blockIcons( 'leadin' ),
	category: 'bu',
	attributes: blockAttributes,
	styles: blockStyles,
	supports: blockSupports,

	edit: withColors( 'themeColor' )( ( props ) => {
		// Get the block properties and attributes.
		const {
			attributes: {
				backgroundId,
				backgroundUrl,
				backgroundAutoplay,
				head,
				deck,
				caption,
				imageFocus,
				textPositionX,
				textPositionY,
				wide,
				box,
				flip,
				metabar,
				metabardate,
				boxOpacity,
				videoUncropped,
				url,
			},
			themeColor,
			setThemeColor,
			setAttributes,
			className,
			isSelected,
		} = props;

		const isStyleEmphasisOnText = className.includes(
			'is-style-emphasis-on-text'
		);
		const isStyleTextOverImage = className.includes(
			'is-style-text-over-image'
		);
		const isStyleSideBySide = className.includes( 'is-style-side-by-side' );
		const isStyleTextToImage = className.includes(
			'is-style-text-to-image'
		);
		const isStyleImageToText = className.includes(
			'is-style-image-to-text'
		);
		const publication = publicationSlug();

		const classes = classnames(
			'wp-block-editorial-leadin',
			{
				[ `${ publication }-block-editorial-leadin` ]:
					publication !== '',
			},
			className,
			{
				'has-box':
					box &&
					( isStyleEmphasisOnText ||
						isStyleTextOverImage ||
						isStyleSideBySide ),
				'has-wider': wide && isStyleSideBySide,
				'has-flip': flip && isStyleSideBySide,
				'has-media': backgroundUrl,
				'has-video-as-loop': backgroundAutoplay,
				'has-video-uncropped': videoUncropped,
				[ `has-media-focus-${ imageFocus }` ]: imageFocus,
				[ `has-text-position-${ textPositionX }` ]:
					textPositionX && isStyleTextOverImage,
				[ `has-text-position-${ textPositionY }` ]:
					textPositionY && isStyleTextOverImage,
				[ `has-${ themeColor.slug }-theme` ]: themeColor.slug,
			}
		);

		const boxClasses = classnames( 'container-words-inner', {
			[ `has-opacity-${ boxOpacity }` ]:
				boxOpacity !== 100 &&
				box &&
				( isStyleEmphasisOnText || isStyleTextOverImage ),
		} );

		// Return the background media positioning controls if a background is set.
		const mediaPositioningControls = () => {
			if ( ! backgroundId ) {
				return null;
			}

			return (
				<PanelBody
					title={ __( 'Media Positioning' ) }
					initialOpen={ false }
				>
					<SelectControl
						label={ __( 'Crop Media to:' ) }
						value={ imageFocus }
						onChange={ ( value ) =>
							setAttributes( { imageFocus: value } )
						}
						options={ [
							{ value: 'left-top', label: __( 'Left Top' ) },
							{
								value: 'left-middle',
								label: __( 'Left Center' ),
							},
							{
								value: 'left-bottom',
								label: __( 'Left Bottom' ),
							},
							{ value: 'center-top', label: __( 'Center Top' ) },
							{ value: 'center-middle', label: __( 'Center' ) },
							{
								value: 'center-bottom',
								label: __( 'Center Bottom' ),
							},
							{ value: 'right-top', label: __( 'Right Top' ) },
							{
								value: 'right-middle',
								label: __( 'Right Center' ),
							},
							{
								value: 'right-bottom',
								label: __( 'Right Bottom' ),
							},
						] }
					/>
				</PanelBody>
			);
		};

		// Return the text positioning controls if the 'Image with Text Overlay' style is set.
		const textPositioningControls = () => {
			if ( ! isStyleTextOverImage ) {
				return null;
			}

			return (
				<Fragment>
					<SelectControl
						label={ __( 'Horizontal Text Positioning' ) }
						value={ textPositionX }
						onChange={ ( value ) =>
							setAttributes( { textPositionX: value } )
						}
						options={ [
							{ value: 'x-left', label: __( 'Left' ) },
							{ value: 'x-center', label: __( 'Center' ) },
							{ value: 'x-right', label: __( 'Right' ) },
						] }
					/>
					<SelectControl
						label={ __( 'Vertical Text Positioning' ) }
						value={ textPositionY }
						onChange={ ( value ) =>
							setAttributes( { textPositionY: value } )
						}
						options={ [
							{ value: 'y-top', label: __( 'Top' ) },
							{ value: '', label: __( 'Center' ) },
							{ value: 'y-bottom', label: __( 'Bottom' ) },
						] }
					/>
				</Fragment>
			);
		};

		// Return layout controls for the 'Vertical Image and Text Side By Side' style.
		const sideBySideLayoutControls = () => {
			if ( ! className.includes( 'is-style-side-by-side' ) ) {
				return null;
			}

			return (
				<Fragment>
					<ToggleControl
						label={ __( 'Flip Order' ) }
						checked={ flip }
						onChange={ () => setAttributes( { flip: ! flip } ) }
					/>
					<ToggleControl
						label={ __( 'Wide Layout' ) }
						checked={ wide }
						onChange={ () => setAttributes( { wide: ! wide } ) }
					/>
				</Fragment>
			);
		};

		// Return layout options if specific styles are set.
		const layoutControls = () => {
			if (
				! (
					isStyleEmphasisOnText ||
					isStyleTextOverImage ||
					isStyleSideBySide
				)
			) {
				return null;
			}

			return (
				<PanelBody title={ __( 'Layout Options' ) }>
					{ sideBySideLayoutControls() }
					{ textPositioningControls() }
					<ToggleControl
						label={ __( 'Boxed Text' ) }
						checked={ box }
						onChange={ () => setAttributes( { box: ! box } ) }
					/>
					{ box &&
						( isStyleEmphasisOnText || isStyleTextOverImage ) && (
							<RangeControl
								label={ __( 'Box Opacity' ) }
								value={ boxOpacity }
								onChange={ ( value ) =>
									setAttributes( { boxOpacity: value } )
								}
								min={ 10 }
								max={ 100 }
								step={ 10 }
							/>
						) }
				</PanelBody>
			);
		};

		// Return video cropping options if specific styles are set.
		const videoCropControls = () => {
			if ( ! ( isStyleTextToImage || isStyleImageToText ) ) {
				return null;
			}

			return (
				<PanelBody title={ __( 'Video Options' ) }>
					<ToggleControl
						label={ __( 'Leave Video Uncropped' ) }
						checked={ videoUncropped }
						onChange={ () =>
							setAttributes( {
								videoUncropped: ! videoUncropped,
							} )
						}
					/>
				</PanelBody>
			);
		};

		// Return the block editing interface.
		return (
			<Fragment>
				<div className={ classes }>
					<div className="container-lockup">
						<div className="wp-block-leadin-media">
							<Background blockProps={ props } />
						</div>
						<div className="container-words-outer">
							<div className={ boxClasses }>
								{ applyFilters(
									'buPrepress.PrimaryTerm',
									'',
									props
								) }
								<RichText
									tagName="h1"
									className="head"
									placeholder={ __( 'Add headline' ) }
									value={ head }
									onChange={ ( value ) =>
										setAttributes( { head: value } )
									}
									formattingControls={ getAllowedFormats(
										'formattingControls',
										[ 'bold', 'italic' ]
									) }
									allowedFormats={ getAllowedFormats(
										'allowedFormats',
										[ 'core/bold', 'core/italic' ]
									) }
									keepPlaceholderOnFocus
								/>
								{ ( ! RichText.isEmpty( deck ) ||
									isSelected ) && (
									<RichText
										tagName="h4"
										className="deck"
										placeholder={ __(
											'Add subheader (optional)'
										) }
										value={ deck }
										onChange={ ( value ) =>
											setAttributes( { deck: value } )
										}
										formattingControls={ getAllowedFormats(
											'formattingControls',
											[ 'bold', 'italic' ]
										) }
										allowedFormats={ getAllowedFormats(
											'allowedFormats',
											[ 'core/bold', 'core/italic' ]
										) }
									/>
								) }
							</div>
						</div>
					</div>
					{ ( ! RichText.isEmpty( caption ) || isSelected ) && (
						<RichText
							tagName="p"
							className="wp-block-editorial-leadin-caption wp-prepress-component-caption"
							placeholder={ __(
								'Add a caption and/or media credit…'
							) }
							value={ caption }
							onChange={ ( value ) =>
								setAttributes( { caption: value } )
							}
							formattingControls={ getAllowedFormats(
								'formattingControls',
								[ 'bold', 'italic', 'link' ]
							) }
							allowedFormats={ getAllowedFormats(
								'allowedFormats',
								[ 'core/bold', 'core/italic', 'core/link' ]
							) }
							keepPlaceholderOnFocus
						/>
					) }
				</div>

				{ applyFilters(
					'buBlocks.leadin.metaBar',
					'',
					metabar,
					metabardate
				) }

				<InspectorControls>
					{ mediaPositioningControls() }
					{ videoCropControls() }
					{ layoutControls() }
					<PanelColorSettings
						title={ __( 'Color Settings' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: themeColor.color,
								onChange: setThemeColor,
								label: __( 'Theme' ),
								disableCustomColors: true,
								colors: themeOptions(),
							},
						] }
					/>
					<PanelBody
						className="components-panel__body-bu-leadin-block-url"
						title={ __( 'URL' ) }
					>
						<p className="description">
							Link the leadin block to a story. (Optional)
						</p>
						<URLInput
							value={ url }
							onChange={ ( value ) =>
								setAttributes( { url: value } )
							}
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	} ),

	save() {
		// Rendering handled in PHP.
		return null;
	},
} );
