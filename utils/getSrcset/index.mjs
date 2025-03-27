/**
 * Returns todo.
 *
 * @param {string} mediaObj todo.
 * @param {string} size     todo.
 * @param {string} density  todo.
 */

export function getSrcset( mediaObj, size, density ) {
	if ( ! mediaObj.media_details.sizes[ size ] ) {
		return false;
	}

	const filePath = mediaObj.media_details.sizes[ size ].source_url;

	return (
		filePath +
		', ' +
		filePath.replace( '.', '-' + density + '.' ) +
		' ' +
		density
	);
}
