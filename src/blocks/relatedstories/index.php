<?php
/**
 * Server-side rendering of the `editorial/relatedstories` block.
 *
 * @package BU_Blocks
 */

namespace BU\Plugins\BU_Blocks\Blocks\RelatedStories;

add_action( 'init', __NAMESPACE__ . '\\register_block' );
add_action( 'save_post', __NAMESPACE__ . '\\save_post', 10, 2 );

/**
 * Build a list of class names for the related stories block based
 * on the provided attributes.
 *
 * @param array $attributes A list of block attributes.
 * @return string A space separated string of class names.
 */
function get_block_classes( $attributes ) {
	// Combine class names from the various available sources.
	$classes = implode(
		' ',
		array(
			'wp-block-editorial-relatedstories',
			$attributes['className'],
			$attributes['cardCountClass'],
		)
	);
	$classes = trim( $classes );
	$classes = explode( ' ', $classes );

	// Provide alignment class information.
	$aligns = array(
		'left',
		'right',
	);
	if ( in_array( $attributes['align'], $aligns, true ) && ! in_array( 'is-style-card', $classes, true ) ) {
		$classes[] = 'align' . $attributes['align'];
	}

	// Append card count as a class name.
	if ( in_array( 'is-style-card', $classes, true ) && 2 === $attributes['cardCount'] ) {
		$classes[] = 'has-two';
	} elseif ( in_array( 'is-style-card', $classes, true ) && 3 === $attributes['cardCount'] ) {
		$classes[] = 'has-three';
	}

	/**
	 * Filter the classes used in server side rendering of related stories.
	 *
	 * @param array A list of class names to assign to the related stories block.
	 */
	$classes = apply_filters( 'bu_blocks_related_stories_class_names', $classes );

	// Turn classes into a space delimited string before returning.
	$classes = implode( ' ', $classes );

	return $classes;
}

/**
 * Build a cache key using the ID of the current post
 * and the IDs of the manually selected related stories.
 *
 * @param int   $post_id  The ID of the current post.
 * @param array $post_ids The IDs of the manually selected related stories.
 *
 * @return string
 */
function build_cache_key( $post_id, $post_ids, $card_style ) {
	if ( $card_style ) {
		$card_style = 'card';

	} else {
		$card_style = 'list';
	}
	return "manual_related_posts_for_{$post_id}:_" . $card_style . '_' . md5( wp_json_encode( $post_ids ) );
}

/**
 * Retrieve a list of posts from a given set of post IDs.
 *
 * @param array $post_ids A list of post IDs to include.
 * @param array $args     Arguments.
 *
 * @return array
 */
function get_block_posts_manual( $post_ids, $args ) {

	// Build a cache key unique to this instance of the block.
	$cache_key = build_cache_key( get_the_ID(), $post_ids, $args['card_style'] );

	// Check for the cache key in the 'bu_blocks' group.
	$posts = wp_cache_get( $cache_key, 'bu_blocks' );

	// Return the cached value if it exists.
	if ( $posts ) {
		return $posts;
	}

	$defaults = array(
		'post_type' => '',
		'per_page'  => 3,
	);
	$args     = wp_parse_args( $args, $defaults );

	$posts = get_posts(
		array(
			'post__in'               => $post_ids,
			'post_type'              => $args['post_type'],
			'orderby'                => 'post__in',
			'numberposts'            => $args['per_page'],
			'no_found_rows'          => true,
			'update_post_meta_cache' => false,
			'update_post_term_cache' => false,
		)
	);

	// Store the `get_posts` results in cache for a day.
	wp_cache_set( $cache_key, $posts, 'bu_blocks', DAY_IN_SECONDS );

	return $posts;
}

/**
 * Retrieve a list of related posts from YARPP.
 *
 * @param array $args A list of arguments to pass to YARPP.
 * @return array The related posts.
 */
function get_block_posts_yarpp( $args ) {
	$yarpp_args = array( 'limit' => 3 );

	if ( isset( $args['per_page'] ) ) {
		$yarpp_args['limit'] = $args['per_page'];
	}

	// Only pass the post_type arg if it is set. If not, YARPP will use all post types.
	if ( isset( $args['post_type'] ) ) {
		$yarpp_args['post_type'] = $args['post_type'];
	}

	$post_id = isset( $args['post_id'] ) ? $args['post_id'] : get_the_ID();

	$posts = \yarpp_get_related( $yarpp_args, $post_id );

	return $posts;
}

/**
 * Retrieve a list of manually curated articles or a list of
 * dynamically provided articles via YARPP.
 *
 * @param bool  $manual True if articles are manually selected. False if not.
 * @param array $posts  A list of post IDs to lookup, if provided.
 * @param array $args   A list of additional arguments for block retrieval.
 * @return array A list of found articles.
 */
function get_block_posts( $manual, $posts = array(), $args = array() ) {
	// If related posts have been manually selected, we do a direct query
	// with those post IDs. Otherwise, use YARPP.
	if ( $manual ) {
		$posts = get_block_posts_manual( $posts, $args );
	} elseif ( function_exists( 'yarpp_get_related' ) ) {
		$posts = get_block_posts_yarpp( $args );
	} else {
		$posts = array(); // There are no related posts to retrieve.
	}

	return $posts;
}

/**
 * Renders the `core/latest-posts` block on server.
 *
 * @param array $attributes The block attributes.
 *
 * @return string Returns the post content with latest posts added.
 */
function render_block( $attributes ) {
	$defaults   = array(
		'align'          => '',
		'className'      => '',
		'cardCount'      => 2,
		'cardCountClass' => '',
		'includePosts'   => array(),
		'relatedManual'  => false,
	);
	$attributes = wp_parse_args( $attributes, $defaults );

	/**
	 * Filters the attributes used when rendering the related stories block.
	 *
	 * @param array $attributes Attributes provided for block rendering.
	 */
	$attributes = apply_filters( 'bu_prepress_related_stories_block_attributes', $attributes );

	/**
	 * Filters the post types used when displaying related stories.
	 *
	 * @param array $post_types A list of post types to pass to YARPP.
	 * @param bool  $manual     Whether the request is manual (true) or YARPP (false).
	 */
	$post_types = apply_filters( 'bu_blocks_related_stories_post_types', array( 'post' ), $attributes['relatedManual'] );

	// Retrieve the classes to attach to the block wrapper.
	$classes = get_block_classes( $attributes );

	if ( strpos( $classes, 'is-style-card' ) ) {
		$per_page = $attributes['cardCount'];
	} else {
		$per_page = 3;
	}

	// Retrieve the list of posts used to render this block.
	$posts = get_block_posts(
		$attributes['relatedManual'],
		$attributes['includePosts'],
		array(
			'post_type' => $post_types,
			'per_page'  => $per_page,
			'card_style' => strpos( $classes, 'is-style-card' ),
		)
	);

	// Render nothing if no posts are available.
	if ( empty( $posts ) ) {
		return '';
	}

	ob_start();
	?>
	<aside class="<?php echo esc_attr( $classes ); ?>">
		<h3 class="wp-block-editorial-relatedstories-title"><?php esc_html_e( 'Related', 'bu-blocks' ); ?></h3>
		<ul class="wp-block-editorial-relatedstories-list">
			<?php

			foreach ( $posts as $post ) {
				?>
				<li class="wp-block-editorial-relatedstories-list-item">
					<article class="wp-block-editorial-relatedstories-article">
						<?php
						// If related stories are set to card format, an image is displayed.
						if ( strpos( $classes, 'is-style-card' ) ) {
							if ( has_post_thumbnail( $post ) ) {
								?>
								<figure class="wp-block-editorial-relatedstories-article-image">
									<?php echo get_the_post_thumbnail( $post ); ?>
								</figure>
								<?php
							}

							?>
							<div class="wp-block-editorial-relatedstories-article-content">
							<?php
						}

						$category = apply_filters( 'bu_blocks_related_stories_article_category', false, $post );

						if ( $category ) {
							?>
							<p class="wp-block-editorial-relatedstories-article-category"><span><?php echo esc_html( $category ); ?></span></p>
							<?php
						}

						?>
							<h4 class="wp-block-editorial-relatedstories-article-title"><a href="<?php the_permalink( $post ); ?>" class="wp-block-editorial-relatedstories-article-title-link"><?php echo wp_kses( get_the_title( $post ), bu_blocks_kses_title() ); ?></a></h4>
							<p class="wp-block-editorial-relatedstories-article-date"><?php echo esc_html( get_the_date( '', $post ) ); ?></p>
						<?php

						do_action( 'bu_blocks_related_stories_close_article', $post, get_the_ID() );

						if ( strpos( $classes, 'is-style-card' ) ) {
							?>
							</div>
							<?php
						}
						?>
					</article>
				</li>
				<?php
				wp_reset_postdata();
			}

			?>
		</ul>
	</aside>
	<?php
	$html = ob_get_clean();

	return $html;
}

/**
 * Registers the `core/latest-posts` block on server.
 */
function register_block() {
	register_block_type(
		'editorial/relatedstories',
		array(
			'attributes'      => array(
				'align'         => array(
					'type'    => 'string',
					'default' => 'right',
				),
				'cardCount'     => array(
					'type'    => 'number',
					'default' => 2,
				),
				'className'     => array(
					'type'    => 'string',
					'default' => '',
				),
				'relatedManual' => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'includedPosts' => array(
					'type'    => 'array',
					'default' => array(),
				),
			),
			'render_callback' => __NAMESPACE__ . '\\render_block',
		)
	);
}

/**
 * Delete the value of any existing cache keys for Related Stories blocks
 * with manually selected stories that the post being saved may contain.
 *
 * @param int     $post_ID The post ID.
 * @param WP_Post $post    The post object.
 */
function save_post( $post_ID, $post ) {
	// Bail if this is an autosave or revision.
	if ( ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || wp_is_post_revision( $post_ID ) ) {
		return;
	}

	// Bail if the user doesn't have permissions to edit the page.
	if ( ! current_user_can( 'edit_post', $post_ID ) ) {
		return;
	}

	// Bail if the post does not have the Related Stories block.
	if ( ! has_block( 'editorial/relatedstories', $post_ID ) ) {
		return;
	}

	// Parse the blocks.
	$blocks = \bu_blocks_parse_blocks( $post->post_content );

	// Loop through the blocks, skipping all but the
	// Related Stories blocks with manual posts.
	foreach ( $blocks as $block ) {
		if ( 'editorial/relatedstories' !== $block['blockName'] ) {
			continue;
		}

		if ( ! $block['attrs']['relatedManual'] || ! $block['attrs']['includePosts'] ) {
			continue;
		}

		// Retrieve the classes to attach to the block wrapper.
		$classes = get_block_classes( $attributes );

		$card_style = strpos( $classes, 'is-style-card' );

		// Build a cache key unique to this instance of the block.
		$cache_key = build_cache_key( $post_ID, $block['attrs']['includePosts'], $card_style );

		// Delete the cache key if it exists,
		// allowing for it to be rebuilt on the front end.
		if ( wp_cache_get( $cache_key, 'bu_blocks' ) ) {
			wp_cache_delete( $cache_key, 'bu_blocks' );
		}
	}
}
