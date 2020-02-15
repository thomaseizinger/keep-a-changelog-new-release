# Git Flow releases using GitHub actions

This GitHub action helps you in automating a Git Flow like release process.

## What does it do for me?

This action is designed to listen on the `IssueEvent` "opened".
Given an issue with the title "Release version x.y.z", the action will branch of a release branch from the current development branch, update the changelog according to the new version and open a pull request against master.

## Getting started

Define a new workflow like this:

```yaml
name: "Create a release PR"
on:
  issues: opened

jobs:
  create-release-pr:
    runs-on: ubuntu-latest
    if: startsWith(github.event.issue.title, "Release version") # only run for issues with a specific title
    steps:
    - uses: actions/checkout@v2
    
    - name: Extract version from issue title
      run: |
        TITLE=${{ github.event.issue.title }} 
        VERSION=${TITLE#Release version }
        
        echo "::set-env name=RELEASE_VERSION::$VERSION"
    
    - name: Create release branch
      run: git checkout -b release/${{ env.RELEASE_VERSION }}
      
    - name: Update changelog
      uses: thomaseizinger/update-changelog-for-release@v1
      with:
        version: ${{ env.RELEASE_VERSION }}

    # This step will differ depending on your project setup
    - name: Bump version in package.json
      run: yarn version --new-version ${{ env.RELEASE_VERSION }}
    
    - name: Commit changelog and manifest files
      run: |
        git add CHANGELOG.md package.json
        git commit --message "Prepare release ${{ env.RELEASE_VERSION }}"
    
    - name: Push new branch
      run: git push origin release/${{ env.RELEASE_VERSION }}
    
    - name: Create pull request
      uses: thomaseizinger/create-pull-request@v1
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        branch: release/${{ env.RELEASE_VERSION }}
        base: master
        reviewers: ${{ github.event.issue.user.login }}
        body: |
          Resolves #${{ github.event.issue.number }} 
```
