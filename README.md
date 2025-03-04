# BU Block Components

Standardized set of components, hooks, and utilities that can be used within WordPress blocks.

## Installation

1. Run `npm i @bostonuniversity/block-imports -D` within your WordPress theme or plugin.
2. Within your block editor code, import the relevant component(s) e.g. `import { ContentPicker } from '@10up/block-components';`

## Components

- AllowedBlocks
- Background
- BlockIcons
- ColorSettings
- ContentPicker
- CustomBlockAppender
- FetchAllTermSelectControl
- HelpWrapper
- IconPicker
- Image
- LinkToolbar
- LoadingSpinner
- MediaCredit
- optional
- ParagraphCaptionStyle
- ParagraphEndOfArticleStyle
- PlainTextWithLimit
- PostChooser
- PostPicker
- Repeater
- RichTextWithLimit
- ShareTool

## Hooks

These are React Hooks, not WordPress Hooks.

- useAllTerms
- useMedia
- useRenderAppenderWithBlockLimit
- useRequestData

### Utils

Not a hook, but something more...

- umlautEverything

## Support Level

__In Development:__ This is just starting (March 2025) and it should be assumed that nothing actually works yet. Bug reports, feature requests, questions, and pull requests are welcome.

## Publishing & Release Process

This package is managed through NPM.  It can be found here: <https://www.npmjs.com/package/@bostonuniversity/block-components>

This repo has an action that will run whenever a new release is created.

To learn more about how NPM is managed for BU projects, please read <https://developer.bu.edu/webteam/developer/vcs/npm-javascript-packages/>

NOTE: you should verify that the package JSON file includes the following to make publishing easier:

```
"publishConfig": {
    "access": "public"
  }
```
