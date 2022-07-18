import i18next from 'i18next';

const runI18 = () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru', // Текущий язык
    debug: true,
    resources: {
      ru: {
        translation: {
          key: 'RSS успешно загружен',
          errorURL: 'Ссылка должна быть валидным URL',
          errorRepeat: 'RSS уже существует',
          btnAdd: 'Добавить',
          display: 'RSS агрегатор',
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
