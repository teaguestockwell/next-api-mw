[![license-shield]][license-url] [![linkedin-shield]][linkedin-url] ![size-url] ![size-url2] [![npm-v]][npm-url] [![gh-shield]][gh-url]

[license-shield]: https://img.shields.io/github/license/tsAppDevelopment/next-api-mw.svg

[license-url]: https://github.com/tsAppDevelopment/next-api-mw/blob/master/LICENSE

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?logo=linkedin&colorB=555

[linkedin-url]: https://www.linkedin.com/in/teague-stockwell/

[size-url]: https://img.shields.io/bundlephobia/minzip/next-api-mw

[size-url2]: https://img.shields.io/bundlephobia/min/next-api-mw

[npm-v]: https://img.shields.io/npm/v/next-api-mw

[npm-url]: https://www.npmjs.com/package/next-api-mw

[gh-shield]: https://img.shields.io/badge/-GitHub-black.svg?logo=github&colorB=555

[gh-url]: https://github.com/tsAppDevelopment/next-api-mw
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

Consuming API middleware should be as easy as using hooks in React. When using next-api-mw you can abstract common logic like auth or verifying query params into a middleware tgat cab ve used inside of an API route.

When calling middleware inside your route, that middleware may either return a promise, or handle the request itself thereby stopping the rest of the handler and or middleware from running.

## Getting Started

```sh
npm i next-api-mw
```

### Validate request methods

```typescript
import { nextApiMw } from 'next-api-mw'

const usingMethods = nextApiMw.create(async (req, res, end, verbs: string[]) => {
    const method = String(req.method).toUpperCase()
    const allowedMethods = verbs.map((v) => v.toUpperCase())

    res.setHeader('access-control-allow-methods', allowedMethods.join(', '))

    // if the method is not allowed,
    // send a 405 and end the request
    if (!allowedMethods.includes(method)) {
      res.status(405).json({ msg: `Method: ${method} not allowed` })
      end()
    }

    return method
  }
)

// when consuming middleware in a route, export the route from middleware's run method
export default nextApiMw.run(async (req, res, end) => {
  // method will always be 'GET' | 'POST'
  // when the method is not allowed, the request will end here
  const method = await usingMethods(req, res, ['GET', 'POST'])
  res.json({ msg: `Method: ${method}` })
  end()
})
```

### Validate request email from JWT using [next-auth](https://www.npmjs.com/package/next-auth)

```typescript
import { getToken } from 'next-auth'
import { nextApiMw } from 'next-api-mw'

const usingEmail = nextApiMw.create(async (req, res, end) => {
  const jwt = getToken({
    req,
    secret: process.env.JWT_SECRET,
  })

  if (!jwt || !jwt.email) {
    res.status(401).json({ msg: 'Unauthorized' })
    end()
  }

  return jwt.email
})

export default nextApiMw.run(async (req, res, end) => {
  const email = await usingEmail(req, res)
  res.status(200).json({ msg: `Hello ${email}` })
  end()
})
```

### Validate request query params using [yup](https://www.npmjs.com/package/yup)

```typescript
import { nextApiMw } from 'next-api-mw'
import * as yup from 'yup'

const schema = yup.object().shape({
  foo: yup.string().required(),
  bar: yup.string().required(),
})

const usingFooBarQuery = nextApiMw.create(async (req, res, end) => {
  try {
    await schema.validate(req.query)
  } catch (e) {
    res.status(400).json({ msg: String(e) })
    end()
  }
  return req.query as { foo: string; bar: string }
})

export default nextApiMw.run(async (req, res, end) => {
  const query = await usingFooBarQuery(req, res)
  res.status(200).json(query)
})
```

### Compose nested middleware

```typescript
import { nextApiMw } from 'next-api-mw'

const usingGet = nextApiMw.create(async (req, res, end) => {
  const method = String(req.method).toUpperCase()

  res.setHeader('access-control-allow-methods', 'GET')

  if (method !== 'GET') {
    res.status(405).json({ msg: `method: ${method} allowed` })
    end()
  }

  return method
})

const usingHelloParam = nextApiMw.create(async (req, res, end) => {
  const { hello } = req.query

  if (!hello || typeof hello !== 'string') {
    res.status(400).send({ msg: 'hello query param required' })
    end()
  }

  res.setHeader('hello', hello)

  return hello as string
})

const usingBodyKey = nextApiMw.create(async (req, res, end) => {
  const { key } = req.body

  if (!key || typeof key !== 'string') {
    res.status(400).send({ msg: 'key body param req' })
    end()
  }

  return key as string
})

const usingNested = nextApiMw.create(async (req, res) => {
  const method = await usingGet(req, res)
  const hello = await usingHelloParam(req, res)
  const key = await usingBodyKey(req, res)

  return { method, hello, key }
})

export default nextApiMw.run(async (req, res, end) => {
  const { hello, key, method } = await usingNested(req, res)

  res.status(200).json({ hello, key, method })
  end()
})
```

### Create your own middleware factory

```typescript
import { NextApiMw } from 'next-api-mw'

const mw = new NextApiMw({
  // you can create many mw factories if you want a different logging behavior for each
  // the name helps you keep track of them in the logs
  // alternatively you can export a single instance of the mw factory
  // and use a switch statement for req.url inside of the loggers
  name: 'mw1',

  // by default, if you dont pass a devLogger it will log:
  // mw-mw1: GET /api/class => 400 ${uncaught error?}
  // for every request during development
  devLogger: async ({ req, res, e, name }) => {},

  // persist requests based on some condition here
  logger: async ({ req, res, e, name }) => {
    console.log(`mw-${name}: ${req.method} ${req.url} => ${res.statusCode}`)

    // uhh oh, the server threw an error. better hang on to that and see what happened
    if (e) {
      console.error(e)
    }
  },

  // if the server throws an error and is unable to complete a request
  // the middleware will use this to complete the request
  onServerError: ({ res, e }) => {
    res.status(500).json({ msg: 'oops!' })
  },
})

const usingFooQS = mw.create(async (req, res, end) => {
  const { foo } = req.query

  if (!foo || typeof foo !== 'string') {
    res.status(400).json({ msg: 'invalid foo' })
    end()
  }

  return foo as string
})

export default mw.run(async (req, res, end) => {
  const foo = await usingFooQS(req, res)
  res.status(200).json({ foo })
  end()
})
```

## Roadmap

See the [open issues](https://github.com/tsappdevelopment/next-api-mw/issues) for a list of proposed features (and known issues).

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
