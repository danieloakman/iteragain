# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.18.4] - 2024-01-15

### Changed

- `partiton` now calls next instead of using `this`.

### Fixed

- Fixed immutability bug in ExtendedIterator.
- Update docs when package.json is updated.

## [3.18.3] - 2023-10-03

### Fixed

- Fixed filter typings.
- Removed docs publish.
- Updated badge in readme.

### Changed

- Renamed to update docs

## [3.18.2] - 2023-09-22

### Fixed

- Publishing is now done with execSync.
- Put code inside of main.
- publish-all now uses sh instead of execSync which is blocking.
- Added js-utils.
- turn off incremental as it causes problems with cleaning.
- Removed duplicate entry in .npmignore.

## [3.18.1] - 2023-09-22

### Fixed

- modified npmignore.

## [3.18.0] - 2023-09-22

### Added

- Added support for currying to most standalone functions
- Added some jsdoc to pipe
- Added check and check:watch scripts
- Added toIterableIterator to index.ts
- Added toIterableIterator
- Added npm-publish workflow
- Added some badges

### Fixed

- Fixed tap type bug
- Fixed pre-commit
- Fixed max type bugs
- Fixed a type bug with chunks.ts

### Changed

- Improved type checking in tests by wrapping `equal`
- Fixed flatMap type bug
- `length` no longer imports `reduce`
- More support for currying and changed all imports to types.ts to have the type keyword
- `reverse` now uses toIterableIterator
- Renamed AnyFunction to Fn and made it more useful
- Updated delpoy-docs.yml

[Unreleased]: https://github.com/danieloakman/iteragain/compare/v3.18.4...HEAD
[3.18.4]: https://github.com/danieloakman/iteragain/compare/v3.18.3...v3.18.4
[3.18.3]: https://github.com/danieloakman/iteragain/compare/v3.18.2...v3.18.3
[3.18.2]: https://github.com/danieloakman/iteragain/compare/v3.18.1...v3.18.2
[3.18.1]: https://github.com/danieloakman/iteragain/compare/v3.18.0...v3.18.1
[3.18.0]: https://github.com/danieloakman/iteragain/compare/v3.17.0...v3.18.0
[3.17.0]: https://github.com/danieloakman/iteragain/compare/v3.0.0...v3.17.0
[3.0.0]: https://github.com/danieloakman/iteragain/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/danieloakman/iteragain/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/danieloakman/iteragain/compare/v0.0.1...v1.0.0
