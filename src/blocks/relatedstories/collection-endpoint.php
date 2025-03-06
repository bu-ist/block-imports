<?php
/**
 * Adds a REST API endpoint to provide a collection of posts matching
 * mixed post types. The data included in these posts matches the
 * format expected by the Related Stories block.
 *
 * @link       www.bu.edu/interactive-design/
 * @since      0.1.0
 *
 * @package    BU_Blocks
 * @subpackage BU_Blocks/src/includes
 */

namespace BU\Plugins\BU_Blocks\RelatedStories\CollectionEndpoint;

add_action( 'rest_api_init', __NAMESPACE__ . '\register_route' );

/**
 * Register the REST API route used to provide related posts to the
 * related stories block.
 */
function register_route() {
	register_rest_route(
		'bu-blocks/v1',
		'collection',
		array(
			'methods'  => 'GET',
			'callback' => __NAMESPACE__ . '\rest_response',
		)
	);
}

/**
 * Provide post information for a collection of post IDs.
 *
 * @param \WP_Request $request The incoming REST API request object.
 * @return array A list of post IDs.
 */
function rest_response( $request ) {
	$post_ids   = $request->get_param( 'include' );
	$post_types = $request->get_param( 'post_type' );

	// Avoid retrieving the most recent posts if no specific IDs are provided.
	if ( ! $post_ids ) {
		return array();
	}

	// Provide at least an empty array if no post type is requested.
	if ( ! $post_types ) {
		$post_types = array();
	}

	$query_args = array(
		'post_type' => (array) $post_types,
		'post__in'  => (array) $post_ids,
		'orderby'   => 'post__in',
	);

	$query = new \WP_Query();
	$query->query( $query_args );

	// Assume no posts match the criteria by default.
	$posts = array();

	if ( $query->have_posts() ) {
		while ( $query->have_posts() ) {
			$query->the_post();

			$post = array(
				'id'           => get_the_ID(),
				'title'        => get_the_title(),
				'date_gmt'     => get_the_date( '' ),
				'link'         => get_the_permalink(),
				'media_url'    => has_post_thumbnail() ? get_the_post_thumbnail_url( null, 'responsive_profile' ) : false,
				'primary_term' => apply_filters( 'bu_blocks_related_stories_article_category', '', get_post() ),
			);

			/**
			 * Filters the information attached to a post when included in a related
			 * stories collection.
			 *
			 * @param array $post An array of information about post.
			 */
			$posts[] = apply_filters( 'bu_blocks_related_stories_collection_post', $post );
		}
	}
	wp_reset_query();

	return $posts;
}
