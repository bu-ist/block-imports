/**
 * BLOCK: collapsible
 *
 * A collapsible content block.
 */

// External dependencies.
import classnames from 'classnames';

// Import CSS.
import './style.scss';
import './editor.scss';

// Internal dependencies.
import allowedBlocks from '../../components/allowed-blocks';
import blockIcons from '../../components/block-icons';

// WordPress dependencies.
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const {
	PanelBody,
	ToggleControl,
	SelectControl,
	TextControl,
	RangeControl,
	Path,
	SVG,
	Button,
	ButtonGroup,
} = wp.components;
const { InnerBlocks, BlockControls, InspectorControls, RichText } =
	wp.blockEditor;
const { select } = wp.data;
const { getBlocks } = select( 'core/block-editor' );

import HeadingToolbar from '../headline/heading-toolbar';

// Register the block.
registerBlockType( 'bu/collapsible', {
	name: 'bu/collapsible',
	title: __( 'Collapsible' ),
	description: __( 'A collapsible content block.' ),
	icon: blockIcons( 'collapsible' ),
	category: 'bu',
	supports: {
		align: [ 'wide', 'full' ],
	},
	attributes: {
		title: {
			type: 'string',
			default: '',
		},
		level: {
			type: 'number',
			default: 2,
		},
		isOpen: {
			type: 'boolean',
			default: false,
		},
		iconStyle: {
			type: 'string',
			default: 'plus-minus',
		},
		customMarginBottom: {
			type: 'boolean',
			default: false,
		},
		marginBottom: {
			type: 'number',
			default: 0,
		},
		id: {
			type: 'string',
			default: '',
		},
		buttonOpenLabel: {
			type: 'string',
			default: 'Read More',
		},
		buttonCloseLabel: {
			type: 'string',
			default: 'Close',
		},
	},
	styles: [
		{
			name: 'plain',
			label: __( 'Plain' ),
			isDefault: true,
		},
		{
			name: 'outline',
			label: __( 'Outline' ),
		},
		{
			name: 'preview',
			label: __( 'Preview' ),
		},
	],

	edit( props ) {
		const { attributes, setAttributes, clientId, className } = props;
		const {
			title,
			level,
			isOpen,
			iconStyle,
			customMarginBottom,
			marginBottom,
			id,
			buttonCloseLabel,
			buttonOpenLabel,
		} = attributes;
		const TagName = `h${ level }`;

		const isPreviewStyle = className.includes( 'is-style-preview' );

		const allowedBlockList = allowedBlocks().filter(
			( block ) => undefined !== block
		);
		allowedBlockList.push( 'bu/collapsible' );

		// Add an offset to the bottom margin in the editor to account for the container element padding
		const editorContainerPaddingOffset = 28;

		// Generate anchor if not set
		if ( ! id ) {
			setAttributes( {
				id: `bu-collapsible-${ clientId.split( '-', 1 ) }`,
			} );
		}

		const styles = {
			marginBottom:
				( customMarginBottom ? marginBottom : 0 ) +
				editorContainerPaddingOffset,
		};

		return (
			<div
				className={ classnames(
					className,
					{ 'is-open': isOpen },
					`icon-style-${ iconStyle }`
				) }
				style={ styles }
			>
				<InspectorControls>
					{ ! isPreviewStyle && (
						<PanelBody title={ __( 'Icon Style' ) }>
							<ButtonGroup className="icon-style-button">
								<Button
									isPrimary={ 'plus-minus' === iconStyle }
									isSecondary={ 'plus-minus' !== iconStyle }
									showTooltip={ true }
									label={ __( 'Plus/Minus' ) }
									onClick={ ( value ) =>
										setAttributes( {
											iconStyle: 'plus-minus',
										} )
									}
								>
									+ -
								</Button>
								<Button
									isPrimary={ 'arrows' === iconStyle }
									isSecondary={ 'arrows' !== iconStyle }
									showTooltip={ true }
									label={ __( 'Arrows' ) }
									onClick={ ( value ) =>
										setAttributes( { iconStyle: 'arrows' } )
									}
								>
									&#62721; &#62720;
								</Button>
							</ButtonGroup>
						</PanelBody>
					) }

					{ isPreviewStyle && (
						<PanelBody title={ __( 'Button Labels' ) }>
							<TextControl
								label={ __( 'Open Button Label' ) }
								value={ buttonOpenLabel }
								onChange={ ( value ) =>
									setAttributes( { buttonOpenLabel: value } )
								}
							/>
							<TextControl
								label={ __( 'Close Button Label' ) }
								value={ buttonCloseLabel }
								onChange={ ( value ) =>
									setAttributes( { buttonCloseLabel: value } )
								}
							/>
						</PanelBody>
					) }

					{ ! isPreviewStyle && (
						<PanelBody title={ __( 'Default Collapsible Status' ) }>
							<ToggleControl
								label={ __( 'Open' ) }
								checked={ isOpen }
								onChange={ () =>
									setAttributes( { isOpen: ! isOpen } )
								}
							/>
						</PanelBody>
					) }

					<PanelBody title={ __( 'Spacing' ) }>
						<ToggleControl
							label={ __( 'Custom spacing' ) }
							checked={ customMarginBottom }
							onChange={ () =>
								setAttributes( {
									customMarginBottom: ! customMarginBottom,
								} )
							}
						/>

						{ customMarginBottom && (
							<RangeControl
								label={ __( 'Bottom Margin (px)' ) }
								value={ marginBottom }
								onChange={ ( value ) =>
									setAttributes( { marginBottom: value } )
								}
								min={ 0 }
								max={ 200 }
								step={ 1 }
							/>
						) }
					</PanelBody>

					<PanelBody title={ __( 'Anchor ID' ) }>
						<TextControl
							label={ __( 'Unique HTML ID' ) }
							value={ id }
							onChange={ ( value ) =>
								setAttributes( { id: value } )
							}
						/>
					</PanelBody>
				</InspectorControls>

				<BlockControls>
					<HeadingToolbar
						minLevel={ 2 }
						maxLevel={ 7 }
						selectedLevel={ level }
						onChange={ ( newLevel ) =>
							setAttributes( { level: newLevel } )
						}
					/>
				</BlockControls>

				<TagName className="bu-collapsible-heading">
					{ /* Using div because button cause issue in editor */ }
					{ ! isPreviewStyle && (
						<RichText
							tagName={ 'div' }
							className="bu-block-collapsible-toggle"
							value={ title }
							onChange={ ( value ) =>
								setAttributes( { title: value } )
							}
							placeholder={ __( 'Heading…' ) }
							formattingControls={ [ 'bold', 'italic' ] }
						/>
					) }

					{ isPreviewStyle && (
						<RichText
							tagName={ 'div' }
							className=""
							value={ title }
							onChange={ ( value ) =>
								setAttributes( { title: value } )
							}
							placeholder={ __( 'Heading…' ) }
							formattingControls={ [ 'bold', 'italic' ] }
						/>
					) }
				</TagName>

				<div className="bu-block-collapsible-content">
					<InnerBlocks allowedBlocks={ allowedBlockList } />
				</div>

				{ isPreviewStyle && (
					<div className="button">{ buttonOpenLabel }</div>
				) }
			</div>
		);
	},

	save( { attributes } ) {
		return <InnerBlocks.Content />;
	},
} );
