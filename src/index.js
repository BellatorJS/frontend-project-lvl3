import 'bootstrap';
import './scss/_custom.scss';
import * as yup from 'yup';
import foo from './view.js';

const state = {
  urlLinks: [],
  errors: [],
};

const watchedState = foo(state);

const form = document.querySelector('.rss-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formUrlValue = formData.get('url');
  const formDates = Object.fromEntries(formData);
  const schema = yup.object().shape({
    url: yup.string().url().notOneOf(state.urlLinks),
  });
  schema.validate(formDates)
    .then(() => {
      watchedState.urlLinks.push(formUrlValue);
      /* const inputform = form.elements[0];
      inputform.value = '';
      inputform.focus(); */
    })
    .catch((err) => {
      const error = err.errors[0].slice(0, 23);
      watchedState.errors.push(error);
    });
  state.errors = [];
});
console.log(state);
