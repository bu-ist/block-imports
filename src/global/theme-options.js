/**
 * Adds an array of color objects to the editor or theme defaults,
 * and returns it for passing to the `colors` prop.
 */

// WordPress dependencies.
const {
	select,
	dispatch,
} = wp.data;

const {
	getEditorSettings,
} = select( 'core/editor' );

const {
	updateEditorSettings,
} = dispatch( 'core/editor' );

// Populate selectors that were in core/editor until WordPress 5.2 and are
// now located in core/block-editor.
const {
	getSettings, // Note that getSettings is _not_ available until WordPress 5.2 and will be undefined otherwise.
} = ( 'undefined' === typeof select( 'core/block-editor' ) ) ? select( 'core/editor' ) : select( 'core/block-editor' );

// Populate actions that were in core/editor until WordPress 5.2 and are
// now located in core/block-editor.
const {
	updateSettings, // Note that updateSettings is _not_ available until WordPress 5.2 and will be undefined otherwise.
} = ( 'undefined' === typeof dispatch( 'core/block-editor' ) ) ? dispatch( 'core/editor' ) : dispatch( 'core/block-editor' );

import publicationSlug from './publication-slug';

const themeOptions = () => {
	let defaultColors;

	// Get the default colors as set by the block editor and in the theme
	// through `add_theme_support()`.
	//
	// getSettings is used in WordPress 5.2 and later.
	// getEditorSettings is used in WordPress 4.9 + Gutenberg.
	if ( 'undefined' === typeof getSettings ) {
		defaultColors = getEditorSettings().colors;
	} else {
		defaultColors = getSettings().colors;
	}

	// Get default theme color options set by the active theme through the
	// `block_editor_settings` filter in PHP.
	const defaultThemes = getEditorSettings().buDefaultThemes;

	// Get publication specific color options set by the active theme through
	// the `block_editor_settings` filter in PHP.
	const publicationThemes = getEditorSettings().buPublicationThemes;

	// Retrieve the current publication from the DOM.
	const publication = publicationSlug();

	// Populate the final `themeOptions` from the current publication, if the exist.
	// If not, use the default options.
	const themeOptions = ( publicationThemes && publicationThemes[ publication ] ) ? publicationThemes[ publication ] : defaultThemes;

	/**
	 * Add custom color objects to the defaults if they haven't already been added.
	 *
	 * Gutenberg returns a complete color object only if it is found in colors,
	 * otherwise only the the hex code is returned.
	 *
	 * @see https://github.com/WordPress/gutenberg/blob/master/packages/editor/src/components/colors/utils.js#L7.
	 */
	if ( themeOptions && ! themeOptions.some( v => defaultColors.includes( v ) ) ) {
		const newColors = defaultColors.concat( themeOptions );

		// Update both the editor settings and general settings so that when a color
		// is chosen, the value is one of those expected by the component.
		updateEditorSettings( { colors: newColors } );

		// In WordPress 5.2 and alter, the settings should be updated outside of the
		// editor too, through updateSettings.
		if ( 'undefined' !== typeof updateSettings ) {
			updateSettings( { colors: newColors } );
		}
	}

	// Return the array of custom color objects for passing to the `colors` prop.
	return themeOptions;
}

export default themeOptions;
