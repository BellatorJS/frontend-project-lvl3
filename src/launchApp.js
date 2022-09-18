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
  const stateObserver = render(state, i18nextInstance);// eslint-disable-line
  const form = document.querySelector('.rss-form');
  const posts = document.querySelector('.posts');

  const preparePosts = (postsContent) => {
    const newPosts = postsContent.map((post) => {
      const id = uniqueId();
      const dataId = {
        id,
      };
      const updatedPosts = { ...post, ...dataId };
      return updatedPosts;
    });
    return newPosts;
  };
  const prepareFeed = (feed) => {
    const id = uniqueId();
    const feedId = {
      id,
    };
    const updatedFeed = { ...feed, ...feedId };
    return updatedFeed;
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
        const { postsData } = parsing(xmlString);
        const post = preparePosts(postsData);
        watcher.posts.push(...post);
      }));
    Promise.all(promises).finally(() => setTimeout(updatePosts, 5000, stateObserver));
  };
  updatePosts(stateObserver);

  const errorsMapping = {
    AxiosError: (err, status) => {
      stateObserver.error.push(`errors.${err.name}`);
      stateObserver.status = status;
    },
    ParseError: (err, status) => {
      stateObserver.error.push(`errors.${err.name}`);
      stateObserver.status = status;
    },
    ValidationError: (err, status) => {
      stateObserver.error.push(`${(err.errors)}`);
      stateObserver.status = status;
    },
  };
  const getNewFeed = (link) => {
    stateObserver.status = 'loading';
    const { url } = link;
    validation(link)
      .then(() => request(url, stateObserver))
      .then((xmlString) => {
        stateObserver.status = 'loading';
        const { postsData, feedData } = parsing(xmlString);
        const feed = prepareFeed(feedData);
        const post = preparePosts(postsData);
        feed.link = url;
        stateObserver.posts.push(...post);
        stateObserver.feeds.push(feed);
      })
      .catch((err) => {
        errorsMapping[err.name](err, 'failed');
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
