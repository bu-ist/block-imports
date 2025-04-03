// WordPress dependencies.
import { __ } from '@wordpress/i18n';

import { Button, ExternalLink } from '@wordpress/components';

import { decodeEntities } from '@wordpress/htmlEntities';

import { dateI18n, format } from '@wordpress/date';

export const SearchItem = function ( props ) {
	const { postID, title, post, selectHandler, placeholder = false } = props;

	return (
		<div className="bu-components-post-chooser-results-item-container">
			<div className="bu-components-post-chooser-results-item-inner">
				<div className="bu-components-post-chooser-results-item-postdetails">
					<div className="bu-components-post-chooser-results-item-title">
						{ post && (
							<>
								{ title
									? decodeEntities( title.rendered )
									: __( 'Title Not Found' ) }

								{ post?.link && (
									<span className="bu-components-post-chooser-results-item-link">
										<ExternalLink href={ post.link }>
											View Post
										</ExternalLink>
									</span>
								) }
							</>
						) }
					</div>
					<div className="bu-components-post-chooser-results-item-metadata">
						{ post?.modified && (
							<span className="bu-components-post-chooser-results-item-modified">
								<>
									Last Updated:{ ' ' }
									{ dateI18n(
										'F j, Y, g:i a',
										post.modified
									) }
								</>
							</span>
						) }
						{ post?.status && (
							<span className="bu-components-post-chooser-results-item-status">
								<>Status: { post.status }</>
							</span>
						) }
					</div>
				</div>
				<div className="bu-components-post-chooser-results-item-posttype">
					<span className="bu-components-post-chooser-results-item-type">
						{ post && post.type }
					</span>
				</div>
			</div>
			{ post ? (
				<Button
					className="bu-components-post-chooser-item-select-button"
					onClick={ () => selectHandler( post ) }
				>
					Select
				</Button>
			) : (
				<Button
					className="bu-components-post-chooser-item-select-button"
					disabled={ true }
				></Button>
			) }
		</div>
	);
};
