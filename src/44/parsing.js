import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';

const setUrl = (link) => {
  const encodingUrl = 'https://allorigins.hexlet.app/get';
  const url = new URL(encodingUrl);
  // const x = encodeURIComponent(`${link}`);
  // console.log(x);
  url.searchParams.set('disableCache', 'true');
  url.searchParams.set('url', link);
  return url.toString();
};
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
function parsing(links) {
  const link = setUrl(links);
  console.log(link);
  const result = axios.get(link)
    .then((response) => response.data.contents)
    .then((response1) => parsingHtml(response1))
    .then((data) => getParsingDatas(data))
    .catch((error) => {
      const errorName = error.name;
      if (errorName === 'TypeError') {
        return 'TypeError';
      }
      return 'AxiosError';
    });
  return result;
}

export default parsing;
