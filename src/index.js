import 'bootstrap';
import './scss/_custom.scss';
import * as yup from 'yup';
import { setLocale } from 'yup';
import foo from './view.js';
import runI18 from './locales/locales.js';

const state = {
  runApp: false,
  urlLinks: [],
  feeds: [],
  posts: [],
  errors: [],
  uiState: {
    modals: [],
  },

};

const watchedState = foo(state);

const i18nextInstance1 = runI18();

const form = document.querySelector('.rss-form');
const posts = document.querySelector('.posts');

posts.addEventListener('click', (e) => {
  const { target } = e;
  const id = target.getAttribute('data-id');
  watchedState.uiState.modals.push(id);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formUrlValue = formData.get('url');
  const formDates = Object.fromEntries(formData);
  setLocale({
    string: {
      url: i18nextInstance1.t('errorURL'),
      matches: i18nextInstance1.t('errorURL'),
    },
    mixed: {
      notOneOf: i18nextInstance1.t('errorRepeat'),
    },
  });

  const schema = yup.object().shape({
    url: yup.string().matches(/(rss)/).url().notOneOf(state.urlLinks),
  });

  schema.validate(formDates)
    .then(() => {
      watchedState.urlLinks.push(formUrlValue);
    })
    .catch((err) => {
      const [error] = err.errors;
      watchedState.errors.push(i18nextInstance1.t(error));
    });
});
