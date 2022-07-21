import axios from 'axios';

const parsingHtml = (datas) => {
  const domparser = new DOMParser();
  const html = domparser.parseFromString(datas, 'text/xml');
  return html;
};
const parsing = (rssLink) => {
  const instance = axios.create();
  instance.defaults.timeout = 2500;
  const result = instance.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${rssLink}`)
    .then((response) => response.data.contents)
    .then((response1) => parsingHtml(response1))
    .then((data) => (data))
    .catch(() => console.log('!!!!'));
  return result;
};

export default parsing;
