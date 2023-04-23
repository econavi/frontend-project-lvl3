const useModal = () => {
  const { body } = document
  const modal = body.querySelector('#modal')
  const title = modal.querySelector('.modal-title')
  const description = modal.querySelector('.modal-body')
  const fullArticleLink = modal.querySelector('.full-article')
  const closeButtons = modal.querySelectorAll('.close-modal')
  const backdrop = body.querySelector('.modal-backdrop')

  const closeModal = () => {
    title.textContent = ''
    description.textContent = ''
    fullArticleLink.href = '#'

    body.classList.remove('modal-open')
    body.style = ''
    modal.classList.remove('show')
    modal.style = ''
    backdrop.classList.remove('show')
  }

  const openModal = (data) => {
    title.textContent = data.title
    description.textContent = data.description
    fullArticleLink.href = data.link

    closeButtons.forEach((btn) => {
      btn.removeAttribute('disabled')
      btn.addEventListener('click', closeModal)
    })

    body.classList.add('modal-open')
    body.style = 'overflow: hidden; padding-right: 0px;'
    modal.classList.add('show')
    modal.style = 'display: block;'
    backdrop.classList.add('show')
  }

  return { openModal }
}

export default useModal
