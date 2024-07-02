# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Add a new `release-notes` output to the action containing the release notes for the newly released versions.

## [3.0.0] - 2024-04-08

### Fixed

- Spacing in Markdown lists and definitions
- "unreleased" definition casing

### Changed

- Update action to use `node20`

## [2.0.0] - 2024-02-14

### Changed

- Update action to use `node16`

## [1.3.0] - 2021-10-12

### Added

- New optional `tag` argument allowing `v`-prefixed versions

### Changed

- The `version` argument is no longer required

### Deprecated

- The `version` argument will be replaced in favor of the `tag` argument

## [1.2.1] - 2021-02-23

### Fixed

- Allow `Unreleased` link reference to be lowercase.

## [1.2.0] - 2020-09-22

### Added

- Commit hook for preventing dist/index.js to be out of date after modifying Typescript files.
- Input `changelogPath` for making the path to the CHANGELOG.md file configurable. Defaults to "./CHANGELOG.md".

## [1.1.0] - 2020-02-17

### Added

- Add support for creating the first release using this action.

## [1.0.0] - 2020-02-15

### Added

- Initial release of this action!

[unreleased]: https://github.com/thomaseizinger/keep-a-changelog-new-release/compare/3.0.0...HEAD
[3.0.0]: https://github.com/thomaseizinger/keep-a-changelog-new-release/compare/2.0.0...3.0.0
[2.0.0]: https://github.com/thomaseizinger/keep-a-changelog-new-release/compare/1.3.0...2.0.0
[1.3.0]: https://github.com/thomaseizinger/keep-a-changelog-new-release/compare/1.2.1...1.3.0
[1.2.1]: https://github.com/thomaseizinger/keep-a-changelog-new-release/compare/1.2.0...1.2.1
[1.2.0]: https://github.com/thomaseizinger/keep-a-changelog-new-release/compare/1.1.0...1.2.0
[1.1.0]: https://github.com/thomaseizinger/keep-a-changelog-new-release/compare/1.0.0...1.1.0
[1.0.0]: https://github.com/thomaseizinger/keep-a-changelog-new-release/compare/8f254ca247120d87500da53956ae6c0c9d9fae3e...1.0.0
