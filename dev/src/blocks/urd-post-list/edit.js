/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {useBlockProps} from '@wordpress/block-editor';

import {
	useRequestData,
	useMedia,
	LoadingSpinner,
} from '@bostonuniversity/block-imports';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @param  props
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {JSX.Element} Element to render.
 */
export default function Edit(props) {
	const {attributes, setAttributes} = props;
	const page = 1;
	const query = {
		per_page: 15,
		page,
	};

	let imageID = '';

	const [data, isLoading, invalidateRequest] = useRequestData(
		'postType',
		'post',
		query
	);

	if (data) {
		console.log(data);
	}

	const thePost = (post, invalidateRequest) => {
		const {media, isResolvingMedia, hasResolvedMedia} = useMedia(post.featured_media);
		console.log(media);
		return (
			<>
				{imageID && isResolvingMedia && (
					<LoadingSpinner
						text="Loading" // Default is undefined.
						shadow={false} // Default is true.
						className="a-custom-classname-to-add"
					/>
				)}
				{imageID && hasResolvedMedia && (
					<>
						<img src={media.source_url} width="150" alt={}/>
					</>
				)}
				<h2>{post.title.rendered}</h2>
				{post?.excerpt?.raw && (
					<p className="excerpt-something">
						{post.excerpt.raw}
					</p>
				)}
				<button type="button" onClick={invalidateRequest}>
					Refresh list
				</button>
			</>
		);
	};

	return (
		<>
			<div {...useBlockProps()}>
				{isLoading && (
					<>
						<LoadingSpinner
							text="Loading" // Default is undefined.
							shadow={false} // Default is true.
							className="a-custom-classname-to-add"
						/>
					</>
				)}

				{data && data.length > 0 && (
					{data.map(post => thePost(post, invalidateRequest))}
				)}
			</div>
		</>
	);
}
