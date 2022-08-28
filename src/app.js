export default (root) => {
  const init = () => {
    const container = root
    container.innerHTML = '<h1>APP</h1>'
    return true
  }

  return { init }
}
