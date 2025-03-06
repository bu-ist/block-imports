/**
 * BLOCK: editorial/photoessay/image
 *
 * Register an individual image block for the photo essay block.
 *
 * Instead of using InnerBlocks with the default image block as the only
 * allowed block, this is a simplified version of the default image block.
 * This approach will prevent an extra block layer that could confuse users,
 * avoids the alignment options of the default image block, and may help with
 * the modal functionality of the photo essay block.
 */

 import getAllowedFormats from '../../global/allowed-formats';

// WordPress dependencies.
const {
	__,
} = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;
const {
	IconButton,
	PanelBody,
	Toolbar,
} = wp.components;
const {
	Fragment,
} = wp.element;
const {
	BlockControls,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
	RichText,
} = ( 'undefined' === typeof wp.blockEditor ) ? wp.editor : wp.blockEditor;
const {
	addFilter
} = wp.hooks;
const {
	createHigherOrderComponent
} = wp.compose;


// Register the block.
registerBlockType( 'editorial/photoessay-image', {
	title: __( 'Photo Essay Image' ),
	description: __( 'An individual image block for use in photo essay rows.' ),
	icon: 'format-image',
	category: 'bu-editorial',
	parent: [ 'editorial/photoessay' ],
	attributes: {
		id: {
			type: 'number',
		},
		url: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'src',
		},
		alt: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'alt',
			default: '',
		},
		caption: {
			type: 'string',
		},
		columnClass: {
			type: 'string',
		},
	},
	supports: {
		className: false,
		customClassName: false,
		html: false,
		inserter: false,
		reusable: false,
	},

	getEditWrapperProps( { columnClass } ) {
		return { className: 'wp-block editor-block-list__block block-editor-block-list__block ' + columnClass };
	},

	edit( { attributes, setAttributes, isSelected } ) {
		const {
			id,
			url,
			alt,
			columnClass,
			caption,
		} = attributes;

		// Set attributes when an image is selected.
		const onSelectImage = ( media ) => {
			if ( ! media || ! media.id || ! media.url ) {
				onRemoveImage();

				return;
			}

			setAttributes( {
				id: media.id,
				url: ( media.sizes['large'] ) ? media.sizes['large'].url : media.url,
				alt: media.alt,
			} );
		};

		// Reset attributes when an image is removed.
		const onRemoveImage = () => {
			setAttributes( {
				id: undefined,
				url: undefined,
				alt: undefined,
			} );
		};

		return (
			<Fragment>
				<div className="wp-block-photoessay-media">
					<MediaUploadCheck>
						{ ! url && (
							<MediaPlaceholder
								icon="format-image"
								label="Image"
								labels={ {
									title: 'Image',
									name: 'images',
								} }
								onSelect={ onSelectImage }
								allowedTypes={ [ 'image' ] }
							/>
						) }
						{ url && (
							<BlockControls>
								{ isSelected && (
								<Toolbar>
									<MediaUpload
										onSelect={ onSelectImage }
										value={ id }
										allowedTypes={ [ 'image' ] }
										render={ ( { open } ) => (
											<div>
												<IconButton
													className="components-toolbar__control"
													label="Edit image"
													icon="edit"
													onClick={ open }
												/>
												<IconButton
													icon="no-alt"
													onClick={ onRemoveImage }
													className="blocks-gallery-image__remove"
													label="Remove image"
												/>
											</div>
										) }
									/>
								</Toolbar>
								) }
							</BlockControls>
						) }
					</MediaUploadCheck>
					{ url && (
						<figure>
							<img
								src={ url }
								alt={ alt }
								className={ id ? `wp-image-${ id }` : null }
							/>
						</figure>
					) }

					{ ( ( ! RichText.isEmpty( caption ) || isSelected ) && url ) && (
						<div className="wp-block-photoessay-media-caption-editor-wrapper">
							<RichText
								tagName="p"
								className="wp-block-photoessay-media-caption wp-prepress-component-caption"
								placeholder={ __( 'Add a caption and/or media credit...' ) }
								value={ caption }
								onChange={ value => setAttributes( { caption: value } ) }
								formattingControls={ getAllowedFormats( 'formattingControls', [ 'bold', 'italic', 'link' ] ) }
								allowedFormats={ getAllowedFormats( 'allowedFormats', [ 'core/bold', 'core/italic', 'core/link' ] ) }
								keepPlaceholderOnFocus
							/>
						</div>
					) }
				</div>

			</Fragment>
		);
	},

	save( { attributes } ) {
		const {
			id,
			url,
			alt,
			columnClass,
			caption,
		} = attributes;

		return (
			<div className={ columnClass }>
				<div className="wp-block-photoessay-media">
					<figure>
						<img
							src={ url }
							alt={ alt }
							className={ id ? `wp-image-${ id }` : null }
						/>
						{ !RichText.isEmpty( caption ) &&
							<figcaption>
							<RichText.Content
								tagName="p"
								className="wp-block-photoessay-media-caption wp-prepress-component-caption"
								value={ caption }
							/>
							</figcaption>
						}
					</figure>
				</div>
			</div>
		);
	},
} );
