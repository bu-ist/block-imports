/**
 * Returns a slug-safe string.
 *
 * @param {string} string Any text.
 */

export function slugify( string ) {

	let slug = string.toLowerCase().trim();
	slug = slug.replace(/[^a-z0-9\s-]/g, '');
	slug = slug.replace(/\s+/g, '-');

  return slug;
}
