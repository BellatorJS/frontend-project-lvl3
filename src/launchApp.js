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
  const view = render(state, i18nextInstance);
  const form = document.querySelector('.rss-form');
  const posts = document.querySelector('.posts');

  const prepareData = (contents) => {
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
    url: yup.string().url(),
  });
  const isNotOneOfUrls = (feeds, url) => {
    const links = feeds.map((feed) => feed.link);
    const schema1 = yup.mixed().notOneOf(links);
    return schema1.validate(url);
  };
  const updatePosts = (watcher) => {
    const links = state.feeds.map((feed) => feed.link);
    const promises = links.map((link) => request(link, watcher)
      .then((xmlString) => {
        const [postsContent] = parsing(xmlString);
        const post = prepareData(postsContent);
        watcher.posts.push(...post);
      })
      .catch((e) => {
        let delay = 5000;
        if (e.name === 'AxiosError') {
          delay += 10000;
          return setTimeout(updatePosts, delay, view);
        }
      }));
    Promise.all(promises).then(() => setTimeout(updatePosts, 5000, view));
  };
  const errorsMapping = {
    AxiosError: (err) => view.error.push(`errors.${err.name}`),
    ParseError: (err) => view.error.push(`errors.${err.name}`),
    ValidationError: (err) => view.error.push(`${(err.errors)}`),
  };
  const getNewFeed = (link) => {
    view.status = 'loading';
    const { url } = link;
    schema.validate(link)
      .then(() => isNotOneOfUrls(state.feeds, url)
        .then(() => request(url, view)
          .then((xmlString) => {
            view.status = 'loading';
            const [postsContent, feedContent] = parsing(xmlString, i18nextInstance);
            const preperedFeed = prepareData(feedContent);
            const [feed] = [...preperedFeed];
            feed.link = url;
            const post = prepareData(postsContent);
            view.posts.push(...post);
            view.feeds.push(feed);
            updatePosts(view);
          })))
      .catch((err) => {
        errorsMapping[err.name](err);
      })
      .finally(() => {
        console.log('AAAAAAAAAAAAAAAAAAAA');
        view.status = 'waiting';
        console.log(state);
      });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(e);
    console.log(form.elements);
    const formData = new FormData(e.target);
    const url = Object.fromEntries(formData);
    getNewFeed(url);
  });
  posts.addEventListener('click', (e) => {
    const { target } = e;
    const id = target.getAttribute('data-id');
    view.uiState.modal.push(id);
  });
};
