/**
 * Component: Post Chooser
 *
 * Displays the ten most recently published posts,
 * and an option to search.
 */

// External dependencies.
//import { parse as defaultParse } from '@wordpress/block-serialization-default-parser';

// Import CSS.
import './editor.scss';

// Internal dependencies.
import { SearchItem } from './searchitem';
import { BULoadingSpinner } from '../loading-spinner';


// WordPress dependencies.
import { __ } from '@wordpress/i18n';

import {
	useState,
	useEffect
} from '@wordpress/element';

import {
	Button,
	Modal,
	Spinner,
	TextControl,
	RadioControl,
} from '@wordpress/components';




import apiFetch from '@wordpress/api-fetch'

import {
	addQueryArgs
} from '@wordpress/url';




/**
 * The main PostChooser component
 *
 * This component is exported so that it can be imported into other blocks
 * and used as a reusable post picker. It supports a number of options and fetches
 * posts from the Rest API and returns information about the post to the parent block
 * using the component.
 *
 * @param {*} props
 *
 * @returns
 */
export const PostChooser = ( props ) => {

	const {
		onSelectPost,
		label          = 'Enter a search query',
		buttonLabel = __( 'Select Post' ),
		postTypes      = [ 'posts', 'pages' ], // Default post types to search.
		placeholder    = '',
		minCharacters  = 3,
		metaQueryArgs,
	} = props;

	/**
	 * Modal State Handlers.
	 *
	 * Manages the open/closed state of the Modal
	 * that contains the Post Chooser UI.
	 */
	const [
		isModalOpen,
		setIsModalOpen
	] = useState( false );

	/**
	 * Search Results State Handler.
	 *
	 * Manages the state of the Search results.
	 */
	const [
		searchResults,
		setSearchResults
	] = useState( [] );

	/**
	 * Search String State Handler.
	 *
	 * Manages the state of the actual search query string.
	 */
	const [
		searchString,
		setSearchString
	] = useState( '' );

	/**
	 * Loading results from endpoint state handler.
	 *
	 * Manages the Loading state when fetching results from the endpoint.
	 */
	const [
		isLoading,
		setIsLoading
	] = useState( false );

	/**
	 * Selected Post State Handler.
	 *
	 * Manages the state of a user selected post from the post query results.
	 */
	const [
		selectedItem,
		setSelectedItem
	] = useState( null );

	/**
	 * Slug Query Param State Handler.
	 *
	 * Manages the state of the user selected Search Type to be performed
	 * such as "content", "slug", or "postid". Whichever type of search the user
	 * selects is stored by this state handler.
	 */
	const [
		searchType,
		setSearchType
	] = useState( 'content' );



	/**
	 * Update the searchString when the search field value is changed.
	 *
	 * @param {string} value search query string
	 */
	const handleSearchStringChange = ( value ) => {
		setSearchString( value );
	};

	/**
	 * Initiate a search automatically if the search string
	 * is equal or greater to the minCharacters.
	 *
	 * Uses useEffect to monitor for the change to `searchString`. `searchString` is
	 * set via state which can happen asynchronously so useEffect is a better way
	 * to trigger a search vs the onChange handler of the search field which was sometimes
	 * searching without the last character of the field value.
	 */
	useEffect( () => {
		// Check if we can generate IDs for this block.
		if ( ! searchString ) {
			return;
		}

		// Show the results after typing at least 3 characters
		if ( searchString && ( searchString.length >= minCharacters || searchType === 'postid' ) ) {
			searchPosts( searchString );
		}

	}, [ searchString ] );

	/**
	 * Using the keyword and the list of tags that are linked to the parent block
	 * search for posts that match and return them to the autocomplete component.
	 *
	 * @param {string} keyword search query string
	 */
	const searchPosts = ( keyword ) => {
		// Remove existing search results.
		setSearchResults([]);

		// Set our IsLoading state to block the UI.
		setIsLoading(true);

		// Store our requests.
		let requests = [];

		postTypes.forEach( postType => {
			// Build a request for each post type.
			// Use the standard but simpler endpoint.
			let path = addQueryArgs( `/wp/v2/${postType}`, {
				//search: searchString,
			} );

			// Add the Slug argument if needed.
			if ( 'slug' === searchType ) {
				path = addQueryArgs( path, {
					slug: keyword,
				} );
			} else if ( 'postid' === searchType ) {
				path = addQueryArgs( path, {
					include: keyword,
				} );
			} else {
				path = addQueryArgs( path, {
					search: keyword,
				} );
			}

			// Make the request to the standard endpoint.
			const request = apiFetch( {
				path: path,
			} );

			// Add this request to the requests array.
			requests.push( request );

		} );


		Promise.all( requests ).then( ( results ) => {
			let data = results.reduce( ( result, final ) => [...final, ...result], [] );
			setSearchResults( data );
			setIsLoading( false );
		} );



	};

	/**
	 * Handle selection of a post from the search results
	 *
	 * Passes the selected item data to the `onSelectPost` function passed from the block
	 * that called this component.
	 *
	 * @param {*} item
	 */
	function handleSelection( item ) {

		if ( item === 0) {
			setSelectedItem( null );
		}

		setSelectedItem( item );

		// Call passed onSelectPost Function.
		if ( onSelectPost instanceof Function ) {
			onSelectPost( item );
		}

		// Close the Modal.
		setIsModalOpen(false);
	}

	return (
		<>
			<Button
				isPrimary
				className="bu-components-post-chooser-button"
				onClick={ () => {
					setIsModalOpen(true);
				} }
			>{ buttonLabel }</Button>

			{ isModalOpen && (
				<Modal
					title={ __( 'Post Chooser' ) }
					onRequestClose={ () => setIsModalOpen(false) }
					className="bu-components-post-chooser-modal"
				>
					<div className="bu-components-search-controls">
						<RadioControl
							className="bu-components-post-chooser-searchtype"
							label="Search by:"
							help="The type of search to perform"
							selected={ searchType }
							options={ [
								{ label: 'Content', value: 'content' },
								{ label: 'Post ID', value: 'postid' },
								{ label: 'Post Slug', value: 'slug' },
							] }
							onChange={ ( option ) => setSearchType( option ) }
						/>
						<div className='bu-components-post-chooser-search-bar'>
							<TextControl
								className='bu-components-post-chooser-search-field'
								label={ label }
								value={ searchString }
								onChange={ handleSearchStringChange }
								placeholder={ placeholder }
								type={ 'postid' === searchType ? 'number' : 'text' }
							/>
							<Button
								className="bu-components-post-chooser-search-button"
								isPrimary
								disabled={ isLoading }
								isBusy={ isLoading }
								onClick={ () => {
									searchPosts( searchString )
								} }
							>{ __( 'Search', 'bu-stories' ) }</Button>

						</div>
					</div>



					<ul className={ 'bu-components-post-chooser-results' } >
						{/* { searchString.length < minCharacters && !isLoading && !searchResults.length && (
							<li className={ 'bu-components-post-chooser-results-item' }>
								<Button disabled>{ __( `Enter a minimum of ${minCharacters} characters to search.` ) }</Button>
							</li>
						) } */}
						{ isLoading && (
							<BULoadingSpinner text="Loading" />
						)}

						{ !searchResults.length && (
							<>
								<li className={ 'bu-components-post-chooser-results-item bu-components-post-chooser-results-item-placeholder' }>
									<SearchItem
										placeholder={true}
									/>
								</li>
								<li className={ 'bu-components-post-chooser-results-item bu-components-post-chooser-results-item-placeholder' }>
									<SearchItem
										placeholder={true}
									/>
								</li>
								<li className={ 'bu-components-post-chooser-results-item bu-components-post-chooser-results-item-placeholder' }>
									<SearchItem
										placeholder={true}
									/>
								</li>
							</>
						)}


						{ searchString.length >= minCharacters && !isLoading && !searchResults.length && (
							<li className={ 'bu-components-post-chooser-results-item' }>
								<p>{ __( 'No Items found' ) }</p>
							</li>
						) }
						{searchResults.map((post, index) => {
							if (!post.title.rendered.length) {
								return null;
							}

							return (
								<li key={post.id} className={ 'bu-components-post-chooser-results-item' }>
									<SearchItem
										postID={ post.id }
										title={ post.title }
										post={ post }
										selectHandler={ handleSelection }
									/>
								</li>
							);
						})}
					</ul>

				</Modal>
			) }
		</>
	)
};
