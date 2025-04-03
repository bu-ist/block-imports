# Hooks

These should be camelCase.

These are [React Hooks](https://react.dev/reference/react/hooks), not [WordPress Block Hooks](https://developer.wordpress.org/news/2024/03/exploring-the-block-hooks-api-in-wordpress-6-5/#how-to-create-block-hooks).

Hooks are defined using JavaScript functions, but they represent a special type of reusable UI logic with restrictions on where they can be called. Functions whose names start with use are called Hooks in React.

**Don’t call Hooks inside loops, conditions, nested functions, or try/catch/finally blocks. Instead, always use Hooks at the top level of your React function, before any early returns.**

Read the [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks).
