// BEGIN
import onChange from 'on-change';
import * as yup from 'yup';

const foo = (state) => {
  const formControl = document.querySelector('.form-control');
  // console.log(formControl);
  const renderErrors = () => {
    state.errors.forEach((err) => {
      if (err === 'url must not be one of ') {
        formControl.classList.add('is-invalid');
      }
      if (err === 'url must be a valid URL') {
        formControl.classList.add('is-invalid');
      }
    });
  };
  const renderLinks = () => {
    const form = document.querySelector('.rss-form');
    const inputform = form.elements[0];
    inputform.value = '';
    inputform.focus();
  };
  const watchedState = onChange(state, (path, value) => {
    console.log(value);
    switch (path) {
      case 'urlLinks':
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
