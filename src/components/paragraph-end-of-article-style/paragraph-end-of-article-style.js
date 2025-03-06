/**
 * Registers the end-of-article style for the core paragraph block.
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
			name: 'end-of-article',
			label: 'End of Article'
		}
	]);
} );