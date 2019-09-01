<!-- Markdown Docs: -->
<!-- https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown -->
<!-- https://daringfireball.net/projects/markdown/basics -->
<!-- https://daringfireball.net/projects/markdown/syntax -->

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

# Description

Cross platform NodeJs `require` with mock content and file name and support babel, pirates, etc

```
import {requireFromString} from 'require-from-memory'

const myModule = requireFromString(
    'export default { ... }', 
    'fake/path/my-module.js',
    options, // optional
) 

/*
options: {
    logFilter(logEvent): boolean // return false to prevent show log
}

logEvent: {
    level: 'INFO' | 'WARNING' | 'ERROR',
    type: 'FindPath',
    message,
    filename,
    code,
    vars: {
        // additional info
    },
    exception,
}
*/
```

# License

[CC0-1.0](LICENSE)

[npm-image]: https://img.shields.io/npm/v/require-from-memory.svg
[npm-url]: https://npmjs.org/package/require-from-memory
[node-version-image]: https://img.shields.io/node/v/require-from-memory.svg
[node-version-url]: https://nodejs.org/en/download/
[travis-image]: https://travis-ci.org/NikolayMakhonin/require-from-memory.svg
[travis-url]: https://travis-ci.org/NikolayMakhonin/require-from-memory
[coveralls-image]: https://coveralls.io/repos/github/NikolayMakhonin/require-from-memory/badge.svg
[coveralls-url]: https://coveralls.io/github/NikolayMakhonin/require-from-memory
[downloads-image]: https://img.shields.io/npm/dm/require-from-memory.svg
[downloads-url]: https://npmjs.org/package/require-from-memory
[npm-url]: https://npmjs.org/package/require-from-memory
