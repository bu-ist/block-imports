/**
 * BLOCK: bu-relatedstories-cgb
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

// Internal dependencies.
import blockIcons from '../../components/block-icons';

// WordPress dependencies.
const { __ } = wp.i18n;

const { registerBlockType } = wp.blocks;

const { withState, compose } = wp.compose;

const { withSelect, select } = wp.data;

const { Fragment } = wp.element;

const { PanelBody, RangeControl, ToggleControl } = wp.components;

const { InspectorControls, BlockAlignmentToolbar, BlockControls, URLInput } =
	'undefined' === typeof wp.blockEditor ? wp.editor : wp.blockEditor;

const { addQueryArgs } = wp.url;

const { apiFetch } = wp;

const { applyFilters } = wp.hooks;

const { decodeEntities } = wp.htmlEntities;

import classnames from 'classnames';

// Register the block.
registerBlockType( 'editorial/relatedstories', {
	title: __( 'Related Stories' ),

	description: __( 'A list of related stories to embed in an article.' ),

	icon: blockIcons( 'related' ),

	category: 'bu-editorial',

	attributes: {
		align: {
			type: 'string',
			default: 'right',
		},
		className: {
			type: 'string',
			default: '',
		},

		// The number of cards to display when not a list format.
		cardCount: {
			type: 'number',
			default: 2,
		},

		// Whether posts are selected manually or via YARPP.
		relatedManual: {
			type: 'boolean',
			default: false,
		},

		// Store the post IDs used when a related stories list is manual.
		includePosts: {
			type: 'array',
			default: [],
		},

		// Temporarily store URL lookup data when using URLInput.
		URLInputEntry: {
			type: 'string',
			default: '',
		},
	},

	styles: [
		{
			name: 'list',
			label: __( 'List' ),
			isDefault: true,
		},
		{
			name: 'card',
			label: __( 'Card' ),
		},
	],

	// Only add alignment attributes when a list is being displayed.
	getEditWrapperProps( attributes ) {
		const { align, className } = attributes;

		if (
			[ 'left', 'right' ].includes( align ) &&
			( 'undefined' === typeof className ||
				className.includes( 'is-style-list' ) )
		) {
			return { 'data-align': align };
		}
		if ( className.includes( 'is-style-card' ) ) {
			return { 'data-style': 'card' };
		}

		return { 'data-align': 'none' };
	},

	edit: compose( [
		withState( {
			// Track dynamically provided YARPP post IDs as a state.
			yarppPosts: [],
			yarppPostsError: false,
			doingYarppPostsFetch: false,

			// Track the retrieval of related post IDs (manual or automatic) as a state.
			relatedPosts: [],
			relatedPostsError: false,
			doingRelatedPostsFetch: false,

			errorMessage: false,
		} ),
		withSelect( ( select, props ) => {
			const {
				setState,
				yarppPosts,
				yarppPostsError,
				doingYarppPostsFetch,
				relatedPosts,
				relatedPostsError,
				doingRelatedPostsFetch,
				errorMessage,
			} = props;

			const { relatedManual, includePosts, className, cardCount } =
				props.attributes;

			let query;
			const isCardStyle =
				className && className.includes( 'is-style-card' );
			const perPage = isCardStyle && cardCount ? cardCount : 3;

			if ( relatedManual ) {
				// Setup the query arguments to run against the core REST API.
				query = {
					per_page: perPage,
					include: includePosts,
				};
			} else {
				// If the YARPP posts state has not yet been set, and an
				// existing YARPP API error has not been cleared, retrieve
				// a list of related post IDs.
				if ( yarppPosts.length === 0 && ! yarppPostsError ) {
					const postID = select( 'core/editor' ).getCurrentPostId();

					if ( postID && ! doingYarppPostsFetch ) {
						setState( { doingYarppPostsFetch: true } );

						const postTypes = applyFilters(
							'buBlocks.relatedStories.yarppPostTypes',
							[ 'post' ]
						);

						apiFetch( {
							path: addQueryArgs( '/bu-blocks/v1/yarpprelated', {
								post_id: postID,
								post_type: postTypes,
							} ),
						} )
							.then( ( posts ) => {
								setState( {
									yarppPosts: posts,
									yarppPostsError:
										posts.length === 0 ? true : false,
									doingYarppPostsFetch: false,

									relatedPosts: [],
									relatedPostsError: false,
									doingRelatedPostsFetch: false,
								} );
							} )
							.catch( ( error ) => {
								if ( error.code === 'yarpp_disabled' ) {
									setState( {
										yarppPostsError: true,
										doingYarppPostsFetch: false,
										errorMessage: error.message,
									} );
								}
							} );
					}
				}

				// Setup the query arguments to run against the core REST API.
				query = {
					per_page: perPage,
					include: yarppPosts,
				};
			}

			// If a known number of posts has been provided, retrieve those posts.
			if (
				query.include.length > 0 &&
				relatedPosts.length === 0 &&
				! relatedPostsError &&
				! doingRelatedPostsFetch
			) {
				// Filter the default post type used when retrieving.
				const postTypes = applyFilters(
					'buBlocks.relatedStories.postTypes',
					[ 'post' ]
				);

				// Prevent immediate duplicate requests.
				setState( { doingRelatedPostsFetch: true } );

				apiFetch( {
					path: addQueryArgs( '/bu-blocks/v1/collection', {
						include: query.include,
						post_type: postTypes,
					} ),
				} )
					.then( ( posts ) => {
						setState( {
							relatedPosts: posts,
							relatedPostsError:
								posts.length === 0 ? true : false,
							doingRelatedPostsFetch: false,
						} );
					} )
					.catch( ( error ) => {
						// There is no expected error here, but we can log it.
						setState( {
							relatedPostsError: true,
							doingRelatedPostsFetch: false,
							errorMessage: error.code,
						} );
					} );
			}

			return {
				posts: relatedPosts, // Full post objects to display in the block.
				errorMessage, // A string to display in the block if an API request failed.
			};
		} ),
	] )( ( { posts, errorMessage, attributes, ...props } ) => {
		const { className, setAttributes, setState } = props;

		const { align, cardCount, relatedManual, URLInputEntry, includePosts } =
			attributes;

		let displayPosts;

		// If only 2 cards are being displayed, ensure the displayed posts in the block are limited to 2.
		if (
			posts.length > 2 &&
			className.includes( 'is-style-card' ) &&
			cardCount === 2
		) {
			displayPosts = posts.slice( 0, 2 );
		} else {
			displayPosts = posts;
		}

		const currentPost = select( 'core/editor' ).getCurrentPost();

		const displayListItem = ( className, post ) => {
			return (
				<li className="wp-block-editorial-relatedstories-list-item">
					<article className="wp-block-editorial-relatedstories-article">
						{ className.includes( 'is-style-card' ) &&
							post.media_url && (
								<figure className="wp-block-editorial-relatedstories-article-image">
									<img
										src={ post.media_url }
										alt="placeholder"
									/>
								</figure>
							) }
						<div className="wp-block-editorial-relatedstories-article-content">
							{ className.includes( 'is-style-card' ) &&
								post.primary_term && (
									<p className="wp-block-editorial-relatedstories-article-category">
										<span>
											{ decodeEntities(
												post.primary_term
											) }
										</span>
									</p>
								) }
							<h4 className="wp-block-editorial-relatedstories-article-title">
								<a
									href={ post.link }
									className="wp-block-editorial-relatedstories-article-title-link"
								>
									{ decodeEntities( post.title ) }
								</a>
							</h4>
							<p className="wp-block-editorial-relatedstories-article-date">
								{ post.date_gmt }
							</p>
							{ applyFilters(
								'buBlocks.relatedStories.displayListItem',
								'',
								post,
								currentPost
							) }
						</div>
					</article>
				</li>
			);
		};

		// Reset the related posts collection to its defaults to allow for
		// a fresh lookup after a change.
		const resetRelatedState = () => {
			setState( {
				relatedPosts: [],
				relatedPostsError: false,
				doingRelatedPostsFetch: false,
			} );
		};

		/**
		 * Remove a previously selected post from the list of manual posts.
		 *
		 * @param {Event} event
		 */
		const removeSelectedPost = ( event ) => {
			const postId = event.target.parentNode.dataset.postId;

			if ( ! postId ) {
				return;
			}

			const index = includePosts.indexOf( parseInt( postId ) );

			if ( index > -1 ) {
				setAttributes( {
					includePosts: includePosts.filter(
						( _, i ) => i !== index
					),
				} );
			}

			// Clear any error or existing fetch for selected posts.
			resetRelatedState();
		};

		/**
		 * Display the markup for an existing selected post.
		 *
		 * @param {Object} post The current post to display.
		 */
		const displaySelectedPost = ( post ) => {
			return (
				<li data-post-id={ post.id }>
					{ decodeEntities( post.title ) }{ ' ' }
					<button
						onClick={ removeSelectedPost }
						type="button"
						id="remove-selected-post"
						className="components-button is-tertiary"
					>
						Remove
					</button>
				</li>
			);
		};

		/**
		 * Handle the selection of a post in the URLInput component.
		 *
		 * @param {string} url  The data currently in the URLInput component's text input.
		 * @param {Object} post The full post object, once selected.
		 */
		const handleSelectPost = ( url, post ) => {
			// If `post` is undefined, then the user is still searching.
			if ( 'undefined' === typeof post ) {
				setAttributes( { URLInputEntry: url } );
			} else {
				// Once a post has been selected, add it to the list of included posts.
				setAttributes( {
					includePosts: includePosts.concat( post.id ),
				} );

				// Clear the URL input field to allow for another search.
				setAttributes( { URLInputEntry: '' } );

				// Clear any error or existing fetch for selected posts.
				resetRelatedState();
			}
		};

		/**
		 * Toggle the manual/automatic selection for how related posts are assigned.
		 */
		const toggleRelatedManual = () => {
			setAttributes( { relatedManual: ! relatedManual } );

			// Allow the manual toggle to retrigger a failed related posts request to YARPP.
			if ( relatedManual ) {
				setState( {
					yarppPosts: [],
					yarppPostsError: false,
					doingYarppPostsFetch: false,
				} );
			}

			resetRelatedState();
		};

		let cardCountClass = '';

		if ( className.includes( 'is-style-card' ) && cardCount === 2 ) {
			cardCountClass = 'has-two';
		} else if ( className.includes( 'is-style-card' ) ) {
			cardCountClass = ' has-three';
		}

		const classes = classnames( className, cardCountClass );

		return (
			<Fragment>
				<InspectorControls>
					<PanelBody
						title={ __( 'Settings' ) }
						className="panelbody-related-stories"
					>
						{ className.includes( 'is-style-card' ) && (
							<RangeControl
								label={ __( 'Cards' ) }
								value={ cardCount }
								onChange={ ( value ) =>
									setAttributes( { cardCount: value } )
								}
								initialPosition={ 2 }
								min={ 2 }
								max={ 3 }
							/>
						) }
						<ToggleControl
							label="Enable manual selection"
							help={
								relatedManual
									? 'Display manually selected related stories'
									: 'Display related stories automatically.'
							}
							checked={ relatedManual }
							onChange={ toggleRelatedManual }
						/>
						{ relatedManual && (
							<URLInput
								value={ URLInputEntry }
								onChange={ handleSelectPost }
							/>
						) }
						{ relatedManual && posts && posts.length > 0 && (
							<Fragment>
								<h3>Manually selected posts:</h3>
								<ul className="panelbody-related-stories-list">
									{ posts.map( ( post ) =>
										displaySelectedPost( post )
									) }
								</ul>
							</Fragment>
						) }
					</PanelBody>
				</InspectorControls>
				{ ! className.includes( 'is-style-card' ) && (
					<BlockControls>
						<BlockAlignmentToolbar
							value={ align }
							onChange={ ( value ) =>
								setAttributes( { align: value } )
							}
							controls={ [ 'left', 'right' ] }
						/>
					</BlockControls>
				) }
				<aside className={ classes }>
					<h3 className="wp-block-editorial-relatedstories-title">
						Related
					</h3>
					{ displayPosts && displayPosts.length > 0 ? (
						<ul className="wp-block-editorial-relatedstories-list">
							{ displayPosts &&
								displayPosts.map( ( post ) =>
									displayListItem( className, post )
								) }
						</ul>
					) : (
						<p className="wp-block-editorial-relatedstories-error">
							{ errorMessage
								? errorMessage
								: "Select related posts in this block's settings." }
						</p>
					) }
				</aside>
			</Fragment>
		);
	} ),

	// The front-end HTML for this block is handled in PHP, but
	// the save function is required.
	save() {
		return null;
	},
} );
