import { object, string } from 'yup'
import onChange from 'on-change'
import i18next from 'i18next'

i18next.init({
  lng: 'ru',
  resources: {
    ru: {
      translation: {
        urlIncorrect: 'Плохой URL',
        urlExist: 'Есть такой URL',
        rssUploaded: 'RSS успешно загружен',
        loading: 'Загрузка...'
      }
    }
  }
})

const renderError = (elements, errorText) => {
  if (!errorText) return
  elements.input.classList.add('is-invalid')
  elements.feedback.textContent = errorText
  elements.feedback.classList.remove('text-success')
  elements.feedback.classList.add('text-danger')
}

const handleFormProcess = (elements, process) => {
  switch (process) {
    case 'filling':
      elements.submit.disabled = false
      break

    case 'sending':
      elements.submit.disabled = true
      elements.feedback.textContent = i18next.t('loading')
      elements.feedback.classList.remove('text-danger')
      elements.feedback.classList.add('text-success')
      break

    case 'sent':
      elements.submit.disabled = false
      elements.input.value = ''
      elements.input.focus()
      elements.feedback.textContent = i18next.t('rssUploaded')
      elements.feedback.classList.remove('text-danger')
      elements.feedback.classList.add('text-success')
      break

    default:
  }
}

const handleChangeState = (elements) => (path, value, prevValue) => {
  if (path === 'form.process') {
    handleFormProcess(elements, value)
    return
  }
}

const init = () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    submit: document.querySelector('button'),
    feedback: document.querySelector('.feedback')
  }

  const state = onChange(
    {
      form: {
        process: 'filling',
        inputValue: '',
        error: ''
      },
      items: [{ url: 'http://go.com' }]
    },
    handleChangeState(elements)
  )

  const formSchema = object().shape({
    inputValue: string()
      .url(i18next.t('urlIncorrect'))
      .notOneOf(
        state.items.map(({ url }) => url),
        i18next.t('urlExist')
      )
  })

  const validateInputValue = (inputValue) => {
    formSchema
      .validate({ inputValue })
      .then((data) => {
        state.form.error = ''
      })
      .catch((error) => {
        state.form.error = error
      })
  }

  const handleInput = (event) => {
    const { value } = event.target
    state.form.inputValue = value
    validateInputValue(value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    state.form.process = 'sending'

    if (state.form.error) {
      renderError(elements, state.form.error)
      state.form.process = 'filling'
      return
    }

    setTimeout(() => {
      state.form.process = 'sent'
    }, 3000)
  }

  elements.input.addEventListener('input', handleInput)
  elements.form.addEventListener('submit', handleSubmit)

  return true
}

export default () => ({ init })
