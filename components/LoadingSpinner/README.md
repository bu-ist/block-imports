# BU Loading Spinner
## Status: BETA

![Loading Spinner Component Example](BU_Loading_Spinner.gif)

A loading spinner to be used to indicate some activity is occuring.

Extends the core `<Spinner />` component so that it can include
some text, a background, and an optional shadow for placing the
this Loading indicator as an absolutely positioned element covering
some content.


## Usage
```js
import { BULoadingSpinner } from '@bostonuniversity/block-components';
```


```js
{ isLoading && (
	<BULoadingSpinner
		text="Loading" // Default is undefined.
		shadow={false} // Default is true.
		className="a-custom-classname-to-add"
	/>
)}
```
