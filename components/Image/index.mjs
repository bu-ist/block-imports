/**
 * A loading spinner to be used to indicate some activity is occuring.
 *
 * @param {string} mediaObj todo.
 * @param {string} size     todo.
 * @param {string} density  todo.
 *
 * @return {Element} Element to render, in this case an DIV.
 */

// External dependencies.
import classnames from 'classnames';

import {
	MediaPlaceholder,
	InspectorControls,
	MediaUploadCheck,
	MediaUpload
} from '@wordpress/block-editor';

import {
	Button,
	IconButton,
	FocalPointPicker,
	PanelBody,
	PanelRow,
	Placeholder
} from '@wordpress/components';

import { more } from '@wordpress/icons';

import { __ } from '@wordpress/i18n';




// BU dependencies.
import {
	fetchMedia,
	fetchImage,
	LoadingSpinner,
} from '../../index.js';

// Import CSS.
import './editor.scss';

/**
 * Returns the class list for the component based on the current settings.
 *
 * @param {string} className  Additional classes assigned to the component.
 * @param {string} text     If the component has loading text set.
 * @param {string} shadow    If the component has a shadow set.
 */
const getClasses = ( className ) => classnames(
	'bu-components-image',
	{
		[ className ]: className,
	}
);

// Export component.
export const Image = ( props ) => {
	const {
		className = undefined,
		mediaId = undefined,
		size = 'full',
		tag = 'img',
		altSource = 'alt',
		onSelect,
		onRemove,
		focalPoint = { x: 0.5, y: 0.5 },
		onChangeFocalPoint = undefined,
		labels = {},
		canEditImage = true,
		canOverrideImage = true,
		allowedTypes = ['image'],
		debug = false,
		...rest
	} = props;

	// Is an image set already?
	const hasImage = ( mediaId ) ? true : false;

	// If component has FocalPoint Handler Function show the focal picker.
	const displayFocalPointPicker = typeof onChangeFocalPoint === 'function';

	/**
	 * Fetch the media based on the attachment ID utilizing useSelect
	 *
	 * Returns Media object
	 */
		const { mediaObj, isResolvingMedia, hasResolvedMedia } =
		fetchMedia( mediaId );


	// If Debug is set to true, output some helpful information to the
	// console for block developers to utilize media object info in their block development.
	if ( debug ) {
		if ( isResolvingMedia ) {
			console.log( "Image Media Fetch in Progress: ", isResolvingMedia );
		}
		if ( hasResolvedMedia ) {
			console.log( "Image Media Fetched: ", mediaObj );
		}
	}

	// If media is being fetched, just show the spinner.
	if ( isResolvingMedia ) {
		return <LoadingSpinner text="LoadingSpinner" />;
	}

	// If there is no image set, and the user can't edit the image show placeholder
	if ( !hasImage && !canEditImage ) {
		return (<><p>!hasImage && !canEditImage</p><Placeholder className="bu-components-image-media-placeholder" icon={ more } label="Placeholder" withIllustration /></>);
	}

	// If there is no image set, and the user can edit the image, show Media Placeholder
	if ( !hasImage && canEditImage ) {
		return (<><p>!hasImage && canEditImage</p>
			<MediaPlaceholder
				labels={labels}
				onSelect={onSelect}
				accept="image"
				multiple={false}
				allowedTypes={allowedTypes}
			/></>
		);
	}

	if (displayFocalPointPicker) {
		const focalPointStyle = {
			objectFit: 'cover',
			objectPosition: `${focalPoint.x * 100}% ${focalPoint.y * 100}%`,
		};

		rest.style = {
			...rest.style,
			...focalPointStyle,
		};
	}


// Let's get everything we need to display a specific size.
const imgObj = fetchImage( mediaObj, 'thumbnail' );
if ( ! imgObj ) {
	return <p>imgObj b0rked.</p>;
}


const sources = [];
	if (tag === 'picture') {
		const srcset = {
			sources: [
				{
					srcset: fetchImage( mediaObj, 'medium' ).src,
					media: '(min-width: 600px)',
					type: imgObj.mime_type,
				},
				{
					srcset: fetchImage( mediaObj, 'large' ).src,
					media: '(min-width: 300px)',
				},
			],
		};
		for (let i = 0; i < srcset.sources.length; i++) {
			let source = srcset.sources[i];
			sources.push(<source
				srcset={source.srcset}
				media={source.media}
				type={source.type}
			/>);
		  }
	}





// The component also supports uploading or selecting an image from the media library and allowing the user to remove the image.
	// @todo selector/uploader/replacer



	/**
	 * TODOs...
	// make inspector options for all the settings?
	// + option for what to use for alt, or custom
	// + option for

The developer can choose to use this component with or without the ability to edit, select, or remove the image.

For example if the image should always be displayed and the ID of the image is already known such as the featured image by getting it using the Post Chooser component along with the rest of the post data you can choose to not permit the image to be removed by leaving the onRemove function passed to the component empty. You'll also want to set canEditImage to false so that no edit controls are presented to the user.

To prevent the user from editing (overriding) the featured image leave the option canOverrideImage to false.

This component can be used when building a block and you do want to allow the user to upload or select an image from the media library. This would be the typical case when there is no previously selected post to grab an image from.

In that scenario you'll want to setup your own onSelect handler, and onRemove handlers.

The Component also supports an optional Focal Point Control to allow the focal point of the image to be set for use with Object-Fit scaling.
	 *
	 *
	 *
The component should support the following use cases:

√ Displays an image by passing in an ID for a media library item

Displays an Upload/Select Media Component allowing the admin user to select or upload a media library item.

Displays an image by passing in an ID for a media library item and then allows admin user to override that image and replace it with a different image. (This would be to allow a default such as the featured image from the selected post, but then let the admin override that and provide a different photo).

Features:

Label customizations - allow block developers to adjust the labels of the component UI

Size option - should control what Image Size is fetched and displayed in the editor. (Full, Medium, custom, etc)

Display Size/dimensions - should control the width/height the component is displayed in the editor

Focal point picker - optional selection of the focal point of the image for use with Object-Fit

Placeholder image - We may want to support passing in a custom placeholder image to display until the selected image is fetched?

Future ideas: Control over setting Src set to allow for customization of images at different breakpoints?
	 *



what tag to use

	 */

	return (
		<div>
			{ ( canOverrideImage || onRemove || displayFocalPointPicker ) && (
				<InspectorControls>
					<PanelBody title={__('Image Settings')}>
						{ ( canOverrideImage || onRemove) && (
							<>
								<h2>{__('Selected Image')}</h2>
								<PanelRow>
									{ canOverrideImage && (
										<MediaUploadCheck>
											<MediaUpload
												onSelect={onSelect}
												value={mediaId}
												allowedTypes={ allowedTypes }
												render={({open}) => (
													<IconButton
														className="bu-components-image-media-edit-button"
														onClick={ open }
														icon='edit'
														label={ __( 'Edit Media' ) }
														isDefault
														isLarge
													>
														{ __( 'Edit' ) }
													</IconButton>
												)}
											/>
										</MediaUploadCheck>
									)}
									{ onRemove && (
										<>
											<Button
												className="bu-components-image-media-remove-button"
												onClick={ onRemove }
												label={ ( 'Remove Media' ) }
												isLink
											>
												{ __( 'Remove Media' ) }
											</Button>
										</>
									)}
								</PanelRow>
							</>
						)}
						{displayFocalPointPicker && (
							<PanelRow>
								<FocalPointPicker
									className="bu-components-image-media-edit-focalpoint"
									label={__('Focal Point Picker')}
									url={imageUrl}
									value={focalPoint}
									onChange={onChangeFocalPoint}
								/>
							</PanelRow>
						)}
					</PanelBody>
				</InspectorControls>
			)}
			{ ( tag === 'picture' ) && (
				<>
					<h3>picture</h3>
					<picture
						className={ getClasses( className ) }
						{...rest}
					>
						{sources}
					<img
						src={imgObj.src}
						alt={imgObj.alt}
					/>
					</picture>
				</>
			)}
			{ ( tag === 'figure' ) && (
				<>
					<h3>figure</h3>
					<figure
						className={ getClasses( className ) }
						{...rest}
					>
						<img
						src={imgObj.src}
						alt=""
					/>
					<figcaption>{imgObj.alt}</figcaption>
					</figure>
				</>
			)}
			{ ( tag === 'img' ) && (
				<>
					<h3>img</h3>
					<img
						className={ getClasses( className ) }
						src={imgObj.src}
						alt={imgObj.alt}
						{...rest}
					/>
				</>
			)}
		</div>
	)
};
// npx wp-scripts lint-js ./utils --fix
