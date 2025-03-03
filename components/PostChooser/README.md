# BU Post Picker
## Status: BETA

![PostChooser Component Example](BU_Post_Chooser.gif)

A post picker for blocks that returns the post object of the
selected post. The returned data can either be directly displayed
or used to fetch additional data from data stores such as media.


## Usage
```js
import { PostChooser, PostChooserSidebar } from '@bostonuniversity/block-components';
```


`<PostChooser />` provides a button that let's the user open
a modal to search for and select a post.
```js
<PostChooser
	label="Choose a post"
	buttonLabel="Choose..."
	placeholder="Pick something..."
	onSelectPost={ calloutSelectedPostHandler }
/>
```

`<PostChooserSidebar />` provides a panel in the Inspector Controls that
displays the currently selected post and allows the user to remove the post. Additionally, if you pass a `<PostChooser>` component as a child you can easily add a button to select the post or change it.

This can be useful so the user doesn't have to remove the post to change the post and in situations where you can't fit a "choose post" button in the block in the editor and want all controls in the sidebar.
```js
<PostChooserSidebar
	postTitle={ selectedPostTitle }
	postID={ selectedPostID }
	postURL={ selectedPostURL }
	onRemovePost={ calloutRemovePostHandler }
>
	<PostChooser
		onSelectPost={ calloutSelectedPostHandler }
		buttonLabel={ selectedPostID ? "Change" : "Select Post" }
	/>
</PostChooserSidebar>
```
