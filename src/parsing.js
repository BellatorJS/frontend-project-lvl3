import axios from 'axios';

const parsing = (rssLink) => {
  const instance = axios.create();
  instance.defaults.timeout = 2500;
  const x = instance.get(rssLink)
    .then((response) => console.log(response.data));

  return x;
};

export default parsing;
