> [conventional-changelog](https://github.com/ajoslin/conventional-changelog) [Angular](https://github.com/angular/angular) preset for BitBucket repositories

See [convention](convention.md).

**Issues with the convention itself should be reported on the angular issue tracker.**

<!--[RM_BADGES]-->
[![NPM Version](https://img.shields.io/npm/v/conventional-changelog-angular-bitbucket.svg?style=flat-square)](http://npm.im/conventional-changelog-angular-bitbucket)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Coverage Status](https://coveralls.io/repos/github/uglow/conventional-changelog-angular-bitbucket/badge.svg?branch=master)](https://coveralls.io/github/uglow/conventional-changelog-angular-bitbucket?branch=master)
[![Dependencies status](https://david-dm.org/uglow/conventional-changelog-angular-bitbucket/status.svg?theme=shields.io)](https://david-dm.org/uglow/conventional-changelog-angular-bitbucket#info=dependencies)
[![Dev-dependencies status](https://david-dm.org/uglow/conventional-changelog-angular-bitbucket/dev-status.svg?theme=shields.io)](https://david-dm.org/uglow/conventional-changelog-angular-bitbucket#info=devDependencies)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


<!--[]-->

## Why does this exist?

The [conventional-changelog-angular](https://github.com/conventional-changelog/conventional-changelog) preset
assumes that the repository is hosted on GitHub, but it will still work (with limited functionality) for non-GitHub repositories.

This preset aims to produce a changelog that contains the correct formatting and links for BitBucket.
 
### Differences to [conventional-changelog-angular](https://github.com/conventional-changelog/conventional-changelog)
- Issue links are highlighted automatically by BitBucket. But if there is a bugs URL in `package.json`, then issue links WILL be generated.
- @-mentions are highlighted automatically by BitBucket
- Commit links use a different format
- Comparison links (between two versions) use a different format

<!--[RM_INSTALL]-->
## Install

    npm install conventional-changelog-angular-bitbucket --save-dev


<!--[]-->

## Usage

1. Install the package in the project which will use it.
2. Set the preset to `angular-bitbucket`:

```
const changelog = require('conventional-changelog');
changelog({preset: 'angular-bitbucket'});
```

### Usage with `corp-semantic-release`

```json
{
  "repository": {
    "type": "git",
    "url": "https://bitbucket.host.com/org/repo.git"
  },
  "bugs": {
    "url": "https://some.url/issues"
  },
  "scripts": {
    "semantic-release": "corp-semantic-release --changelogpreset angular-bitbucket"
  },
  "devDependencies": {
    "conventional-changelog-angular-bitbucket": "*",
    "corp-semantic-release": "6.2.0"
  }
}

```

<!--[RM_CONTRIBUTING]-->
## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).


<!--[]-->

<!--[RM_LICENSE]-->
## License

This software is licensed under the MIT Licence. See [LICENSE](LICENSE).

<!--[]-->

## Thanks

Thanks to [stevemao](https://github.com/stevemao) who wrote [conventional-changelog-angular](https://github.com/conventional-changelog/conventional-changelog).
