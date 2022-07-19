// BEGIN
import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next';
import runI18 from './locales/locales.js';
import parsing from './parsing.js';

const foo = (state) => {
  const feedback = document.querySelector('.feedback');
  const formControl = document.querySelector('.form-control');
  const i18nextInstance1 = runI18();

  const renderErrors = () => {
    const [error] = state.errors;
    formControl.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    feedback.textContent = error;
  };

  const renderLinks = () => {
    const form = document.querySelector('.rss-form');
    const inputform = form.elements[0];
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = i18nextInstance1.t('key');
    inputform.value = '';
    inputform.focus();
  };
  const watchedState = onChange(state, (path, value) => {
    console.log(value);
    switch (path) {
      case 'urlLinks':
        const [value1] = value;
        parsing(value1);
        renderLinks();
        break;
      case 'errors':

        renderErrors();
        break;
      default:
        break;
    }
  });
  return watchedState;
};
export default foo;
