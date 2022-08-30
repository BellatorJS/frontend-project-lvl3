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
      }));
    Promise.all(promises).then(() => setTimeout(updatePosts, 5000, view));
  };
  const errorsMapping = {
    AxiosError: (err) => view.error.push(`errors.${err.name}`),
    ParseError: (err) => view.error.push(`errors.${err.name}`),
    ValidationError: (err) => view.error.push(`${(err.errors)}`),
  };
  const getNewFeed = (link) => {
    /* const addButton = document.getElementById('addButton');
    const spinner = document.getElementById('spinner');
    const submitBtn = document.getElementById('submitBtn');
    const inp = document.getElementById('url-input');

    spinner.classList.replace('visually-hidden', 'visually-visible');
    inp.setAttribute('disabled', true);
    submitBtn.setAttribute('disabled', true);
    addButton.textContent = i18nextInstance.t('buttons.load'); */
    view.status = 'loading';
    const { url } = link;
    schema.validate(link)
      .then(() => isNotOneOfUrls(state.feeds, url)
        .then(() => request(url, view)
          .then((xmlString) => {
            view.status = 'loading';
            const [, feedContent] = parsing(xmlString, i18nextInstance);
            const preperedFeed = prepareData(feedContent);
            const [feed] = [...preperedFeed];
            feed.link = url;
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
        /* addButton.textContent = i18nextInstance.t('buttons.add');
        spinner.classList.replace('visually-visible', 'visually-hidden');
        inp.removeAttribute('disabled');
        submitBtn.removeAttribute('disabled'); */
      });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
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
