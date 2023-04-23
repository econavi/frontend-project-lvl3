import { object, string } from 'yup'
import useTranslate from './i18next'

const { t } = useTranslate()

const useForm = (state) => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    submit: document.querySelector('button'),
    feedback: document.querySelector('.feedback')
  }

  const formSchema = object().shape({
    inputValue: string()
      .url(t('urlIncorrect'))
      .notOneOf(
        Object.values(state.catalog.feeds).map(({ link }) => link),
        t('urlExist')
      )
      .required(t('notEmpty'))
  })

  const validateInputValue = (inputValue) => {
    formSchema
      .validate({ inputValue })
      .then(() => {
        state.form.error = ''
      })
      .catch((error) => {
        const [value] = error.errors
        state.form.error = value
      })
  }

  const handleInput = (event) => {
    const value = event.target.value.trim()
    state.form.inputValue = value
    validateInputValue(value)
  }

  const handleFormProcess = (process) => {
    switch (process) {
      case 'filling':
        elements.submit.disabled = false
        break

      case 'sending':
        elements.submit.disabled = true
        elements.feedback.textContent = t('loading')
        elements.feedback.classList.remove('text-danger')
        elements.feedback.classList.add('text-success')
        break

      case 'sent':
        elements.submit.disabled = false
        elements.input.value = ''
        elements.input.focus()
        elements.input.classList.remove('is-invalid')
        elements.feedback.textContent = t('rssUploaded')
        elements.feedback.classList.remove('text-danger')
        elements.feedback.classList.add('text-success')
        break

      default:
    }
  }

  const renderError = (error) => {
    if (!error) return

    elements.input.classList.add('is-invalid')
    elements.feedback.textContent = error
    elements.feedback.classList.remove('text-success')
    elements.feedback.classList.add('text-danger')
  }

  elements.input.addEventListener('input', handleInput)

  return {
    handleFormProcess,
    renderError,
    form: elements.form
  }
}

export default useForm
