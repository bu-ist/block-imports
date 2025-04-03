/**
 * Component: AllowedBlocks
 *
 * Returns a filterable list of blocks to allow within BU layout-type blocks.
 *
 * This list is used for the Aside, Drawer, and Modal blocks.
 */

// WordPress dependencies.
const { getBlockTypes } = wp.blocks;
const { applyFilters } = wp.hooks;

// Blocks to exclude from AllowedBlocks array for layout-type blocks.
let excludeBlocks = [
	'bu/leadin',
	'core/more',
	'core/nextpage',
	'core/separator',
	'core/spacer',
	'editorial/aside',
	'editorial/drawer',
	'editorial/modal',
	'editorial-preset/aside',
];

// Returns a list of all block namess except those in the excludeBlocks array.
const AllowedBlocks = () => {
	excludeBlocks = applyFilters(
		'buBlocks.layoutBlockTypes.excludeBlocks',
		excludeBlocks
	);

	const allowed = getBlockTypes().map( ( { name } ) => {
		if ( name && ! excludeBlocks.includes( name ) ) {
			return name;
		}
	} );

	return allowed;
};

// Export the AllowedBlocks function.
export default AllowedBlocks;
