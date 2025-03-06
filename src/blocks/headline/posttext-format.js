/**
 * Format: bu-headline-posttext
 *
 * A RichText format button for wrapping selected text in a span with the
 * 'wp-block-editorial-headline-posttext' span.
 */

// Import WordPress dependencies
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { registerFormatType, toggleFormat } = wp.richText;
const {
	RichTextToolbarButton,
	RichTextShortcut,
} = ( 'undefined' === typeof wp.blockEditor ) ? wp.editor : wp.blockEditor;
const el = wp.element.createElement;
const { compose, ifCondition } = wp.compose;
const { withSelect } = wp.data;
const name = 'editorial/posttext';
const posttexticon =
  el('svg', { width: 20, height: 20, viewBox: '0 0 20 20' },
  el('path', {
  	d: "M18,13.68H8.56a.51.51,0,0,0-.51.51v2a.51.51,0,0,0,.51.51H18a.51.51,0,0,0,.52-.51v-2A.51.51,0,0,0,18,13.68Z"
  } ),
  el('polygon', {
  	points: "1.53 15.96 4.51 15.96 4.51 17.02 7.1 15.2 4.51 13.4 4.51 14.46 1.53 14.46 1.53 14.46 1.53 15.96"
  } ),
  el('path', {
  	d: "M10,4.27V7.38h3V4.27h1.82v8.08H13.05V9H10v3.38H8.2V4.27Z"
  } )
);

registerFormatType( name, {

	title: __( 'Posttext' ),
	tagName: 'span',
	className: 'wp-block-editorial-headline-posttext',

	edit: compose(
		withSelect( select => {
			let getSelectedBlock = ( 'undefined' === typeof select( 'core/block-editor' ) ) ? select( 'core/editor' ).getSelectedBlock : select( 'core/block-editor' ).getSelectedBlock;

			return {
				selectedBlock: getSelectedBlock()
			}
		} ),
		ifCondition( props => {
			return (
				props.selectedBlock &&
				props.selectedBlock.name === 'editorial/headline'
			);
		} )
	)( ( props ) => {
		const {
			isActive,
			onChange,
			selectedBlock,
			value,
		} = props;

		const onToggle = () => onChange( toggleFormat( value, { type: name } ) );

		return (
			<Fragment>
				<RichTextShortcut
					type="access"
					character="b"
					onUse={ onToggle }
				/>
				<RichTextToolbarButton
					icon = { posttexticon }
					title={ __( 'Posttext' ) }
					onClick={ onToggle }
					isActive={ isActive }
					shortcutType="access"
					shortcutCharacter="b"
				/>
			</Fragment>
		);
	} ),
} );
