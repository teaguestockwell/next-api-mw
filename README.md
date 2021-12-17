[![license-shield]][license-url] [![linkedin-shield]][linkedin-url] ![size-url] ![size-url2] [![npm-v]][npm-url] [![gh-shield]][gh-url]

[license-shield]: https://img.shields.io/github/license/teaguestockwell/next-api-mw.svg

[license-url]: https://github.com/teaguestockwell/next-api-mw/blob/master/LICENSE

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?logo=linkedin&colorB=555

[linkedin-url]: https://www.linkedin.com/in/teague-stockwell/

[size-url]: https://img.shields.io/bundlephobia/minzip/next-api-mw

[size-url2]: https://img.shields.io/bundlephobia/min/next-api-mw

[npm-v]: https://img.shields.io/npm/v/next-api-mw

[npm-url]: https://www.npmjs.com/package/next-api-mw

[gh-shield]: https://img.shields.io/badge/-GitHub-black.svg?logo=github&colorB=555

[gh-url]: https://github.com/teaguestockwell/next-api-mw
<!-- PROJECT LOGO -->
<br />
<p align='center'>
  <h3 align='center'>next-api-mw</h3>

  <p align='center'>
    Compose middleware for Next.js API routes like React Hooks
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open='open'>
  <summary><h2 style='display: inline-block'>Table of Contents</h2></summary>
    <li><a href='#about-the-project'>About The Project</a></li>
    <li><a href='#getting-started'>Getting Started</a></li>
    <li><a href='#roadmap'>Roadmap</a></li>
    <li><a href='#contributing'>Contributing</a></li>
    <li><a href='#run-the-tests'>Run The Tests</a></li>
    <li><a href='#license'>License</a></li>
    <li><a href='#contact'>Contact</a></li>
</details>

## About The Project

Consuming API middleware should be as easy as using hooks in React. When using next-api-mw you can abstract common logic like auth or verifying query params into a middleware that can be used inside of an API route.

When calling middleware inside your route, that middleware may either return a promise, or handle the request itself thereby stopping the rest of the handler and or middleware from running.

## Getting Started

```sh
npm i next-api-mw
```

```typescript
import { HandlerFactory, createMiddleware } from 'next-api-mw'

// create one handler factory, then export it so you can create handlers for all your routes
// you may also pass a logger, devLogger, and handleError functions to the constructor
export const handlerFactory = new HandlerFactory()

// middleware can be consumed in as many routes as you want.
// you can even use one middleware inside of another
export const usingFooQS = createMiddleware(async ({req, res, end}) => {
  const { foo } = req.query

  if (!foo || typeof foo !== 'string') {
    res.status(400).json({ msg: 'invalid foo' })
    // the res will be sent and the handler and or the next middleware will not be evaluated
    end()
  }

  return foo as string
})

// default export a handler in any file under page/api 
export default handlerFactory.getHandler(async ({req, res, end}) => {
  // you may consume middleware inside of get handler
  const foo = await usingFooQS({req, res, param})
  res.status(200).json({ foo })
  end()
})
```
## Roadmap

See the [open issues](https://github.com/teaguestockwell/next-api-mw/issues) for a list of proposed features (and known issues).

## Contributing
I'm open to all community contributions! If you'd like to contribute in any way

## Run The Tests
Tests are E2E with Cypress. To get started run these commands: 
```sh
npm i
```
```sh
npm run dev
```
```sh
npm run test
```
## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Teague Stockwell - [LinkedIn](https://www.linkedin.com/in/teague-stockwell)
