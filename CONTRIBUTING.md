# Contributing

Contributions are always welcome, no matter how large or small. I might be busy and forget about some things I want to add to the library at times.

## Set up local env

> Install yarn beforehand: https://yarnpkg.com/en/docs/install

To start developing on kindred-api you only need to install its dependencies:

```bash
git clone https://github.com/ChauTNguyen/kindred-api
cd kindred-api
yarn
touch .env
```

```sh
# .env
KEY= # I use my production key here to speed up the tests
KEY_TO_RATE_LIMIT= # Set this to your dev key; There's two small tests that test against the dev key to check for automatic retries.
```

Don't forget to set the above on Travis CI too since you're sending a PR.

## Tests
### Running tests locally

To run a build, tests and perform lint/flow checks:

```bash
yarn test
```

If you only want to run the tests:

```bash
yarn run test-only
```

Note, this does not actually run a build, so you may have to call `yarn run build` after
performing any changes.

### Running one test

To run only a single test, run
`./node_modules/mocha/bin/_mocha --compilers js:babel-core/register test/specs/whatever`.
