// External dependencies.
import classnames from 'classnames';

import {
	MediaPlaceholder,
	InspectorControls,
	MediaUploadCheck,
	MediaUpload,
} from '@wordpress/block-editor';

import {
	Button,
	IconButton,
	Spinner,
	FocalPointPicker,
	PanelBody,
	PanelRow,
	Placeholder,
} from '@wordpress/components';

import { more } from '@wordpress/icons';

import { __ } from '@wordpress/i18n';

import { useSelect } from '@wordpress/data';

// Import CSS.
import './editor.scss';

/**
 * Returns the class list for the component based on the current settings.
 *
 * @param {string} className Additional classes assigned to the component.
 * @param {string} text      If the component has loading text set.
 * @param {string} shadow    If the component has a shadow set.
 */
const getClasses = ( className ) =>
	classnames( 'bu-components-image', {
		[ className ]: className,
	} );

export const Image = ( props ) => {
	const {
		className = undefined,
		id,
		size = 'full',
		onSelect,
		onRemove,
		focalPoint = { x: 0.5, y: 0.5 },
		onChangeFocalPoint = undefined,
		labels = {},
		canEditImage = true,
		canOverrideImage = false,
		allowedTypes = [ 'image' ],
		debug = false,
		...rest
	} = props;

	// Is an image set already?
	const hasImage = id ? true : false;

	// If component has FocalPoint Handler Function show the focal picker.
	const displayFocalPointPicker = typeof onChangeFocalPoint === 'function';

	/**
	 * Fetch the media based on the attachment ID utilizing useSelect
	 *
	 * Returns Media object
	 */
	const { media, isResolvingMedia, hasResolvedMedia } = useSelect(
		( select ) => {
			// Get media functions from core.
			const { getMedia, isResolving, hasFinishedResolution } =
				select( 'core' );

			const mediaParameters = [ id, { context: 'view' } ];

			return {
				media: getMedia( ...mediaParameters ),
				isResolvingMedia: isResolving( 'getMedia', mediaParameters ),
				hasResolvedMedia: hasFinishedResolution(
					'getMedia',
					mediaParameters
				),
			};
		}
	);

	// If Debug is set to true, output some helpful information to the
	// console for block developers to utilize media object info in their block development.
	if ( debug ) {
		if ( isResolvingMedia ) {
			console.log( 'Image Media Fetch in Progress: ', isResolvingMedia );
		}
		if ( hasResolvedMedia ) {
			console.log( 'Image Media Fetched: ', media );
		}
	}

	// If media is being fetched, just show the spinner.
	if ( isResolvingMedia ) {
		return <Spinner />;
	}

	// If there is no image set, and the user can't edit the image show placeholder
	if ( ! hasImage && ! canEditImage ) {
		return (
			<Placeholder
				className="bu-components-image-media-placeholder"
				icon={ more }
				label="Placeholder"
				withIllustration
			/>
		);
	}

	// If there is no image set, and the user can edit the image, show Media Placeholder
	if ( ! hasImage && canEditImage ) {
		return (
			<MediaPlaceholder
				labels={ labels }
				onSelect={ onSelect }
				accept="image"
				multiple={ false }
				allowedTypes={ allowedTypes }
			/>
		);
	}

	const imageUrl =
		media?.media_details?.sizes?.[ size ]?.source_url ?? media?.source_url;
	const altText = media?.alt_text;

	if ( displayFocalPointPicker ) {
		const focalPointStyle = {
			objectFit: 'cover',
			objectPosition: `${ focalPoint.x * 100 }% ${ focalPoint.y * 100 }%`,
		};

		rest.style = {
			...rest.style,
			...focalPointStyle,
		};
	}

	return (
		<>
			{ ( canOverrideImage || onRemove || displayFocalPointPicker ) && (
				<InspectorControls>
					<PanelBody title={ __( 'Image Settings' ) }>
						{ ( canOverrideImage || onRemove ) && (
							<>
								<h2>{ __( 'Selected Image' ) }</h2>
								<PanelRow>
									{ canOverrideImage && (
										<MediaUploadCheck>
											<MediaUpload
												onSelect={ onSelect }
												value={ id }
												allowedTypes={ allowedTypes }
												render={ ( { open } ) => (
													<IconButton
														className="bu-components-image-media-edit-button"
														onClick={ open }
														icon="edit"
														label={ __(
															'Edit Media'
														) }
														isDefault
														isLarge
													>
														{ __( 'Edit' ) }
													</IconButton>
												) }
											/>
										</MediaUploadCheck>
									) }
									{ onRemove && (
										<>
											<Button
												className="bu-components-image-media-remove-button"
												onClick={ onRemove }
												label={ 'Remove Media' }
												isLink
											>
												{ __( 'Remove Media' ) }
											</Button>
										</>
									) }
								</PanelRow>
							</>
						) }
						{ displayFocalPointPicker && (
							<PanelRow>
								<FocalPointPicker
									className="bu-components-image-media-edit-focalpoint"
									label={ __( 'Focal Point Picker' ) }
									url={ imageUrl }
									value={ focalPoint }
									onChange={ onChangeFocalPoint }
								/>
							</PanelRow>
						) }
					</PanelBody>
				</InspectorControls>
			) }
			<img
				className={ getClasses( className ) }
				src={ imageUrl }
				alt={ altText }
				{ ...rest }
			/>
		</>
	);
};
