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
  const renderRSS = (promise) => {
    console.log(promise);
    // const feedDescription = promise.querySelector('description').textContent;
    // const feedTitle = promise.querySelector('title').textContent;
    const items = Array.from(promise.querySelectorAll('item'));
    items.map((item) => {
      const title = item.querySelector('title').textContent;
      const link = item.querySelector('link').textContent;
      const description = item.querySelector('description').textContent;
      console.log(link);
      console.log(title);
      console.log(description);
    });
    const cardPosts = document.createElement('div');
    cardPosts.className = 'card border-0';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    const postName = document.createElement('h2');
    postName.className = 'card-title m4';
    postName.textContent = 'Посты';
    cardPosts.append(cardBody);
    cardBody.append(postName);
    const posts = document.querySelector('.posts');
    const ul = document.createElement('ul');
    ul.className = 'list-group border-0 rounded-0';
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-beetwen align-items-start border-0 border-end-0';
    const a = document.createElement('a');
    a.className = 'fw-bold';
    a.setAttribute('data-id', '');
    const btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.className = 'btn btn-outline-primary btn-sm';

    posts.append(cardPosts);
  };
  const watchedState = onChange(state, (path, value) => {
    console.log(value);
    switch (path) {
      case 'urlLinks':
        const [data] = value;
        const x = parsing(data);
        x.then((d) => renderRSS(d));

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
