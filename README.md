This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Caching

<https://jakearchibald.com/2016/caching-best-practices/>

< <!-- https://web.dev/uses-rel-preconnect/?utm_source=lighthouse&utm_medium=devtools -->

>

### Code Splitting: Smaller payloads, reduce JS bundle

<https://create-react-app.dev/docs/analyzing-the-bundle-size/>

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

# Serving build

With the conflict of Ruby's `serve', we use `static-server` to run the build file from the folder '\build`.
<https://www.npmjs.com/package/static-server>

# PWA

Works only in 'build' mode.

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

# Cloudinary

<https://github.com/cloudinary/cloudinary-react>
<https://cloudinary.com/documentation/react_integration>

Run 'react-starter-kit' generated from <https://github.com/kriasoft/react-starter-kit/blob/master/docs/getting-started.md> to get example.

# Misc

## Sync props

<https://learnwithparam.com/blog/how-to-pass-props-to-state-properly-in-react-hooks/>

## Pass props to route component

<https://learnwithparam.com/blog/how-to-pass-props-in-react-router/>
