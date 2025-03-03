https://github.com/10up/block-components/tree/develop/hooks/use-all-terms

# `useAllTerms`

The `useAllTerms` hook is a simple utility that makes it easy to get all terms from a taxonomy.

## Usage

```js
import { useAllTerms } from '@10up/block-components';

function BlockEdit(props) {
    const [categories, hasResolvedCategories] = useAllTerms('category');

    if ( ! hasResolvedCategories ) {
        return <Spinner />
    }

    return (
        ...
    );
}
```
