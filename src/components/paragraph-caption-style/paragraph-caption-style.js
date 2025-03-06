/**
 * Registers the caption style for the core paragraph block.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

wp.domReady( () => {

	wp.blocks.registerBlockStyle( 'core/paragraph', [
		{
			name: 'default',
			label: 'Default',
			isDefault: true,
		},
		{
			name: 'caption',
			label: 'Caption'
		}
	]);
} );