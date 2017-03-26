import { app, router } from './app'

export default (context) => {
  return new Promise((resolve) => {
    router.push(context.url)

    router.onReady(() => resolve(app))
  })
}