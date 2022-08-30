import i18next from 'i18next';

const runI18 = () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: {
        translation: {
          successDownload: 'RSS успешно загружен',
          posts: 'Посты',
          feeds: 'Фиды',
          display: 'RSS агрегатор',
          example: 'Пример: https://ru.hexlet.io/lessons.rss',
          inputPlaceholder: 'Cсылка RSS',
          validationError: {
            NotValideUrlError: 'Ссылка должна быть валидным URL',
            NotOneOfError: 'RSS уже существует',
          },
          errors: {
            ParseError: 'Ресурс не содержит валидный RSS',
            AxiosError: 'Ошибка сети',
          },
          buttons: {
            add: 'Добавить',
            view: 'Просмотр',
            readPost: 'Читать полностью',
            closeModal: 'Закрыть',
            load: 'Загрузка...',
          },
        },
      },
    },

  })
    .then((t) => { t('key'); });
  return i18nextInstance;
};
export default runI18;
