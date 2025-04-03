/**
 * Format: bu-headline-pretext
 *
 * A RichText format button for wrapping selected text in a span with the
 * 'wp-block-editorial-headline-pretext' span.
 */

// Import WordPress dependencies
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { registerFormatType, toggleFormat } = wp.richText;
const { RichTextToolbarButton, RichTextShortcut } =
	'undefined' === typeof wp.blockEditor ? wp.editor : wp.blockEditor;
const el = wp.element.createElement;
const { compose, ifCondition } = wp.compose;
const { withSelect } = wp.data;
const name = 'editorial/pretext';
const pretexticon = el(
	'svg',
	{ width: 20, height: 20, viewBox: '0 0 20 20' },
	el( 'path', {
		d: 'M18,4.3H8.56a.51.51,0,0,0-.51.52v2a.51.51,0,0,0,.51.51H18a.51.51,0,0,0,.52-.51v-2A.52.52,0,0,0,18,4.3Z',
	} ),
	el( 'polygon', {
		points: '1.53 6.59 4.51 6.59 4.51 7.65 7.1 5.83 4.51 4.02 4.51 5.08 1.53 5.08 1.53 5.08 1.53 6.59',
	} ),
	el( 'path', {
		d: 'M10,8.67v3.1h3V8.67h1.82v8.08H13.05V13.37H10v3.38H8.2V8.67Z',
	} )
);

registerFormatType( name, {
	title: __( 'Pretext' ),
	tagName: 'span',
	className: 'wp-block-editorial-headline-pretext',

	edit: compose(
		withSelect( ( select ) => {
			const getSelectedBlock =
				'undefined' === typeof select( 'core/block-editor' )
					? select( 'core/editor' ).getSelectedBlock
					: select( 'core/block-editor' ).getSelectedBlock;

			return {
				selectedBlock: getSelectedBlock(),
			};
		} ),
		ifCondition( ( props ) => {
			return (
				props.selectedBlock &&
				props.selectedBlock.name === 'editorial/headline'
			);
		} )
	)( ( props ) => {
		const { isActive, onChange, selectedBlock, value } = props;

		const onToggle = () =>
			onChange( toggleFormat( value, { type: name } ) );

		return (
			<Fragment>
				<RichTextShortcut
					type="access"
					character="a"
					onUse={ onToggle }
				/>
				<RichTextToolbarButton
					icon={ pretexticon }
					title={ __( 'Pretext' ) }
					onClick={ onToggle }
					isActive={ isActive }
					shortcutType="access"
					shortcutCharacter="a"
				/>
			</Fragment>
		);
	} ),
} );
