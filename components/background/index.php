<?php
/**
 * Outputs the background component for blocks with PHP rendering.
 *
 * @package BU_Blocks
 */

namespace BU\Plugins\BU_Blocks\Components\Background;

add_action( 'bu_blocks_background', __NAMESPACE__ . '\\display_background', 10, 2 );

/**
 * Display the background component based on the provided attributes.
 *
 * @param array $attributes The block attributes.
 * @param array $image_size Image size as determined by the block.
 */
function display_background( $attributes, $image_size = false ) {
	$id      = ( isset( $attributes['backgroundId'] ) ) ? $attributes['backgroundId'] : false;
	$url     = $attributes['backgroundUrl'];
	$type    = $attributes['backgroundType'];
	$opacity = $attributes['backgroundOpacity'];
	$classes = ( 100 !== $opacity ) ? "has-background-opacity has-background-opacity-$opacity" : '';
	$size    = ( $image_size ) ? $image_size : 'full';

	// Build out an image for the background.
	if ( 'image' === $type && $id ) :
		echo wp_get_attachment_image( $id, $size, false, array( 'class' => $classes ) );
	endif;

	// Build out a video for the background.
	if ( 'video' === $type ) :
		?>
			<video
				src="<?php echo esc_url( $url ); ?>"
				<?php if ( $attributes['backgroundAutoplay'] ) : ?>
					autoPlay
					muted
					loop
				<?php endif; ?>
				<?php if ( $classes ) : ?>
					class="<?php echo esc_attr( $classes ); ?>"
				<?php endif; ?>
			></video>
		<?php
	endif;

	// Build out a video iframe.
	if ( 'url' === $type ) :
		$parsed_url = wp_parse_url( $url ); // Parse the provided URL.
		$host       = $parsed_url['host']; // Get the host of the provided URL.
		$src        = false; // Set a flag for the iframe `src` attribute value.
		$autoplay   = $attributes['backgroundAutoplay'];

		// Build the iframe `src` value for Youtube videos.
		if ( 'www.youtube.com' === $host || 'youtu.be' === $host ) {
			$video_id = ( 'youtu.be' === $host ) ?
				substr( $parsed_url['path'], 1 ) :
				substr( $parsed_url['query'], 2 );

			$src  = "//www.youtube.com/embed/$video_id";
			$src .= ( $autoplay ) ? "?controls=0&autoplay=1&mute=1&origin=http://bu.edu&version=3&loop=1&playlist=$video_id" : '';
		}

		// Build the iframe `src` value for Vimeo videos.
		if ( 'vimeo.com' === $host ) {
			$src  = '//player.vimeo.com/video/' . substr( $parsed_url['path'], 1 );
			$src .= ( $autoplay ) ? '?background=1' : '';
		}

		// Build the iframe `src` value for BUniverse videos.
		if ( 'www.bu.edu' === $host ) {
			$src  = 'https://www.bu.edu/buniverse/interface/embed/embed.html?v=' . substr( $parsed_url['query'], 2 ) . '&jsapi=1';
			$src .= ( $autoplay ) ? '&autoplay=true&controls=0' : '';
		}

		// Stop here if the `$src` variable has not been reset.
		if ( ! $src ) {
			return;
		}

		?>
		<div class="wp-block-background-video">
			<div class="wp-block-background-video-ratio">
				<div class="wp-block-background-video-iframe">
					<iframe
						src="<?php echo esc_url( $src ); ?>"
						frameborder="0"
						allow="autoplay; fullscreen"
						<?php if ( $classes ) : ?>
							class="<?php echo esc_attr( $classes ); ?>"
						<?php endif; ?>
					></iframe>
				</div>
			</div>
		</div>
		<?php
	endif;
}
