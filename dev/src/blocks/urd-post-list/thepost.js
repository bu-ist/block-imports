import {__} from '@wordpress/i18n';

import {decodeEntities} from '@wordpress/components';

import {
	useMedia,
	LoadingSpinner,
} from '@bostonuniversity/block-imports';

export const ThePost = (props) => {
	const {
		post
	} = props;
	const {media, isResolvingMedia, hasResolvedMedia} = useMedia(post.featured_media);
	console.log(post);
	return (
		<div id={post.id} className="post-container" style={{border: "1px dotted #f00", margin:'10px', padding: '10px'}}>
			{media && isResolvingMedia && (
				<LoadingSpinner
					text="Loading"
					shadow={false}
					className="a-clever-classname"
				/>
			)}
			{media && hasResolvedMedia && (
				<>
					<img src={media.source_url} alt={media.alt_text} width="150"/>
				</>
			)}
			<h2>{post.title.rendered}</h2>
			{post?.excerpt?.raw && (
				<p className="excerpt-something">
					{post.excerpt.raw}
				</p>
			)}
		</div>
	);
};
