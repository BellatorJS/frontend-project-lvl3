import axios from 'axios';


const parsingHtml = (datas) => {
  const domparser = new DOMParser();
  const html = domparser.parseFromString(datas, 'text/xml');
  return html;
};
function parsing(rssLink) {
  const result = axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(`${rssLink}`)}`)
    .then((response) => response.data.contents)
    .then((response1) => parsingHtml(response1))
    .then((data) => (data))
    .catch(() => console.log('!!!!'));
  return result;
}

export default parsing;
