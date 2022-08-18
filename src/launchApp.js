import * as yup from 'yup';
import { setLocale } from 'yup';
import uniqueId from 'lodash/uniqueId.js';
import render from './view.js';
import request from './routing.js';
import parsing from './parsing.js';
import runI18 from './locales/locales.js';

export default () => {
  const state = {
    urlList: [],
    feeds: [],
    posts: [],
    error: [],
    uiState: {
      modal: [],
    },
  };
  const i18nextInstance = runI18();
  const view = render(state, i18nextInstance);
  const form = document.querySelector('.rss-form');
  const posts = document.querySelector('.posts');

  const getElems = (contents) => {
    const newContent = contents.map((content) => {
      const id = uniqueId();
      const dataId = {
        'data-id': id,
      };
      const updatedContent = { ...content, ...dataId };
      return updatedContent;
    });
    return newContent;
  };
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

  const updatePosts = (watcher) => {
    const promises = state.urlList.map((url) => request(url, watcher));
    return Promise.all(promises)
      .then((xmlStrings) => {
        xmlStrings.forEach((xmlString) => {
          const [postsContent] = parsing(xmlString);
          const newPosts = getElems(postsContent);
          return watcher.posts.push(...newPosts);
        });
      });
  };
  const getValidData = (link) => {
    const { url } = link;
    schema.validate(link)
      .then(() => request(url, view)
        .then((xmlString) => {
          const [, feedContent] = parsing(xmlString);
          const feed = getElems(feedContent);
          view.feeds.push(...feed);
          view.urlList.push(url);
          setTimeout(function run() {
            updatePosts(view);
            setTimeout(run, 5000);
          }, 0);
        }))
      .catch((err) => {
        if (err.name === 'ParseError' || err.name === 'AxiosError') {
          return view.error.push(`errors.${err.name}`);
        }
        return view.error.push(...err.errors);
      });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = Object.fromEntries(formData);
    getValidData(url);
  });
  posts.addEventListener('click', (e) => {
    const { target } = e;
    const id = target.getAttribute('data-id');
    view.uiState.modal.push(id);
  });
};
