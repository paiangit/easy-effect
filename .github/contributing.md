# Contributing Guide

## Development Setup

You will need Node.js, and PNPM.

After cloning the repo, run:

```sh
pnpm i # install the dependencies of the project
```

## Scripts

In the project directory, you can run:

### `pnpm start`

Runs the app in the development mode.

### `pnpm test`

Launches the test runner in the interactive watch mode.

### `pnpm run build`

Builds the app for production to the `build` folder.

## Project Structure

TODO

## Commit Message Template

```
head:
<type>(<scope>): <subject>
- type: feat, fix, docs, style, refactor, test, build, ci, revert
- scope: can be empty (eg. if the change is a global or difficult to assign to a single component)
- subject: start with verb (such as 'change'), 50-character line

body:
72-character wrapped. This should answer:
* Why was this change necessary?
* How does it address the problem?
* Are there any side effects?

footer: 
- Include a link to the ticket, if any.
- BREAKING CHANGE

```
