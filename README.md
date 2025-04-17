# BU Block Imports

Standardized set of components, hooks, and utilities that can be used within WordPress blocks.

__In Development:__ This is just starting (March 2025) and it should be assumed that nothing actually works yet. Bug reports, feature requests, questions, and pull requests are welcome.

## Installation

1. Run `npm i @bostonuniversity/block-imports -D` within your WordPress theme or plugin.
2. Within your block editor code, import the relevant component(s) e.g. `import { ContentPicker } from '@bostonuniversity/block-imports';`

## Components

[Components](https://www.w3schools.com/react/react_components.asp) are independent and reusable bits of code. They serve the same purpose as JavaScript functions, but work in isolation and return HTML.

**These should be named in PascalCase without a BU namespace. They should use the [`.mjs`](https://v8.dev/features/modules#mjs) extension.**

- ![alt text](readme-icons/IssueClosedOld.svg) [AllowedBlocks](components/AllowedBlocks)
- ![alt text](readme-icons/IssueClosedOld.svg) [Background](components/Background)
- ![alt text](readme-icons/IssueClosedOld.svg) [BlockIcons](components/BlockIcons)
- ![alt text](readme-icons/IssueClosedOld.svg) [ColorSettings](components/ColorSettings)
- ![alt text](readme-icons/IssueClosedOld.svg) [ContentPicker](components/ContentPicker)
- ![alt text](readme-icons/IssueClosedOld.svg) [CustomBlockAppender](components/CustomBlockAppender)
- ![alt text](readme-icons/IssueClosedOld.svg) [FetchAllTermSelectControl](components/FetchAllTermSelectControl)
- ![alt text](readme-icons/IssueClosedOld.svg) [HelpWrapper](components/HelpWrapper)
- ![alt text](readme-icons/IssueClosedOld.svg) [IconPicker](components/IconPicker)
- ![alt text](readme-icons/IssueClosedOld.svg) [Image](components/Image)
- ![alt text](readme-icons/IssueClosedOld.svg) [LinkToolbar](components/LinkToolbar)
- ![alt text](readme-icons/IssueClosedOld.svg) [LoadingSpinner](components/LoadingSpinner)
- ![alt text](readme-icons/IssueClosedOld.svg) [MediaCredit](components/MediaCredit)
- ![alt text](readme-icons/IssueClosedOld.svg) [Optional](components/Optional)
- ![alt text](readme-icons/IssueClosedOld.svg) [ParagraphCaptionStyle](components/ParagraphCaptionStyle)
- ![alt text](readme-icons/IssueClosedOld.svg) [ParagraphEndOfArticleStyle](components/ParagraphEndOfArticleStyle)
- ![alt text](readme-icons/IssueClosedOld.svg) [PlainTextWithLimit](components/PlainTextWithLimit)
- ![alt text](readme-icons/IssueClosedOld.svg) [PostChooser](components/PostChooser)
- ![alt text](readme-icons/IssueClosedOld.svg) [PostPicker](components/PostPicker)
- ![alt text](readme-icons/IssueClosedOld.svg) [Repeater](components/Repeater)
- ![alt text](readme-icons/IssueClosedOld.svg) [RichTextWithLimit](components/RichTextWithLimit)
- ![alt text](readme-icons/IssueClosedOld.svg) [ShareTool](components/ShareTool)

## Hooks

These are [React Hooks](https://www.w3schools.com/react/react_hooks.asp), not WordPress Hooks. Hooks allow function components to have access to state, lifecycle methods, and other React features.

**These should be named in camelCase without a BU namespace. They should use the [`.mjs`](https://v8.dev/features/modules#mjs) extension.**

- ![alt text](readme-icons/IssueClosedOld.svg) [useAllTerms](hooks/useAllTerms)
- ![alt text](readme-icons/ApprovedChanges.svg) [useMedia](hooks/useMedia)
- ![alt text](readme-icons/IssueClosedOld.svg) [useRenderAppenderWithBlockLimit](hooks/useRenderAppenderWithBlockLimit)
- ![alt text](readme-icons/IssueClosedOld.svg) [useRequestData](hooks/useRequestData)

## Utils

These are just your standard garden variety javascript functions. They don't need all the features that hooks have.

**These should be named in camelCase without a BU namespace. They should use the [`.mjs`](https://v8.dev/features/modules#mjs) extension.**

- ![alt text](readme-icons/IssueDrafted.svg) [umlautEverything](utils/umlautEverything)

---

## Development

Each folder should contain a README.md file explaining the purpose and usage of the component/hook/util.

### Debugging

There is no build for this package. You can debug it though by running `npx wp-scripts build index.js` and ensure all paths can be resolved.

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
