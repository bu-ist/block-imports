/**
 * Component: publicationSlug
 *
 * Returns a filterable string representing the current content's publication.
 */

const { applyFilters } = wp.hooks;

// Return the publication owner for a block if
// one is available in the DOM.
const publicationSlug = () => {
	const publication = document.getElementById( 'bu_publication_owner' );
	let publicationSlug = 'bu-blocks';

	if ( null !== publication ) {
		publicationSlug = publication.value;
	}

	return applyFilters( 'buBlocks.global.publicationSlug', publicationSlug );
};

export default publicationSlug;
