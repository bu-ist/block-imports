/**
 * Provide the expected attribute value for a list of allowed
 * formatting controls.
 *
 * Before Gutenberg 6.2.0, the formatting controls on RichText elements
 * were controlled with the `formattingControls` attribute.
 *
 * In Gutenberg 6.2.0, the `allowedFormats` attribute was introduced that
 * performs the same function with slightly different expectations.
 *
 * React does not render attributes that have `false` set as a value, so the
 * pattern provided by `getAllowedFormats` handles both `allowedFormats` and
 * `formattingControls` and then sets one of them to `false` depending on which
 * environment is detected.
 *
 * As an example, the following attributes restrict formatting controls to bold
 * and italic, a common pattern throughout the BU Blocks plugin:
 *
 * 		<RichText
 * 			formattingControls={ getAllowedFormats( 'formattingControls', [ 'link' ] ) }
 * 			allowedFormats={ getAllowedFormats( 'allowedFormats', [ 'core/link' ] ) }
 * 		/>
 */

const getAllowedFormats = ( type, allowedFormats ) => {
	const supportsAllowedFormats =
		'undefined' === typeof wp.blockEditor ? false : true;

	if ( 'allowedFormats' === type ) {
		return supportsAllowedFormats ? allowedFormats : false;
	} else if ( 'formattingControls' === type ) {
		return supportsAllowedFormats ? false : allowedFormats;
	}

	return allowedFormats;
};

export default getAllowedFormats;
