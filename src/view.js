/* eslint-disable no-unused-expressions */
import onChange from 'on-change';
import differenceBy from 'lodash/differenceBy.js';
import last from 'lodash/last.js';

export default (state, i18n) => {
  const feedback = document.querySelector('.feedback');
  const formControl = document.querySelector('.form-control');
  const addButton = document.getElementById('addButton');
  const spinner = document.getElementById('spinner');
  const submitBtn = document.getElementById('submitBtn');

  const renderPostsContainer = () => {
    const cardPosts = document.createElement('div');
    cardPosts.className = 'card border-0';
    cardPosts.setAttribute('id', 'cardPosts');
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    const postName = document.createElement('h2');
    postName.className = 'card-title m4';
    postName.textContent = i18n.t('posts');
    cardPosts.append(cardBody);
    cardBody.append(postName);
    const postsEl = document.querySelector('.posts');
    postsEl.append(cardPosts);
  };
  const renderPosts = (posts) => {
    const cardPosts = document.getElementById('cardPosts');
    cardPosts ?? renderPostsContainer();
    posts.forEach((post) => {
      const cardsPosts = document.getElementById('cardPosts');
      const ul = document.createElement('ul');
      ul.className = 'list-group border-0 rounded-0';
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';
      const a = document.createElement('a');
      a.className = 'fw-bold';
      a.setAttribute('rel', 'noopener noreferrer');
      a.setAttribute('target', '_blank');
      a.setAttribute('href', `${post.link}`);
      a.setAttribute('id', `${post.id}`);
      a.textContent = `${post.title}`;
      const btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      btn.className = 'btn btn-outline-primary btn-sm';
      btn.setAttribute('id', `${post.id}`);
      btn.setAttribute('data-bs-toggle', 'modal');
      btn.setAttribute('data-bs-target', '#modal');
      btn.textContent = i18n.t('buttons.view');
      li.prepend(a);
      li.append(btn);
      ul.append(li);
      cardsPosts.append(ul);
    });
  };
  const renderFeedsConstainer = () => {
    const cardFeeds = document.createElement('div');
    cardFeeds.setAttribute('id', 'cardFeeds');
    cardFeeds.className = 'card border-0';
    const cardBodyFeed = document.createElement('div');
    cardBodyFeed.className = 'card-body';
    const feedName = document.createElement('h2');
    feedName.className = 'card-title h4';
    feedName.textContent = i18n.t('feeds');
    cardFeeds.append(cardBodyFeed);
    cardBodyFeed.append(feedName);
    const feedsEl = document.querySelector('.feeds');
    feedsEl.append(cardFeeds);
  };
  const renderFeeds = (feeds) => {
    const feedsNode = document.getElementById('cardFeeds');
    feedsNode ?? renderFeedsConstainer();
    feeds.forEach((feed) => {
      const { feedDescription } = feed;
      const { feedTitle } = feed;
      const cardFeeds = document.getElementById('cardFeeds');
      const feedsConstainer = document.querySelector('.feeds');
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
      feedsConstainer.append(cardFeeds);
    });
  };

  function renderError(error) {
    formControl.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.textContent = i18n.t(error);
  }
  const renderSuccessFeedback = () => {
    const form = document.querySelector('.rss-form');
    const inputform = form.elements[0];
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = i18n.t('successDownload');
    inputform.value = '';
    inputform.focus();
  };
  const renderLoadingStatus = () => {
    spinner.classList.replace('visually-hidden', 'visually-visible');
    formControl.setAttribute('disabled', true);
    submitBtn.setAttribute('disabled', true);
    addButton.textContent = i18n.t('buttons.load');
    feedback.textContent = '';
    formControl.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
  };

  const renderFailedStatus = () => {
    addButton.textContent = i18n.t('buttons.add');
    spinner.classList.replace('visually-visible', 'visually-hidden');
    formControl.removeAttribute('disabled');
    submitBtn.removeAttribute('disabled');
  };

  const renderModal = (elemsId, posts) => {
    elemsId.forEach((id) => {
      const post = posts.find((data) => data.id === id);
      const title = document.querySelector('.modal-title');
      title.textContent = post.title;
      const description = document.querySelector('.text-break');
      description.textContent = post.description;
      const linkBtn = document.querySelector('.full-article');
      linkBtn.setAttribute('href', post.link);
      const element = document.querySelector(`[id='${id}']`);
      element.classList.remove('fw-bold');
      element.classList.add('fw-normal');
    });
  };
  const loadStatus = {
    loading: () => renderLoadingStatus(),
    failed: () => renderFailedStatus(),
  };

  const watchedState = onChange(state, (path, value, previousValue) => {
    switch (path) {
      case ('error'): {
        const error = last(value);
        renderError(error);
      }
        break;
      case ('feeds'): {
        const newFeeds = differenceBy(value, previousValue, 'link');
        renderFeeds(newFeeds);
        renderSuccessFeedback();
        break;
      }
      case ('posts'): {
        const newPosts = differenceBy(value, previousValue, 'link');
        renderPosts(newPosts);
        break;
      }
      case ('status'): {
        loadStatus[value]();
        break;
      }
      case ('uiState.modal'):
        renderModal(state.uiState.modal, state.posts);
        break;
      default:
        break;
    }
  });
  return watchedState;
};
