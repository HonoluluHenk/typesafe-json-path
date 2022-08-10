<!--suppress HtmlDeprecatedAttribute, HtmlUnknownAnchorTarget -->
<a name="readme-top"></a>
# typesafe-json-path
 
Typesafe navigation in JSON data structures for typescrpt.

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

[![CI][Workflow-build-shield]][Workflow-build-url]
[![NPM][npm-package-shield]][npm-package-shield-url]

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li>
        <a href="#usage">Usage</a>
        <ul>
            <li><a href="#minimal-example">Minimal example</a></li>
            <li><a href="#full-example">Full example</a></li>
        </ul>
    </li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#changelog">Changelog</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

* Ever had a JSON data structure that is implemented in more than one file? Translation-files anyone?
* You wanted to access these values in a typesafe manner? I.e.: without resorting to string-keys?
* You want refactoring support from your IDE when renaming properties?
* You want compilation to fail if you mistyped a property name?

Read the examples in <a href="#usage">Usage</a> to find out how! 

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Usage

Best shown by example:

### Minimal example
```typescript
import {TypesafeJsonPath} from '@honoluluhenk/typesafe-json-path';

const translationsRoot = {
  FOO: {
    BAR: {
      BAZ: 'Baz was here!',
      HELLO: 'Hello World',
    }
  }
};

const path = TypesafeJsonPath.init<typeof translationsRoot>();

// please note: this is not string but real property access!
const pathAsString = path.FOO.BAR.HELLO.$path.path;
// 'FOO.BAR.HELLO'
const value = path.FOO.BAR.HELLO.$path.get(translationsRoot);

console.log(value);
// 'Hello World'
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Full example
The full power can be seen here: 
use a custom Resolver and go wild.

This example implements a translation service that is not access-by-string but fully typesafe!

```typescript
import {type PathSegment, Resolver, TypedObjectPath} from '@honoluluhenk/typesafe-json-path';

const translationsRoot = {
  FOO: {
    BAR: {
      BAZ: 'Baz was here!',
      HELLO: 'Hello %s',
      RUCKSACK: 'Rucksack',
    },
  },
};
// some other translation
const translationsDE = {
  FOO: {
    BAR: {
      BAZ: 'Baz war hier!',
      HELLO: 'Hallo %s',
    },
  },
};

// your custom path resolver
class Translator<T extends object> extends Resolver<unknown, T> {
  constructor(
    path: ReadonlyArray<PathSegment>,
    private readonly myTranslateService: MyCustomTranslateService,
  ) {
    super(path);
  }

  translate(...args: unknown[]): string {
    // Delegate to some translation service.
    return this.myTranslateService.translate(this.path, args);
  }
}

// include all variants to have full refactoring support in your IDE
type TranslationType = typeof translationsRoot & typeof translationsDE;

// Now the real fun begins...
const translations = TypesafeJsonPath.init<TranslationType, Translator<any>>(
  path => new Translator(
    path,
    new MyCustomTranslateService(navigator.languages[0], {en: translationsRoot, de: translationsDE}),
  ),
);

// again: this is not string but real property access in a typesafe and refactoring-friendly way!
const text = translations.FOO.BAR.HELLO.$path.translate('Welt');
// internally, myTranslateService.translate() was called with the path-string 'FOO.BAR.HELLO'.
// Assuming the user language was some german (de) locale
console.log(text);
// 'Hallo Welt'

```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

This npm library is intended to be used in typescript and javascript projects.

Just install the NPM package:
```sh
npm install @honoluluhenk/typesafe-json-path
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Changelog
See [releases][releases-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Run tests/linting (`npm run prepush`)
5. Push to the Branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## License

Distributed under the Lesser Gnu Public License 2.1 (LGPL-2.1) License. See [`LICENSE`](LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Contact

Christoph Linder - post@christoph-linder.ch

Project Link: [https://github.com/HonoluluHenk/typesafe-json-path](https://github.com/HonoluluHenk/typesafe-json-path)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


[contributors-shield]: https://img.shields.io/github/contributors/HonoluluHenk/typesafe-json-path.svg?style=for-the-badge
[contributors-url]: https://github.com/HonoluluHenk/typesafe-json-path/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/HonoluluHenk/typesafe-json-path.svg?style=for-the-badge
[forks-url]: https://github.com/HonoluluHenk/typesafe-json-path/network/members
[stars-shield]: https://img.shields.io/github/stars/HonoluluHenk/typesafe-json-path.svg?style=for-the-badge
[stars-url]: https://github.com/HonoluluHenk/typesafe-json-path/stargazers
[issues-shield]: https://img.shields.io/github/issues/HonoluluHenk/typesafe-json-path.svg?style=for-the-badge
[issues-url]: https://github.com/HonoluluHenk/typesafe-json-path/issues
[releases-url]: https://github.com/HonoluluHenk/typesafe-json-path/releases
[license-shield]: https://img.shields.io/github/license/HonoluluHenk/typesafe-json-path.svg?style=for-the-badge
[license-url]: https://github.com/HonoluluHenk/typesafe-json-path/blob/master/LICENSE.txt
[npm-package-shield]: https://badge.fury.io/js/@honoluluhenk%2Ftypesafe-json-path.svg
[npm-package-shield-url]: https://badge.fury.io/js/@honoluluhenk%2Ftypesafe-json-path
[Workflow-build-shield]: https://github.com/HonoluluHenk/typesafe-json-path/actions/workflows/build-and-publish.yml/badge.svg?branch=main
[Workflow-build-url]: https://github.com/HonoluluHenk/typesafe-json-path/actions/workflows/build-and-publish.yml
