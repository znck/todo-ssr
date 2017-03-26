const fs = require('fs')
const path = require('path')
const express = require('express')
const favicon = require('serve-favicon')
const resolve = file => path.resolve(__dirname, file)

const serverInfo =
    `express/${require('express/package.json').version} ` +
    `vue-server-renderer/${require('vue-server-renderer/package.json').version}`

const app = express()

const renderer = require('vue-server-renderer').createBundleRenderer(
    resolve('./dist/server.js'),
    {
      template: `
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
  <title>todo</title>
  <link href="/dist/client.css" rel="stylesheet">
</head>
<body>
<!--vue-ssr-outlet-->
<script type="text/javascript" src="/dist/client.js" async defer></script>
</body>
</html>
`,
      cache: require('lru-cache')({
        max: 1000,
        maxAge: 1000 * 60 * 15
      })
    }
)

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache ? 60 * 60 * 24 * 30 : 0
})

app.use(favicon('./public/favicon.ico'))
app.use('/dist', serve('./dist', true))

app.get('*', (req, res) => {
  const s = Date.now()

  res.setHeader("Content-Type", "text/html")
  res.setHeader("Server", serverInfo)

  const errorHandler = err => {
    if (err && err.code === 404) {
      res.status(404).end('404 | Page Not Found')
    } else {
      // Render Error Page or Redirect
      res.status(500).end('500 | Internal Server Error')
      console.error(`error during render : ${req.url}`)
      console.error(err)
    }
  }

  renderer.renderToStream({ url: req.url })
      .on('error', errorHandler)
      .on('end', () => console.log(`whole request: ${Date.now() - s}ms`))
      .pipe(res)
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})