import * as yup from 'yup';
import { setLocale } from 'yup';
import rendering from './view.js';
// import runI18 from './locales/locales.js';

export default () => {
  const state = {
    runApp: false,
    urlLinks: [],
    feeds: [],
    posts: [],
    errors: [],
    uiState: {
      modal: [],
    },

  };

  const watchedState = rendering(state);

  // const i18nextInstance1 = runI18();

  const form = document.querySelector('.rss-form');
  const posts = document.querySelector('.posts');

  posts.addEventListener('click', (e) => {
    const { target } = e;
    const id = target.getAttribute('data-id');
    watchedState.uiState.modal.push(id);
  });

  setLocale({
  /*  string: {
      url: 'notValideUrlError',
    },*/
    mixed: {
      notOneOf: 'notOneOfError',
    },
  });

  const schema = yup.object().shape({
    url: yup.string().url().notOneOf(state.urlLinks),
  });

  const validation = (datas, url) => {
    console.log(datas, url);
    schema.validate(datas)
      .then(() => {
        watchedState.urlLinks.push(url);
      })
      .catch((err) => {
        const [error] = err.errors;
        console.log(error);
        watchedState.errors.push(error);
      });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formUrlValue = formData.get('url');
    const formDatas = Object.fromEntries(formData);
    console.log(formDatas);
    validation(formDatas, formUrlValue);
  });
};
