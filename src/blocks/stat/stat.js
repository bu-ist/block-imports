/**
 * BLOCK: bu/stat
 *
 * Register a stat block with Gutenberg.
 */

// External dependencies.
import classnames from 'classnames';

// Import CSS.
import './style.scss';
import './editor.scss';

// Internal dependencies.
import themeOptions from '../../global/theme-options';
import getAllowedFormats from '../../global/allowed-formats';
import blockIcons from '../../components/block-icons/';

// WordPress dependencies.
const {
	__,
} = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;
const {
	Circle,
	PanelBody,
	Path,
	RangeControl,
	SVG,
} = wp.components;
const {
	InspectorControls,
	PanelColorSettings,
	PlainText,
	RichText,
	withColors,
} = ( 'undefined' === typeof wp.blockEditor ) ? wp.editor : wp.blockEditor;

/**
 * Returns the class list for the block based on the current settings.
 *
 * @param {string} circleOneColor The color option for circle 1.
 * @param {string} circleTwoColor The color option for circle 2.
 * @param {string} className      Default classes assigned to the block.
 * @param {number} numberSize     The size at which to display the stat number.
 */
const getBlockClasses = ( circleOneColor, circleTwoColor, className, numberSize ) => {
	return (
		classnames(
			className,
			{
				[ `has-circle1-color-${circleOneColor}` ]: circleOneColor,
				[ `has-circle2-color-${circleTwoColor}` ]: circleTwoColor,
				[ `has-number-size-${numberSize}` ]: numberSize,
			}
		)
	);
};

/**
 * The markup for the stat SVG.
 *
 * @param {number} circleOneFill The percentage of circle one to fill in.
 * @param {number} circleTwoFill The percentage of circle two to fill in.
 */
const statSVG = ( circleOneFill, circleTwoFill ) => (
	<SVG
		className="wp-block-bu-stat-svg"
		xmlns="http://www.w3.org/2000/svg"
		width="100px"
		height="100px"
		viewBox="0 0 100 100"
		style={ { enableBackground: 'new 0 0 100 100' } }
	>
		<Circle
			className="wp-block-bu-stat-circle1"
			cx="50"
			cy="50"
			r="47"
			style={ { strokeDashoffset: `${ 302 * ( 1 - ( circleOneFill * 0.01 ) ) }` } }
		/>
		<Circle
			className="wp-block-bu-stat-circle2"
			cx="50"
			cy="50"
			r="47"
			style={ { strokeDashoffset: `${ 302 * ( 1 - ( circleTwoFill * 0.01 ) ) }` } }
		/>
	</SVG>
);

// Register the block.
registerBlockType( 'bu/stat', {
	parent: [ 'bu/stats' ],
	title: __( 'Stat' ),
	description: __( 'Display statistical information.' ),
	icon: blockIcons('stat'),
	category: 'bu',
	attributes: {
		circleOneColor: {
			type: 'string',
			default: '',
		},
		circleOneFill: {
			type: 'number',
			default: 100,
		},
		circleTwoColor: {
			type: 'string',
			default: '',
		},
		circleTwoFill: {
			type: 'number',
			default: 25,
		},
		className: {
			type: 'string',
			default: '',
		},
		number: {
			type: 'string',
			default: '',
			source: 'text',
			selector: '.wp-block-bu-stat-number',
		},
		numberSize: {
			type: 'number',
			default: 2,
		},
		postText: {
			type: 'string',
			default: '',
			source: 'html',
			selector: '.wp-block-bu-stat-text-post',
		},
		preText: {
			type: 'string',
			default: '',
			source: 'html',
			selector: '.wp-block-bu-stat-text-pre',
		},
	},
	supports: {
		inserter: false,
	},

	edit: withColors( 'circleOneColor', 'circleTwoColor' )( props => {
		const {
			attributes: {
				circleOneFill,
				circleTwoFill,
				numberSize,
				number,
				postText,
				preText,
			},
			circleOneColor,
			circleTwoColor,
			className,
			isSelected,
			setAttributes,
			setCircleOneColor,
			setCircleTwoColor,
		} = props;

		return (
			<div className={ getBlockClasses( circleOneColor.slug, circleTwoColor.slug, className, numberSize ) }>
				<div className="wp-block-bu-stat-container-outer">
					<div className="wp-block-bu-stat-container-inner">

						{ ( isSelected || !RichText.isEmpty( preText ) ) &&
							<RichText
								tagName="div"
								className="wp-block-bu-stat-text-pre"
								placeholder={ __( 'Opening text…' ) }
								value={ preText }
								onChange={ value => setAttributes( { preText: value } ) }
								formattingControls={ getAllowedFormats( 'formattingControls', [ 'bold', 'italic' ] ) }
								allowedFormats={ getAllowedFormats( 'allowedFormats', [ 'core/bold', 'core/italic' ] ) }
							/>
						}

						<div className="wp-block-bu-stat-number">
							<PlainText
								placeholder={ __( 'Number…' ) }
								value={ number }
								onChange={ number => setAttributes( { number } ) }
							/>
						</div>

						{ ( isSelected || !RichText.isEmpty( postText ) ) &&
							<RichText
								tagName="div"
								className="wp-block-bu-stat-text-post"
								placeholder={ __( 'Closing text…' ) }
								value={ postText }
								onChange={ value => setAttributes( { postText: value } ) }
								formattingControls={ getAllowedFormats( 'formattingControls', [ 'bold', 'italic' ] ) }
								allowedFormats={ getAllowedFormats( 'allowedFormats', [ 'core/bold', 'core/italic' ] ) }
							/>
						}

						{ statSVG( circleOneFill, circleTwoFill ) }

					</div>
				</div>

				<InspectorControls>
					<PanelBody title={ __( 'Display Options' ) } >
						<RangeControl
							label={ __( 'Number Size' ) }
							value={ numberSize }
							onChange={ value => setAttributes( { numberSize: value } ) }
							min={ 1 }
							max={ 4 }
							step={ 1 }
						/>
						<RangeControl
							label={ __( 'Bottom Circle Fill' ) }
							value={ circleOneFill }
							onChange={ circleOneFill => setAttributes( { circleOneFill } ) }
							min={ 0 }
							max={ 100 }
							step={ 1 }
						/>
						<RangeControl
							label={ __( 'Top Circle Fill' ) }
							value={ circleTwoFill }
							onChange={ circleTwoFill => setAttributes( { circleTwoFill } ) }
							min={ 0 }
							max={ 100 }
							step={ 1 }
						/>
					</PanelBody>
					<PanelColorSettings
						title={ __( 'Color Options' ) }
						colorSettings={ [
							{
								value: circleOneColor.color,
								onChange: setCircleOneColor,
								label: __( 'Bottom Circle' ),
								disableCustomColors: true,
								colors: themeOptions(),
							},
							{
								value: circleTwoColor.color,
								onChange: setCircleTwoColor,
								label: __( 'Top Circle' ),
								disableCustomColors: true,
								colors: themeOptions(),
							},
						] }
					/>
				</InspectorControls>

			</div>
		);
	} ),

	save( { attributes }) {
		const {
			circleOneColor,
			circleOneFill,
			circleTwoColor,
			circleTwoFill,
			className,
			number,
			numberSize,
			postText,
			preText,
		} = attributes;

		return (
			<div className={ getBlockClasses( circleOneColor, circleTwoColor, className, numberSize ) }>
				<div className="wp-block-bu-stat-container-outer">
					<div className="wp-block-bu-stat-container-inner">
						{ !RichText.isEmpty( preText ) &&
							<RichText.Content
								tagName="div"
								className="wp-block-bu-stat-text-pre"
								value={ preText }
							/>
						}
						<div className="wp-block-bu-stat-number">{ number }</div>
						{ !RichText.isEmpty( postText ) &&
							<RichText.Content
								tagName="div"
								className="wp-block-bu-stat-text-post"
								value={ postText }
							/>
						}
						{ statSVG( circleOneFill, circleTwoFill ) }
					</div>
				</div>
			</div>
		);
	},
} );
