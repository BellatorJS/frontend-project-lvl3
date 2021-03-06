// BEGIN
import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next';
import uniqueId from 'lodash/uniqueId.js';
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

  const renderPosts = (posts) => {
    /* const cardPosts = document.createElement('div');
    cardPosts.className = 'card border-0';
    cardPosts.setAttribute('id', 'cardPosts');
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    const postName = document.createElement('h2');
    postName.className = 'card-title m4';
    postName.textContent = 'Посты';
    cardPosts.append(cardBody);
    cardBody.append(postName);//!!!!!!!!!!!!!!!!!!!!!//
    const postsEl = document.querySelector('.posts');
    postsEl.append(cardPosts); */
    posts.map((post) => {
      const cardPosts = document.getElementById('cardPosts');
      const ul = document.createElement('ul');
      ul.className = 'list-group border-0 rounded-0';
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';
      const a = document.createElement('a');
      a.className = 'fw-bold';
      a.setAttribute('rel', 'noopener noreferrer');
      a.setAttribute('target', '_blank');
      a.setAttribute('href', `${post.href}`);
      a.setAttribute('data-id', `${post['data-id']}`);
      a.textContent = `${post.title}`;
      const btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      btn.className = 'btn btn-outline-primary btn-sm';
      btn.setAttribute('data-id', `${post['data-id']}`);
      btn.setAttribute('data-bs-toggle', 'modal');
      btn.setAttribute('data-bs-target', '#modal');
      btn.textContent = 'Посмотреть';
      li.prepend(a);
      li.append(btn);
      ul.append(li);
      cardPosts.append(ul);
    });
  };
  const renderRSS = (promise) => {
    if (state) { renderLinks(); }
    console.log(promise);
    const feedDescription = promise.querySelector('description').textContent;
    const feedTitle = promise.querySelector('title').textContent;
    console.log(feedTitle, feedDescription);
    const items = Array.from(promise.querySelectorAll('item'));
    const posts = items.map((item) => {
      const id = uniqueId();
      const title = item.querySelector('title').textContent;
      const link = item.querySelector('link').textContent;
      const description = item.querySelector('description').textContent;
      return {
        'data-id': id,
        href: link,
        title,
        description,
      };
    });
    renderPosts(posts);
    const cardFeeds = document.createElement('div');//! !!!!!!!!!!!!!!!!!!!!//
    cardFeeds.className = 'card border-0';
    const cardBodyFeed = document.createElement('div');
    cardBodyFeed.className = 'card-body';
    const feedName = document.createElement('h2');
    feedName.className = 'card-title h4';
    feedName.textContent = 'Фиды';
    cardFeeds.append(cardBodyFeed);
    cardBodyFeed.append(feedName);//! !!!!!!!!!!!!!!!!!!!!!!!//
    const feeds1 = document.querySelector('.feeds');
    const ulFeeds = document.createElement('ul');
    ulFeeds.className = 'list-group border-0 rounded-0';
    const listFeed = document.createElement('li');
    listFeed.className = 'list-group-item border-0 border-end-0';
    const feedChanell = document.createElement('h3');
    feedChanell.className = 'h6 m-0';
    feedChanell.textContent = feedTitle;
    const feedsDescription = document.createElement('p');
    feedsDescription.textContent = feedDescription;
    feedsDescription.className = 'm-0 small text-black-50';
    listFeed.prepend(feedChanell);
    listFeed.append(feedsDescription);
    ulFeeds.append(listFeed);
    cardFeeds.append(ulFeeds);
    const ul = document.createElement('ul');
    ul.className = 'list-group border-0 rounded-0';
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';
    const a = document.createElement('a');
    a.className = 'fw-bold';
    a.setAttribute('data-id', '');
    const btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.className = 'btn btn-outline-primary btn-sm';
    feeds1.append(cardFeeds);
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'urlLinks':
        if (state.urlLinks.length == 1) {
          const cardPosts = document.createElement('div');
          cardPosts.className = 'card border-0';
          cardPosts.setAttribute('id', 'cardPosts');
          const cardBody = document.createElement('div');
          cardBody.className = 'card-body';
          const postName = document.createElement('h2');
          postName.className = 'card-title m4';
          postName.textContent = 'Посты';
          cardPosts.append(cardBody);
          cardBody.append(postName);//! !!!!!!!!!!!!!!!!!!!!//
          const postsEl = document.querySelector('.posts');
          postsEl.append(cardPosts);
        }

        const [data] = value;
        setTimeout(function run() {
          parsing(data).then((d) => renderRSS(d));
          setTimeout(run, 5000);
        }, 0);
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
