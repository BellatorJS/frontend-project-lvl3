import i18next from 'i18next';

const runI18 = () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: {
        translation: {
          key: 'RSS успешно загружен',
          errorURL: 'Ссылка должна быть валидным URL',
          errorRepeat: 'RSS уже существует',
          errorParsing: 'Ресурс не содержит валидный RSS',
          errorNetWork: 'Ошибка сети',
          btnAdd: 'Добавить',
          btnView: 'Просмотр',
          posts: 'Посты',
          feeds: 'Фиды',
          display: 'RSS агрегатор',
          readPost: 'Читать полностью',
          closeModal: 'Закрыть',
          example: 'Пример: https://ru.hexlet.io/lessons.rss',
          inputPlaceholder: 'Cсылка RSS',
        },
      },
    },

  })
    .then((t) => { t('key'); });

  // инициализированный экземпляр необходимо передать в приложение
  return i18nextInstance;
};
export default runI18;
