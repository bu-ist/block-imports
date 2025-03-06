/**
 * Registers a variation of a block with a preset template.
 */

// WordPress dependencies.
const { registerBlockType } = wp.blocks;
const { createElement } = wp.element;
const { addFilter } = wp.hooks;

/**
 * Register a preset variation of a given block.
 *
 * @param {Object} originalBlock  Block type to build preset variation from.
 * @param {Object} presetTemplate Template to apply.
 *
 * @return {Object} Filtered props applied to save element.
 */
const RegisterBlockPreset = ( originalBlock, presetTemplate ) => {
	const { name, title, edit, save } = originalBlock;
	const presetBlock = Object.assign( {}, originalBlock );
	const nameParts = name.split( '/' );

	// Filter the classname of the preset block to match the default block.
	const filterBlockClassName = ( className, blockName ) => {
		if ( presetBlock.name === blockName ) {
			className = className.replace( /-preset/i, '' );
		}

		return className;
	}

	presetBlock.name = nameParts[ 0 ] + '-preset/' + nameParts[ 1 ];
	presetBlock.title = title + ' (preset)';
	presetBlock.category = 'bu-editorial-presets';
	presetBlock.save = save;

	// Add a `presetTemplate` property to the default block's edit component.
	presetBlock.edit = function( props ) {
		return createElement(
			edit,
			Object.assign( props, { presetTemplate: presetTemplate } )
		);
	};

	// Register the preset variation of the default block.
	registerBlockType( presetBlock.name, presetBlock );

	// Filter the classname of the preset block to match the default block.
	addFilter(
		'blocks.getBlockDefaultClassName',
		'bu-blocks/preset-block-class-name/',
		filterBlockClassName
	);
}

export default RegisterBlockPreset;