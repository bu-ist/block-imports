/**
 * BLOCK: bu-button
 *
 * Prompt visitors to take action with a custom button.
 */

// External dependencies.
import classnames from 'classnames';

// Internal dependencies.
import themeOptions from '../../global/theme-options';
import getAllowedFormats from '../../global/allowed-formats';
import publicationSlug from '../../global/publication-slug';
import blockIcons from '../../components/block-icons/';

import deprecated from './deprecated';

//  Import CSS.
import './style.scss';
import './editor.scss';

// WordPress dependencies.
const {
	__,
} = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;
const {
	Button,
	Dashicon,
	G,
	IconButton,
	PanelBody,
	Path,
	RadioControl,
	SVG,
} = wp.components;
const {
	Fragment,
} = wp.element;
const {
	InspectorControls,
	PanelColorSettings,
	RichText,
	URLInput,
	withColors,
} = ( 'undefined' === typeof wp.blockEditor ) ? wp.editor : wp.blockEditor;

// The current publication owner.
const publication = publicationSlug();

/**
 * Returns the class list for the block based on the current settings.
 *
 * @param {string} className  Additional classes assigned to the block.
 * @param {string} themeColor The theme color assigned to the block.
 * @param {string} icon       The icon placement.
 */
const getClasses = ( className, themeColor, icon ) => classnames(
	'wp-block-button',
	'wp-block-bu-button',
	{
		[ `${publication}-block-button` ]: publication && publication !== '',
		[ `has-${themeColor}-theme` ]: themeColor,
		[ `icon-navigateright ${icon}` ]: icon,
		[ className ]: className,
	}
);

// Register the block.
registerBlockType( 'bu/button', {

	title: __( 'Button' ),
	description: __( 'Prompt visitors to take action with a custom button.' ),
	icon: blockIcons('button'),
	category: 'bu',
	attributes: {
		url: {
			type: 'string',
			source: 'attribute',
			selector: 'a',
			attribute: 'href',
		},
		title: {
			type: 'string',
			source: 'attribute',
			selector: 'a',
			attribute: 'title',
		},
		text: {
			type: 'string',
			source: 'html',
			selector: 'a',
		},
		themeColor: {
			type: 'string',
		},
		icon: {
			type: 'string',
		},
		className: {
			type: 'string',
		}
	},
	styles: [
		{
			name: 'default',
			label: __( 'Default' ),
			isDefault: true
		},
		{
			name: 'outline',
			label: __( 'Outline' )
		},
		{
			name: 'text',
			label: __( 'Text' )
		},
		{
			name: 'accent',
			label: __( 'Accent' )
		},
	],
	supports: {
		className: false,
		customClassName: false,
		align: [ 'left', 'center', 'right' ],
	},

	edit: withColors( 'themeColor' )( props => {
		const {
			attributes: {
				text,
				url,
				icon,
			},
			themeColor,
			setThemeColor,
			setAttributes,
			isSelected,
			className,
		} = props;

		return (
			<Fragment>
				<InspectorControls>
					<PanelColorSettings
						title={ __( 'Color Settings' ) }
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
						<PanelBody title={ __( 'Icon Settings' ) }>
							<RadioControl
								label='Placement'
								selected={ icon }
								options={ [
									{ label: 'Before text', value: 'align-icon-left' },
									{ label: 'After text', value: 'align-icon-right' },
								] }
								onChange={ ( value ) => { setAttributes( { icon: value } ) } }
							/>
							<Button
								onClick={ () => setAttributes( { icon: undefined } ) }
								label={ ( 'Clear icon settings' ) }
								isDefault
								isSmall
							>
								{ __( 'Clear' ) }
							</Button>
						</PanelBody>

						<PanelBody
							className="components-panel__body-bu-button-block-url"
							title={ __( 'URL' ) }
						>
							<p className="description">Add link to the button</p>
							<URLInput
								value={ url }
								onChange={ ( value ) => setAttributes( { url: value } ) }
							/>
						</PanelBody>
					</InspectorControls>
				<p>
					<RichText
						placeholder={ __( 'Add text…' ) }
						value={ text }
						onChange={ ( value ) => setAttributes( { text: value } ) }
						formattingControls={ getAllowedFormats( 'formattingControls', [ 'bold', 'italic' ] ) }
						allowedFormats={ getAllowedFormats( 'allowedFormats', [ 'core/bold', 'core/italic' ] ) }
						className={ getClasses( className, themeColor.slug, icon ) }
						keepPlaceholderOnFocus
					/>
				</p>

			</Fragment>
		);
	} ),

	save( { attributes } ) {
		const {
			url,
			text,
			themeColor,
			icon,
			className,
		} = attributes;

		return (
			<p>
				<RichText.Content
					tagName="a"
					className={ getClasses( className, themeColor, icon ) }
					href={ url }
					value={ text }
				/>
			</p>
		);
	},

	deprecated,

} );
