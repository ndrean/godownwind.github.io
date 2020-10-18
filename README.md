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

3. Loadable components

<https://loadable-components.com/docs/getting-started/>

`yarn add @loadable/component``

# Lodash

'lodash' is an available library in CRA. Only needed to include the desired import: `import 'sortBy' from "lodash/sortBy"`.

# Serving build with `static-server`

With the conflict of Ruby's `serve', we use `static-server` to run the build file from the folder '\build`.
<https://www.npmjs.com/package/static-server>

# PWA

Works only in 'build' mode.

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

## Favicon

<https://realfavicongenerator.net/favicon_result?file_id=p1ei367ann14qd3bm1654a6b4v36#.X13MVpMzYWo>

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

# Cloudinary

<https://github.com/cloudinary/cloudinary-react>
<https://cloudinary.com/documentation/react_integration>

Run 'react-starter-kit' generated from <https://github.com/kriasoft/react-starter-kit/blob/master/docs/getting-started.md> to get example.

# Leaflet, React-Leaflet

`yarn add leaflet react-leaflet` and import css and set the width in a css class `.leaflet-container`. We can use the `GEOJSON` component to render it.

# Seeding with Geojson data

Use <http://geojson.io/#map=2/20.0/0.0> and export to get seeds.

# Websocket with ActionCable

<https://medium.com/@robin.raq/a-step-by-step-guide-to-integrating-action-cable-rails-6-0-with-reactjs-f7ea80df4090>

# Misc

## Sync props

<https://learnwithparam.com/blog/how-to-pass-props-to-state-properly-in-react-hooks/>

## Pass props to route component

<https://learnwithparam.com/blog/how-to-pass-props-in-react-router/>

# Login

<https://github.com/deepakaggarwal7/react-social-login>
