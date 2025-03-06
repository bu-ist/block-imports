<?php
/**
 * Server-side rendering of the `bu/collapsible` block.
 *
 * Note: default rendering of the collapsible is to set the blocks to be open
 * regardless of user setting and close the blocks on dom ready via JS. This
 * is so that users with JS disabled can access the content.
 *
 * @package BU_Blocks
 */

namespace BU\Plugins\BU_Blocks\Blocks\Collapsible;

add_action( 'init', __NAMESPACE__ . '\\register_block' );

/**
 * Registers the `bu/collapsible` block on the server.
 */
function register_block() {
	register_block_type(
		'bu/collapsible',
		array(
			'attributes'      => [
				'title' => [
					'type'     => 'string',
				],
				'level' => [
					'type'     => 'number',
					'default'  => 2,
				],
				'isOpen' => [
					'type'     => 'boolean',
					'default'  => false,
				],
				'iconStyle' => [
					'type'     => 'string',
					'default'  => 'plus-minus',
				],
				'customMarginBottom' => [
					'type'     => 'boolean',
					'default'  => false,
				],
				'marginBottom' => [
					'type'     => 'number',
					'default'  => 0,
				],
				'id' => [
					'type'     => 'string',
				],
			],
			'render_callback' => __NAMESPACE__ . '\\render_block',
		)
	);
}

/**
 * Renders the `bu/collapsible` block.
 *
 * @param array  $attributes The block attributes.
 * @param string $content    The block content.
 * @return string Returns the b
 */
function render_block( $attributes, $content ) {
	$attr = wp_parse_args(
		$attributes,
		[
			'title'              => '',
			'level'              => '2',
			'isOpen'             => false,
			'iconStyle'          => 'plus-minus',
			'className'          => 'is-style-plain', // Default classname for the block.
			'customMarginBottom' => false,
			'marginBottom'       => 0,
			'id'                 => 'bu-collapsible-1',
			'buttonCloseLabel'   => 'Close',
			'buttonOpenLabel'    => 'Read More',
		]
	);

	$classes = [
		'wp-block-bu-collapsible',
		'js-wp-block-bu-collapsible',
		'is-open', // Default this to open, so we can close via JS. This lets block content be visible if user has JS disabled.
		"icon-style-{$attr['iconStyle']}",
		$attr['className'],
	];

	// Array of any inline styles needed.
	$styles = [
		'margin-bottom' => $attr['customMarginBottom'] ? "{$attr['marginBottom']}px" : null,
	];

	// Loop through the $styles list and output inline style rules if they have a value.
	$get_styles = function( $styles ) {
		$out = '';
		foreach ( $styles as $k => $v ) {
			if ( $v ) {
				$out .= "{$k}:{$v}";
			}
		}
		return $out;
	};

	// Check if this is the Preview style so we can adjust the markup structure below.
	$is_preview_style = in_array( 'is-style-preview', $classes ) ? true : false;

	ob_start();
	?>

	<div
		class="<?php echo esc_attr( implode( ' ', $classes ) ); ?>"
		style="<?php echo esc_attr( $get_styles( $styles ) ); ?>"
		id="<?php echo esc_attr( $attr['id'] ); ?>"
		data-default-open="<?php echo esc_attr( $attr['isOpen'] ? 'true' : 'false' ); ?>"
	>
		<<?php echo esc_html( "h{$attr['level']}" ); ?> class="bu-collapsible-heading">
			<?php if ( $is_preview_style ) : ?>
				<?php echo wp_kses_post( $attr['title'] ); ?>
			<?php else : ?>
				<button class="bu-block-collapsible-toggle js-bu-block-collapsible-toggle" id="<?php echo esc_attr( "{$attr['id']}-toggle" ); ?>">
					<?php echo wp_kses_post( $attr['title'] ); ?>
				</button>
			<?php endif; ?>
		</<?php echo esc_html( "h{$attr['level']}" ); ?>>
		<?php if ( $is_preview_style ) : ?>
			<button
				class="js-bu-block-collapsible-toggle button"
				id="<?php echo esc_attr( "{$attr['id']}-toggle" ); ?>"
				data-close-text="<?php echo esc_attr( "{$attr['buttonCloseLabel']}" ); ?>"
				data-open-text="<?php echo esc_attr( "{$attr['buttonOpenLabel']}" ); ?>"
				aria-label="Toggle <?php echo wp_kses_post( $attr['title'] ); ?>"
			><?php echo esc_html( "{$attr['buttonOpenLabel']}" ); ?></button>
		<?php endif; ?>
		<div class="bu-block-collapsible-content js-bu-block-collapsible-content" id="<?php echo esc_attr( "{$attr['id']}-panel" ); ?>">
			<?php echo $content; ?>
		</div>
	</div>

	<?php
	// Use this filter to override the Collapsible block template from a child theme.
	return apply_filters( 'bu_blocks_collapsible_render_output', ob_get_clean(), $attr, $classes, $content );
}
