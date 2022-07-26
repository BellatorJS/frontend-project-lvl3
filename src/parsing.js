import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';

const getParsingDatas = (promise) => {
  const feedContainer = [];
  const feedDescription = promise.querySelector('description').textContent;
  const feedTitle = promise.querySelector('title').textContent;
  const feedlink = promise.querySelector('link').textContent;
  const feedId = uniqueId();
  const feedContent = {
    feedDescription,
    feedTitle,
    feedlink,
    feedId,
  };
  feedContainer.push(feedContent);
  // if (state) { renderLinks(); }
  const items = Array.from(promise.querySelectorAll('item'));
  const posts = items.map((post) => {
    const id = uniqueId();
    const title = post.querySelector('title').textContent;
    const link = post.querySelector('link').textContent;
    const description = post.querySelector('description').textContent;
    return {
      'data-id': id,
      href: link,
      title,
      description,
    };
  });
  return [feedContainer, posts];
};

const parsingHtml = (datas) => {
  const domparser = new DOMParser();
  const html = domparser.parseFromString(datas, 'text/xml');
  return html;
};
function parsing(rssLink) {
  const result = axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(`${rssLink}`)}`)
    .then((response) => response.data.contents)
    .then((response1) => parsingHtml(response1))
    .then((data) => getParsingDatas(data))
    .catch((error) => console.log(error.name));
  return result;
}

export default parsing;
