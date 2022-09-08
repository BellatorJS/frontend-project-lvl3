import * as yup from 'yup';
import { setLocale } from 'yup';
import uniqueId from 'lodash/uniqueId.js';
import render from './view.js';
import request from './routing.js';
import parsing from './parsing.js';
import runI18 from './locales/locales.js';

export default () => {
  const state = {
    feeds: [],
    status: 'waiting',
    posts: [],
    error: [],
    uiState: {
      modal: [],
    },
  };
  const i18nextInstance = runI18();
  const stateObserver = render(state, i18nextInstance);
  const form = document.querySelector('.rss-form');
  const posts = document.querySelector('.posts');

  const prepareData = (contents) => {
    const newContent = contents.map((content) => {
      const id = uniqueId();
      const dataId = {
        id,
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

  const validation = (url) => {
    const links = state.feeds.map((feed) => feed.link);
    const schema = yup.object().shape({
      url: yup.string().url().notOneOf(links),
    });
    return schema.validate(url);
  };
  const updatePosts = (watcher) => {
    const links = state.feeds.map((feed) => feed.link);
    const promises = links.map((link) => request(link, watcher)
      .then((xmlString) => {
        const [postsContent] = parsing(xmlString);
        const post = prepareData(postsContent);
        watcher.posts.push(...post);
      }));
    Promise.all(promises).finally(() => setTimeout(updatePosts, 5000, stateObserver));
  };
  updatePosts(stateObserver);
  const errorsMapping = {
    AxiosError: (err) => stateObserver.error.push(`errors.${err.name}`),
    ParseError: (err) => stateObserver.error.push(`errors.${err.name}`),
    ValidationError: (err) => stateObserver.error.push(`${(err.errors)}`),
  };
  const getNewFeed = (link) => {
    stateObserver.status = 'loading';
    const { url } = link;
    validation(link)
      .then(() => request(url, stateObserver))
      .then((xmlString) => {
        stateObserver.status = 'loading';
        const [postsContent, feedContent] = parsing(xmlString);
        const preperedFeed = prepareData(feedContent);
        const post = prepareData(postsContent);
        const [feed] = [...preperedFeed];
        feed.link = url;
        stateObserver.posts.push(...post);
        stateObserver.feeds.push(feed);
      })
      .catch((err) => {
        errorsMapping[err.name](err);
      })
      .finally(() => {
        stateObserver.status = 'waiting';
      });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = Object.fromEntries(formData);
    getNewFeed(url);
  });
  posts.addEventListener('click', (e) => {
    const { target } = e;
    const id = target.getAttribute('id');
    stateObserver.uiState.modal.push(id);
  });
};
