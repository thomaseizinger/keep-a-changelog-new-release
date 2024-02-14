# Keep A Changelog - New Release

This GitHub action will update your CHANGELOG.md for a new release:

- Changes the 'unreleased' section to the new version
- Updates the links to the tags at the end of the file
- Inserts a new 'unreleased' section at the top

Here is a diff from one of the [test cases](./__tests__/fixtures/standard):

```diff
diff --git a/./__tests__/fixtures/standard/CHANGELOG.md b/./__tests__/fixtures/standard/CHANGELOG.expected.md
index bc86d0e..08101e3 100644
--- a/./__tests__/fixtures/standard/CHANGELOG.md
+++ b/./__tests__/fixtures/standard/CHANGELOG.expected.md
@@ -7,6 +7,8 @@ and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0
 
 ## [Unreleased]
 
+## [0.3.0] - 2019-12-06
+
 ### Changed
 
 -   Our main theme is now blue instead of red.
@@ -28,7 +30,9 @@ and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0
 
 -   Initial release :tada:
 
-[Unreleased]: https://github.com/foo/bar/compare/0.2.0...HEAD
+[Unreleased]: https://github.com/foo/bar/compare/0.3.0...HEAD
+
+[0.3.0]: https://github.com/foo/bar/compare/0.2.0...0.3.0
 
 [0.2.0]: https://github.com/foo/bar/compare/0.1.0...0.2.0
 

```

## Usage

Within a workflow, you can use it like this:

```yaml
name: "..."
on: ...

jobs:
  update-changelog:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Update changelog
      uses: thomaseizinger/keep-a-changelog-new-release@v2
      with:
        tag: v0.6.0 # You probably want to have this dynamic :)
```

The action will do nothing else apart from modifying the changelog.
It neither creates a commit, nor does it push anything to anywhere.
You will have to do that as part of your workflow if you need this behaviour.

Checkout [this blogpost](https://blog.eizinger.io/12274/using-github-actions-to-automate-gitflow-style-releases) or [this repository](https://github.com/thomaseizinger/github-action-gitflow-release-workflow) for a set of workflows of an automated release using GitFlow and Github actions.
