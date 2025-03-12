# BU Block Imports

Standardized set of components, hooks, and utilities that can be used within WordPress blocks.

__In Development:__ This is just starting (March 2025) and it should be assumed that nothing actually works yet. Bug reports, feature requests, questions, and pull requests are welcome.

## Installation

1. Run `npm i @bostonuniversity/block-imports -D` within your WordPress theme or plugin.
2. Within your block editor code, import the relevant component(s) e.g. `import { ContentPicker } from '@bostonuniversity/block-imports';`

## Components

[Components](https://www.w3schools.com/react/react_components.asp) are independent and reusable bits of code. They serve the same purpose as JavaScript functions, but work in isolation and return HTML.

**These should be named in PascalCase without a BU namespace. They should use the [`.mjs`](https://v8.dev/features/modules#mjs) extension.**

- [AllowedBlocks](components/AllowedBlocks)
- [Background](components/Background)
- [BlockIcons](components/BlockIcons)
- [ColorSettings](components/ColorSettings)
- [ContentPicker](components/ContentPicker)
- [CustomBlockAppender](components/CustomBlockAppender)
- [FetchAllTermSelectControl](components/FetchAllTermSelectControl)
- [HelpWrapper](components/HelpWrapper)
- [IconPicker](components/IconPicker)
- [Image](components/Image)
- [LinkToolbar](components/LinkToolbar)
- [LoadingSpinner](components/LoadingSpinner)
- [MediaCredit](components/MediaCredit)
- [Optional](components/Optional)
- [ParagraphCaptionStyle](components/ParagraphCaptionStyle)
- [ParagraphEndOfArticleStyle](components/ParagraphEndOfArticleStyle)
- [PlainTextWithLimit](components/PlainTextWithLimit)
- [PostChooser](components/PostChooser)
- [PostPicker](components/PostPicker)
- [Repeater](components/Repeater)
- [RichTextWithLimit](components/RichTextWithLimit)
- [ShareTool](components/ShareTool)

## Hooks

These are [React Hooks](https://www.w3schools.com/react/react_hooks.asp), not WordPress Hooks. Hooks allow function components to have access to state, lifecycle methods, and other React features.

**These should be named in camelCase without a BU namespace. They should use the [`.mjs`](https://v8.dev/features/modules#mjs) extension.**

- [useAllTerms](hooks/useAllTerms)
- [useMedia](hooks/useMedia)
- [useRenderAppenderWithBlockLimit](hooks/useRenderAppenderWithBlockLimit)
- [useRequestData](hooks/useRequestData)

## Utils

These are just your standard garden variety javascript functions. They don't need all the features that hooks have.

**These should be named in camelCase without a BU namespace. They should use the [`.mjs`](https://v8.dev/features/modules#mjs) extension.**

- [umlautEverything](utils/umlautEverything)

---

## Development

Each folder should contain a README.md file explaining the purpose and usage of the component/hook/util.

### Debugging

There is no build for this package. You can debug it though by running `npx wp-scripts build debug.js` and ensure all paths can be resolved.

### Publishing & Release Process

This package is managed through NPM.  It can be found here: <https://www.npmjs.com/package/@bostonuniversity/block-components>

This repo has an action that will run whenever a new release is created.

To learn more about how NPM is managed for BU projects, please read <https://developer.bu.edu/webteam/developer/vcs/npm-javascript-packages/>

NOTE: you should verify that the package JSON file includes the following to make publishing easier:

```
"publishConfig": {
    "access": "public"
  }
```
