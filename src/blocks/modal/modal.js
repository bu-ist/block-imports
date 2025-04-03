/**
 * BLOCK: editorial-modal
 *
 * A block with a callout for opening a modal with supplemental or complementary information.
 */

// External dependencies.
import classnames from 'classnames';

// Import CSS.
import './style.scss';
import './editor.scss';

// Internal dependencies.
import edit from './edit.js';
import Background, { BackgroundAttributes } from '../../components/background';
import blockIcons from '../../components/block-icons';

// WordPress dependencies.
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { getColorClassName, InnerBlocks } =
	'undefined' === typeof wp.blockEditor ? wp.editor : wp.blockEditor;
const { select } = wp.data;

// Populate selectors that were in core/editor until WordPress 5.2 and are
// now located in core/block-editor.
const { hasSelectedInnerBlock, isBlockSelected } =
	'undefined' === typeof select( 'core/block-editor' )
		? select( 'core/editor' )
		: select( 'core/block-editor' );

// Register the block.
registerBlockType( 'editorial/modal', {
	title: __( 'Modal' ),
	description: __(
		'A block with a callout for opening a modal with supplemental or complementary information.'
	),
	icon: blockIcons( 'modal' ),
	category: 'bu-editorial',
	supports: {
		align: true,
	},
	attributes: {
		clientId: {
			type: 'number',
		},
		themeColor: {
			type: 'string',
		},
		calloutHeading: {
			type: 'array',
			source: 'children',
			selector: 'h1',
		},
		calloutText: {
			type: 'array',
			source: 'children',
			selector: '.editorial-modal-callout-text',
		},
		trigger: {
			type: 'array',
			source: 'children',
			selector: '.js-bu-block-modal-trigger-overlay',
		},
		...BackgroundAttributes,
	},

	// Add the `selected-modal` data attribute when this block or its descendants are selected.
	getEditWrapperProps( { clientId } ) {
		if ( clientId ) {
			const modalHasSelectedBlock =
				hasSelectedInnerBlock( clientId, true ) ||
				isBlockSelected( clientId );

			return {
				'data-selected-modal': modalHasSelectedBlock
					? 'true'
					: undefined,
			};
		}
	},

	edit,

	save( props ) {
		const { attributes, className } = props;
		const {
			themeColor,
			calloutHeading,
			calloutText,
			trigger,
			backgroundId,
		} = attributes;
		const classes = classnames( className, 'js-bu-block-modal', {
			[ getColorClassName( 'theme', themeColor ) ]: getColorClassName(
				'theme',
				themeColor
			),
			'has-media': backgroundId,
		} );

		return (
			<aside className={ classes }>
				<div className="wp-block-editorial-modal-callout">
					<div className="wp-block-editorial-modal-media">
						<figure className="wp-block-editorial-modal-image">
							<Background
								blockProps={ props }
								className="banner-placeholder"
							/>
						</figure>
					</div>
					<div className="wp-block-editorial-modal-callout-content">
						<div className="modal-valign">
							<h1>{ calloutHeading }</h1>
							<p className="editorial-modal-callout-text">
								{ calloutText }
							</p>
							<p>
								<a
									href="#"
									className="js-bu-block-modal-trigger-overlay button"
								>
									{ trigger }
								</a>
							</p>
						</div>
					</div>
				</div>
				<div className="wp-block-editorial-modal-content js-bu-block-modal-overlay">
					<div className="overlay overlay-scale">
						<a
							href="#"
							className="wp-block-editorial-modal-overlay-close js-bu-block-modal-overlay-close"
						>
							Close
						</a>
						<article>
							<InnerBlocks.Content />
						</article>
					</div>
				</div>
			</aside>
		);
	},
} );
