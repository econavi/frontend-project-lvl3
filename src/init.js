import App from './app'

const init = () => {
  const root = document.querySelector('#root')
  const app = App(root)

  app.init()
}

export default init
