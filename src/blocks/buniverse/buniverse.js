/**
 * BLOCK: bu/buniverse
 *
 * Register a BUniverse embed block with Gutenberg.
 */

// External dependencies.
import classnames from 'classnames';

// Internal dependencies.
import getAllowedFormats from '../../global/allowed-formats';
import blockIcons from '../../components/block-icons/';

//  Import CSS.
import './style.scss';
import './editor.scss';

// WordPress dependencies.
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { Fragment } = wp.element;
const { PanelBody, Path, RadioControl, SVG, TextControl, ToggleControl } =
	wp.components;
const { InspectorControls, RichText } =
	'undefined' === typeof wp.blockEditor ? wp.editor : wp.blockEditor;

/**
 * Returns the class list for the block based on the current settings.
 *
 * @param {string} className     Default classes assigned to the block.
 * @param {string} stylizedTitle If the block has a stylized title.
 * @param          aspectRatio
 */
const getClasses = ( className, aspectRatio ) => {
	return classnames( 'wp-block-global-buniverse', {
		[ aspectRatio ]: aspectRatio,
		[ className ]: className,
	} );
};

// Register the block.
registerBlockType( 'bu/buniverse', {
	title: __( 'BUniverse Video' ),
	description: __( '' ),
	icon: blockIcons( 'buniverse' ),
	category: 'bu',
	attributes: {
		id: {
			type: 'string',
		},
		aspectRatio: {
			type: 'string',
		},
		caption: {
			type: 'string',
		},
		controls: {
			type: 'number',
			default: 1,
		},
		autoplay: {
			type: 'number',
			default: 0,
		},
		start: {
			type: 'number',
		},
		minutes: {
			type: 'number',
		},
		seconds: {
			type: 'number',
		},
		className: {
			type: 'string',
			default: '',
		},
	},
	supports: {
		align: true,
	},

	edit( props ) {
		const {
			attributes: {
				id,
				aspectRatio,
				caption,
				controls,
				autoplay,
				minutes,
				seconds,
			},
			className,
			isSelected,
			setAttributes,
		} = props;

		/**
		 * Sets the value for the `minutes` attribute and
		 * calculates a new value to set for the `start` attribute.
		 *
		 * Note: no calculations are done to account for values
		 * greater than 60 entered into the `seconds` input, so
		 * as to avoid subverting expectations in cases where a
		 * user might deliberately do so.
		 *
		 * @param {string} value The value entered into the input.
		 */
		const onChangeMinutes = ( value ) => {
			const newValue = Number( value );
			const newStart = newValue * 60 + ( seconds ? seconds : 0 );

			setAttributes( { minutes: newValue } );
			setAttributes( { start: newStart } );
		};

		/**
		 * Sets the value for the `seconds` attribute and
		 * calculates a new value to set for the `start` attribute.
		 *
		 * Note: See the above note about calculating `seconds` values.
		 *
		 * @param {string} value The value entered into the input.
		 */
		const onChangeSeconds = ( value ) => {
			const newValue = Number( value );
			const newStart = newValue + ( minutes ? minutes * 60 : 0 );

			setAttributes( { seconds: newValue } );
			setAttributes( { start: newStart } );
		};

		// Build out the basic url, intentionally leaving off the extra parameters
		// because they cause the iframe to reload every time they're changed.
		const url = `//www.bu.edu/buniverse/interface/embed/embed.html?v=${ id }&jsapi=1`;

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title={ __( 'Video Settings' ) }>
						<RadioControl
							className="buniverse-aspect-ratio-options"
							label={ __( 'Aspect Ratio' ) }
							selected={ aspectRatio }
							help={ __(
								'16:9 is typically used on widescreen video. 4:3 is often used for older fullscreen video. 1:1 is square. 9:16 and 3:4 are used for vertical video.'
							) }
							options={ [
								{
									label: '16:9',
									value: 'has-aspectratio-16by9',
								},
								{ label: '4:3', value: 'has-aspectratio-4by3' },
								{ label: '1:1', value: 'has-aspectratio-1by1' },
								{ label: '3:4', value: 'has-aspectratio-3by4' },
								{
									label: '9:16',
									value: 'has-aspectratio-9by16',
								},
							] }
							onChange={ ( option ) =>
								setAttributes( { aspectRatio: option } )
							}
						/>
						<div className="buniverse-parameter-toggles">
							<ToggleControl
								label={ __( 'Hide Player Controls' ) }
								checked={ controls === 0 }
								onChange={ () =>
									setAttributes( {
										controls: controls === 0 ? 1 : 0,
									} )
								}
							/>
							<ToggleControl
								label={ __( 'Auto Start (muted)' ) }
								checked={ autoplay === 1 }
								onChange={ () =>
									setAttributes( {
										autoplay: autoplay === 0 ? 1 : 0,
									} )
								}
							/>
						</div>
						<div className="buniverse-start-time">
							<TextControl
								label={ __( 'Start At' ) }
								type="number"
								value={ minutes }
								onChange={ onChangeMinutes }
							/>
							:
							<TextControl
								type="number"
								value={ seconds }
								onChange={ onChangeSeconds }
							/>
						</div>
					</PanelBody>
				</InspectorControls>
				{ id && isSelected && (
					<TextControl
						label={ __( 'Video ID:' ) }
						className="buniverse-set-video-id"
						value={ id }
						onChange={ ( value ) => setAttributes( { id: value } ) }
					/>
				) }
				<figure className={ getClasses( className, aspectRatio ) }>
					<div className="wp-block-global-buniverse-wrapper">
						{ ! id && (
							<div className="wp-block-global-buinverse-placeholder">
								<div className="buniverse-logo"></div>
								<TextControl
									placeholder={ __(
										'Enter BUniverse video ID here…'
									) }
									value={ id }
									onChange={ ( value ) =>
										setAttributes( { id: value } )
									}
								/>
								<div className="buniverse-video-id-screenshot"></div>
							</div>
						) }
						{ id && (
							<iframe
								src={ url }
								frameBorder="0"
								allow="autoplay; fullscreen"
							></iframe>
						) }
					</div>

					{ ( ! RichText.isEmpty( caption ) || isSelected ) && (
						<figcaption>
							<RichText
								tagName="p"
								className="wp-block-global-buniverse-caption wp-prepress-component-caption"
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
						</figcaption>
					) }
				</figure>
			</Fragment>
		);
	},

	save( { attributes } ) {
		const {
			id,
			aspectRatio,
			caption,
			controls,
			autoplay,
			start,
			className,
		} = attributes;

		// Build out the full url.
		let url = `//www.bu.edu/buniverse/interface/embed/embed.html?v=${ id }&jsapi=1`;
		url += controls !== 1 ? '&controls=0' : '';
		url += autoplay === 1 ? '&autoplay=true' : '';
		url += start ? `&start=${ start }` : '';

		return (
			<figure className={ getClasses( className, aspectRatio ) }>
				<div className="wp-block-global-buniverse-wrapper">
					{ id && (
						<iframe
							src={ encodeURI( url ) }
							frameBorder="0"
							allow="autoplay; fullscreen"
						></iframe>
					) }
				</div>
				{ caption && (
					<figcaption>
						<p className="wp-block-global-buniverse-caption wp-prepress-component-caption">
							{ caption }
						</p>
					</figcaption>
				) }
			</figure>
		);
	},
} );
