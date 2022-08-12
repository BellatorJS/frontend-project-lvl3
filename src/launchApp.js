import * as yup from 'yup';
import { setLocale } from 'yup';
import render from './view.js';
import request from './routing.js';
import parsing from './parsing.js';

export default () => {
  const state = {
    runApp: false,
    urlList: [],
    feeds: [],
    posts: [],
    error: [],
    uiState: {
      modal: [],
    },

  };
  const watchedState = render(state);
  const form = document.querySelector('.rss-form');
  const posts = document.querySelector('.posts');

  setLocale({
    string: {
      url: 'validationError.NotValideUrlError',
    },
    mixed: {
      notOneOf: 'validationError.NotOneOfError',
    },
  });
  const schema = yup.object().shape({
    url: yup.string().notOneOf([state.urlList]).url(),
  });

  const validation = (link) => {
    const { url } = link;
    schema.validate(link)
      .then(() => request(url, watchedState)
        .then((xmlString) => {
          const [rssPosts, feed] = parsing(xmlString, state);
          watchedState.feeds.push(...feed);
          watchedState.posts.push(...rssPosts);
          return watchedState.urlList.push(url);
        }))
      .catch((err) => {
        if (err.name === 'ParseError' || err.name === 'AxiosError') {
          return watchedState.error.push(`errors.${err.name}`);
        }
        return watchedState.error.push(...err.errors);
      });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = Object.fromEntries(formData);
    validation(url);
  });
  posts.addEventListener('click', (e) => {
    const { target } = e;
    const id = target.getAttribute('data-id');
    watchedState.uiState.modal.push(id);
  });
};
