import axios from 'axios';

const parsingHtml = (datas) => {
  const domparser = new DOMParser();
  const html = domparser.parseFromString(datas, 'text/xml');
  return html;
};
const parsing = (rssLink) => {
  const instance = axios.create();
  instance.defaults.timeout = 2500;
  const result = instance.get(rssLink)
    .then((response) => response.data)
    .then((response1) => parsingHtml(response1))
    .then((data) => (data))
    .catch(() => console.log('!!!!'));
  return result;
};

export default parsing;
