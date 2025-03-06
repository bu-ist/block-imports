<?php
/**
 * Server-side rendering of the `bu/leadin` block.
 *
 * @package BU_Blocks
 */

namespace BU\Plugins\BU_Blocks\Blocks\Leadin;

add_action( 'init', __NAMESPACE__ . '\\register_block' );

/**
 * Build a list of class names for the leadin block based
 * on the provided attributes.
 *
 * @param array $attributes            A list of block attributes.
 * @param bool  $style_emphasize_text  Whether the emphasize text style is applied to the block.
 * @param bool  $style_text_over_image Whether the text over image style is applied to the block.
 * @param bool  $style_side_by_side    Whether the side by side style is applied to the block.
 *
 * @return string A space separated string of class names.
 */
function get_block_classes( $attributes, $style_emphasize_text, $style_text_over_image, $style_side_by_side, $style_image_to_text, $style_text_to_image ) {
	$publication_slug = apply_filters( 'bu_blocks_publication_slug', 'bu-blocks' );

	// Build array of classes from the provide attributes.
	$classes = array(
		'wp-block-editorial-leadin',
		$publication_slug . '-block-editorial-leadin',
		$attributes['className'],
		( $attributes['backgroundUrl'] ) ? 'has-media' : '',
		( $attributes['wide'] && $style_side_by_side ) ? 'has-wider' : '',
		( $attributes['flip'] && $style_side_by_side ) ? 'has-flip' : '',
		( $attributes['box'] && ( $style_emphasize_text || $style_text_over_image || $style_side_by_side ) ) ? 'has-box' : '',
		( $attributes['imageFocus'] ) ? 'has-media-focus-' . $attributes['imageFocus'] : '',
		( $attributes['textPositionX'] && $style_text_over_image ) ? 'has-text-position-' . $attributes['textPositionX'] : '',
		( $attributes['textPositionY'] && $style_text_over_image ) ? 'has-text-position-' . $attributes['textPositionY'] : '',
		( $attributes['themeColor'] ) ? 'has-' . $attributes['themeColor'] . '-theme' : '',
		( $attributes['backgroundAutoplay'] ) ? 'has-video-as-loop' : '',
		( $attributes['videoUncropped'] && ( $style_image_to_text || $style_text_to_image ) ) ? 'has-video-uncropped' : '',
	);

	// Trim values of the classes array after filtering out empty values.
	$classes = array_map( 'trim', array_filter( $classes ) );

	// Turn classes array into a space delimited string before returning.
	$classes = implode( ' ', $classes );

	return $classes;
}

/**
 * Renders the `core/latest-posts` block on server.
 *
 * @param array $attributes The block attributes.
 *
 * @return string Returns the post content with latest posts added.
 */
function render_block( $attributes ) {
	$defaults = array(
		'backgroundAlt'      => '',
		'backgroundAutoplay' => false,
		'backgroundOpacity'  => 100,
		'backgroundType'     => '',
		'backgroundUrl'      => '',
		'box'                => false,
		'boxOpacity'         => 100,
		'caption'            => '',
		'className'          => '',
		'deck'               => '',
		'flip'               => false,
		'head'               => '',
		'imageFocus'         => 'center-middle',
		'metabar'            => true,
		'metabardate'        => false,
		'primaryTerm'        => '',
		'textPositionX'      => 'x-center',
		'textPositionY'      => '',
		'themeColor'         => '',
		'url'                => '',
		'videoUncropped'     => false,
		'wide'               => false,
	);

	$attributes = wp_parse_args( $attributes, $defaults );

	// Determine which style is applied to the block.
	$style_emphasize_text  = strpos( $attributes['className'], 'is-style-emphasis-on-text' ) !== false;
	$style_text_over_image = strpos( $attributes['className'], 'is-style-text-over-image' ) !== false;
	$style_side_by_side    = strpos( $attributes['className'], 'is-style-side-by-side' ) !== false;
	$style_text_to_image   = strpos( $attributes['className'], 'is-style-text-to-image' ) !== false;
	$style_image_to_text   = strpos( $attributes['className'], 'is-style-image-to-text' ) !== false;
	$style_default         = ! $style_image_to_text && ! $style_text_to_image && ! $style_side_by_side && ! $style_text_over_image && ! $style_emphasize_text;

	// Retrieve the classes to attach to the block.
	$classes = get_block_classes( $attributes, $style_emphasize_text, $style_text_over_image, $style_side_by_side, $style_image_to_text, $style_text_to_image );

	$box_classes = 'container-words-inner';
	if ( $attributes['box'] && 100 !== $attributes['boxOpacity'] && ( $style_emphasize_text || $style_text_over_image ) ) {
		$box_classes .= ' has-opacity-' . absint( $attributes['boxOpacity'] );
	}

	ob_start();
	?>
	<div class="<?php echo esc_attr( $classes ); ?>">
		<div class="container-lockup">

			<div class="wp-block-leadin-media">
				<?php if ( $attributes['url'] && empty( $attributes['head'] ) ) : ?>
					<a href="<?php echo esc_url( $attributes['url'] ); ?>">
				<?php endif; ?>

				<?php do_action( 'bu_blocks_background', $attributes ); ?>

				<?php if ( $attributes['url'] && empty( $attributes['head'] ) ) : ?>
					</a>
				<?php endif; ?>
			</div>

			<?php if ( $attributes['caption'] && ( $style_default || $style_image_to_text || $style_side_by_side || $style_text_over_image ) ) : ?>
				<p class="wp-block-editorial-leadin-caption wp-prepress-component-caption"><?php echo wp_kses_post( $attributes['caption'] ); ?></p>
			<?php endif; ?>


			<?php if ( $attributes['head'] || $attributes['deck'] ) : ?>

				<div class="container-words-outer">

					<?php if ( $attributes['caption'] && $style_emphasize_text ) : ?>
						<p class="wp-block-editorial-leadin-caption wp-prepress-component-caption"><?php echo wp_kses_post( $attributes['caption'] ); ?></p>
					<?php endif; ?>

					<div class="<?php echo esc_attr( $box_classes ); ?>">

						<?php if ( $attributes['head'] ) : ?>
							<?php do_action( 'bu_blocks_leadin_primary_term', get_the_ID() ); ?>
							<h1 class="head">
								<?php if ( $attributes['url'] ) : ?>
									<a href="<?php echo esc_url( $attributes['url'] ); ?>"><?php echo wp_kses( $attributes['head'], bu_blocks_kses_title() ); ?></a>
								<?php else : ?>
									<?php echo wp_kses( $attributes['head'], bu_blocks_kses_title() ); ?>
								<?php endif; ?>
							</h1>
						<?php endif; ?>

						<?php if ( $attributes['deck'] ) : ?>
							<h4 class="deck"><?php echo wp_kses( $attributes['deck'], bu_blocks_kses_title() ); ?></h4>
						<?php endif; ?>

					</div>

				</div>

			<?php endif; ?>

		</div>

		<?php if ( $attributes['caption'] && $style_text_to_image ) : ?>
			<p class="wp-block-editorial-leadin-caption wp-prepress-component-caption"><?php echo wp_kses_post( $attributes['caption'] ); ?></p>
		<?php endif; ?>

	</div>

	<?php do_action( 'bu_blocks_leadin_meta_bar', $attributes['metabar'], $attributes['metabardate'] ); ?>

	<?php
	$html = ob_get_clean();

	return $html;
}

/**
 * Registers the `bu/leadin` block on server.
 */
function register_block() {
	$shared_args = array(
		'type'    => 'string',
		'default' => '',
	);

	register_block_type(
		'bu/leadin',
		array(
			'attributes'      => array(
				'backgroundAlt'      => $shared_args,
				'backgroundAutoplay' => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'backgroundOpacity'  => array(
					'type'    => 'number',
					'default' => 100,
				),
				'backgroundType'     => $shared_args,
				'backgroundUrl'      => $shared_args,
				'box'                => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'boxOpacity'         => array(
					'type'    => 'number',
					'default' => 100,
				),
				'caption'            => $shared_args,
				'className'          => $shared_args,
				'deck'               => $shared_args,
				'flip'               => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'head'               => $shared_args,
				'imageFocus'         => array(
					'type'    => 'string',
					'default' => 'center-middle',
				),
				'metabar'            => array(
					'type'    => 'boolean',
					'default' => true,
				),
				'metabardate'            => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'primaryTerm'        => $shared_args,
				'textPositionX'      => array(
					'type'    => 'string',
					'default' => 'x-center',
				),
				'textPositionY'      => $shared_args,
				'themeColor'         => $shared_args,
				'url'                => $shared_args,
				'wide'               => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'videoUncropped'     => array(
					'type'    => 'boolean',
					'default' => false,
				),
			),
			'render_callback' => __NAMESPACE__ . '\\render_block',
		)
	);
}
