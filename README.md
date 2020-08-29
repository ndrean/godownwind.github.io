This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

.

### Code Splitting: Smaller payloads, reduce JS bundle

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

<https://www.kaliop.com/fr/react-js-reduire-son-bundle-javascript-avec-du-code-splitting/>

1. yarn analyze with source-map-explorer

```
yarn add source-map-explorer
```

Add in `package.json`:

```json
"scripts": {
  "analyze": "source-map-explorer 'build/static/js/*.js'",
  ...
}
```

On peut ensuite lancer les commandes :

```
yarn build
yarn analyze
```

2. Suspense & lazy import

```js
const LazyComponent = React.lazy(()=> import('./something'))
[...]
<Suspense fallback={<span>Loading...</span>}>
    <LazyComponent >
</Suspense>
```

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
