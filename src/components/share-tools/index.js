/**
 * Component: background
 *
 * An absraction of the default Cover block for more general use inside blocks.
 *
 * Import this component and its attributes into a block with:
 * 	`import ShareTools, { ShareToolsAttributes } from '../../components/share-tools';`
 */

// WordPress dependencies.
const {
	__,
} = wp.i18n;
const {
	Fragment,
} = wp.element;
const {
	PanelBody,
	ToggleControl,
} = wp.components;
const {
	InspectorControls,
} = ( 'undefined' === typeof wp.blockEditor ) ? wp.editor : wp.blockEditor;

// Share tools attributes.
const ShareToolsAttributes = {
	shareToolsDisabled: {
		type: 'boolean',
		default: false,
	},
};

/**
 * The Share Tools component.
 *
 * @param {array} props The properties passed to the component.
 */
function ShareTools( props ) {
	// Get the properties of this component.
	const {
		blockProps,
	} = props;

	// Get the properties of the block using this component.
	const {
		attributes,
		setAttributes,
	} = blockProps;

	// Get the attributes for handling the background data.
	const {
		shareToolsDisabled,
	} = attributes;

	// Return the interface for the background component.
	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={ __( 'Sharing Options' ) }>
					<ToggleControl
						label={ __( 'Disable Share Tools' ) }
						checked={ shareToolsDisabled }
						onChange={ () => setAttributes( { shareToolsDisabled: !shareToolsDisabled } ) }
					/>
				</PanelBody>
			</InspectorControls>
			{ ! shareToolsDisabled && (
				<p className="wp-blocks-components-share-tools">
					<a href="#" className="icon-action">{ __( 'Share this' ) }</a>
				</p>
			) }
		</Fragment>
	);
}

// Export attributes for easy importing in blocks.
export {
	ShareToolsAttributes,
};

// Export the share tools control panel.
export default ShareTools;
