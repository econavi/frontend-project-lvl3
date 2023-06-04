import i18next from 'i18next';

const i18nextInstance = i18next.createInstance();

i18nextInstance.init({
  lng: 'ru',
  resources: {
    ru: {
      translation: {
        urlIncorrect: 'Ссылка должна быть валидным URL',
        urlExist: 'RSS уже существует',
        rssInvalid: 'Ресурс не содержит валидный RSS',
        rssUploaded: 'RSS успешно загружен',
        notEmpty: 'Не должно быть пустым',
        networkError: 'Ошибка сети',
        loading: 'Загрузка...',
      },
    },
  },
});

const useTranslate = () => ({ t: i18nextInstance.t });

export default useTranslate;
