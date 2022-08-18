import axios from 'axios';

const setUrl = (rssLink) => {
  const encodingUrl = 'https://allorigins.hexlet.app/get';
  const url = new URL(encodingUrl);
  url.searchParams.set('disableCache', 'true');
  url.searchParams.set('url', rssLink);
  url.toString();
  return url;
};

export default (url, watcher) => {
  const link = setUrl(url);
  return axios.get(link)
    .then((response) => response.data.contents)
    .catch((error) => watcher.error.push(`errors.${error.name}`));
};
