<?php
/**
 * Plugin functions available in the global namespace.
 *
 * @link       www.bu.edu/interactive-design/
 * @since      0.2.2
 *
 * @package    bu-blocks
 * @subpackage bu-blocks/src
 */

/**
 * Returns an array of allowed HTML tags for use in post titles.
 *
 * @return array Array of allowed html tags and attributes.
 */
function bu_blocks_kses_title() {
	return array(
		'strong' => array(),
		'em'     => array(),
		'b'      => array(),
		'i'      => array(),
	);
}

/**
 * Determine method used to parse blocks.
 *
 * Checks if `parse_blocks` exists (WP 5.x context).
 * Falls back to `gutenberg_parse_blocks` if exists.
 *
 * @since 0.1.0
 *
 * @param string $content Content to parse into blocks.
 *
 * @return array $content Parsed content.
 */
function bu_blocks_parse_blocks( $content = '' ) {
	// Sanitize parameters.
	$content = (string) $content;

	// Bails if empty.
	if ( empty( $content ) ) {
		return array();
	}

	// Determines if native WP 5.x function exists, fallsback to gutenberg.
	if ( function_exists( 'parse_blocks' ) ) {
		return parse_blocks( $content );
	} elseif ( function_exists( 'gutenberg_parse_blocks' ) ) {
		return gutenberg_parse_blocks( $content );
	}

	// Return an empty array if somehow neither function exists.
	return array();
}
