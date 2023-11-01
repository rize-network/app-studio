
# App Studio

[![npm version](https://img.shields.io/npm/v/app-studio.svg?style=for-the-badge)](https://www.npmjs.com/package/app-studio)
[![npm](https://img.shields.io/npm/dt/app-studio.svg?style=for-the-badge)](https://www.npmjs.com/package/app-studio)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=for-the-badge)](https://github.com/prettier/prettier)


[npm-image]: http://img.shields.io/npm/v/app-studio.svg?style=flat-square
[npm-url]: http://npmjs.org/package/app-studio
[github-action-image]: https://github.com/rize-network/app-studio/workflows/%E2%9C%85%20test/badge.svg
[github-action-url]: https://github.com/rize-network/app-studio/actions?query=workflow%3A%22%E2%9C%85+test%22

[download-image]: https://img.shields.io/npm/dm/app-studio.svg?style=flat-square
[download-url]: https://npmjs.org/package/app-studio

[help-wanted-image]: https://flat.badgen.net/github/label-issues/rize-network/app-studio/help%20wanted/open
[help-wanted-url]: https://github.com/rize-network/app-studio/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22

[discussions-image]: https://img.shields.io/badge/discussions-on%20github-blue?style=flat-square
[discussions-url]: https://github.com/rize-network/app-studio/discussions

[issues-helper-image]: https://img.shields.io/badge/using-issues--helper-orange?style=flat-square
[issues-helper-url]: https://github.com/actions-cool/issues-helper




## ✨ Features

- 🌈 Add styled props to your application.
- 📦 A set of Simple and powerful React components.
- 🌍 Internationalization support for dozens of languages.
- 🎨 Powerful theme customization in every detail.

## 📦 Install

```bash
npm install app-studio  styled-components --save
```

## 🔨 Usage

The `<View>` component supports all of the default [CSSProperties](https://developer.mozilla.org/fr/docs/Web/CSS/CSS_Properties_Reference) as props. The styles transformed and handled by [Styled Components](https://styled-components.com/).


1. Add Responsive and Theme Provider  to your application root :

```jsx
import React from 'react';
import { ResponsiveProvider, ThemeProvider } from 'app-studio';

const Root = () => {
    return (<ResponsiveProvider>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </ResponsiveProvider>);
};

```


```jsx
import React from 'react';
import { View } from 'app-studio';

function Example() {
	return (
		<View 
    backgroundColor="color.grey" 
    padding={20}
    on={{ hover: { backgroundColor: 'color.blue.100' } }}
    >
			Hello
		</View>
	);
}
```


You can Use View is use <div> tag you can use  Div, Span, Form, Input, Image components if you need another tag.

### TypeScript

`app-studio` is written in TypeScript with complete definitions.


## 🔗 Links
- [Change Log](CHANGELOG.md)
- [Versioning Release Note](https://github.com/rize-network/app-studio/wiki/)
- [FAQ](https://ant.design/docs/react/faq)
- [CodeSandbox Template](https://u.ant.design/codesandbox-repro) for bug reports
- [Customize Theme](https://ant.design/docs/react/customize-theme)
- [How to Apply for Being A Collaborator](https://github.com/rize-network/app-studio/wiki/Collaborators#how-to-apply-for-being-a-collaborator)



## 🤝 Contributing [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Read our [contributing guide](https://ant.design/docs/react/contributing) and let's build a better rize-network together.

We welcome all contributions. Please read our [CONTRIBUTING.md](https://github.com/rize-network/app-studio/blob/master/.github/CONTRIBUTING.md) first. You can submit any ideas as [pull requests](https://github.com/rize-network/app-studio/pulls) or as [GitHub issues](https://github.com/rize-network/app-studio/issues). If you'd like to improve code, check out the [Development Instructions](https://github.com/rize-network/app-studio/wiki/Development) and have a good time! :)

If you are a collaborator, please follow our [Pull Request principle](https://github.com/rize-network/app-studio/wiki/PR-principle) to create a Pull Request with [collaborator template](https://github.com/rize-network/app-studio/compare?expand=1&template=collaborator.md).

[![Let's fund issues in this repository](https://issuehunt.io/static/embed/issuehunt-button-v1.svg)](https://issuehunt.io/o/rize-network)



## ❤️ Sponsors and Backers [![](https://opencollective.com/rize/tiers/sponsors/badge.svg?label=Sponsors&color=brightgreen)](https://opencollective.com/rize#support) [![](https://opencollective.com/rize/tiers/backers/badge.svg?label=Backers&color=brightgreen)](https://opencollective.com/rize#support)

[![](https://opencollective.com/rize/tiers/sponsors.svg?avatarHeight=36)](https://opencollective.com/rize#support)

[![](https://opencollective.com/rize/tiers/backers.svg?avatarHeight=36)](https://opencollective.com/rize#support)


<!-- 
## Fundamentals

| Property    |  Type  |  Default  | Description           |
| ----------- | :----: | :-------: | --------------------- |
| title       | string | undefined | change the title      |
| description | string | undefined | change the descrition | -->

## Roadmap 

- Integrate React Native 
- Build a documentation website
- manage  all pseudo class  : https://html.spec.whatwg.org/multipage/semantics-other.html#selector-hover

## Author

SteedMonteiro, steed@rize.network

## License

App Studio is available under the MIT license. See the LICENSE file for more info.
