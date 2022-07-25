import 'bootstrap';
import './scss/_custom.scss';
import * as yup from 'yup';
import i18next from 'i18next';
import { setLocale } from 'yup';
import foo from './view.js';
import runI18 from './locales/locales.js';
import parsing from './parsing.js';

const state = {
  urlLinks: [],
  feeds: [],
  posts: [],
  errors: [],
};

const watchedState = foo(state);

const i18nextInstance1 = runI18();

const form = document.querySelector('.rss-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formUrlValue = formData.get('url');
  const formDates = Object.fromEntries(formData);
  setLocale({
    string: {
      url: i18nextInstance1.t('errorURL'),
    },
    mixed: {
      notOneOf: i18nextInstance1.t('errorRepeat'),
    },
  });

  const schema = yup.object().shape({
    url: yup.string().url().notOneOf(state.urlLinks),
  });

  schema.validate(formDates)
    .then(() => {
      watchedState.urlLinks.push(formUrlValue);
    })
    .catch((err) => {
      const [error] = err.errors;
      console.log(error)
      watchedState.errors.push(error);
    });
});
