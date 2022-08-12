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
  const watcher = render(state);
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
      .then(() => request(url, watcher)
        .then((xmlString) => {
          const [rssPosts, feed] = parsing(xmlString, state);
          watcher.feeds.push(...feed);
          watcher.posts.push(...rssPosts);
          return watcher.urlList.push(url);
        }))
      .catch((err) => {
        if (err.name === 'ParseError' || err.name === 'AxiosError') {
          return watcher.error.push(`errors.${err.name}`);
        }
        return watcher.error.push(...err.errors);
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
    watcher.uiState.modal.push(id);
  });
};
