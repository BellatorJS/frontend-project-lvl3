import uniqueId from 'lodash/uniqueId.js';
import differenceBy from 'lodash/differenceBy.js';

const getFeed = (doc, state) => {
  const feedData = [];
  const feedDescription = doc.querySelector('description').textContent;
  const feedTitle = doc.querySelector('title').textContent;
  const feedLink = doc.querySelector('link').textContent;
  const feedId = uniqueId();
  const feedContent = {
    feedDescription,
    feedTitle,
    feedLink,
    feedId,
  };

  feedData.push(feedContent);
  const newFeeds = differenceBy(feedData, state.feeds, 'feedLink');
  return newFeeds;
};
const getPosts = (doc, state) => {
  const postData = Array.from(doc.querySelectorAll('item'));
  const posts = postData.map((post) => {
    const id = uniqueId();
    const title = post.querySelector('title').textContent;
    const link = post.querySelector('link').textContent;
    const description = post.querySelector('description').textContent;
    return {
      'data-id': id,
      url: link,
      title,
      description,
    };
  });
  console.log('Это пошли array посты');
  console.log(posts);
  const newPosts = differenceBy(posts, state.posts, 'url');
  console.log('Это пошли посты');
  console.log(newPosts);
  return newPosts;
};
function ParseError(message) {
  this.message = message;
  this.name = 'ParseError';
}
const getXMLDocument = (xmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new ParseError();
  } else {
    return doc;
  }
};
export default (content, state) => {
  const data = getXMLDocument(content);
  const posts = getPosts(data, state);
  const feed = getFeed(data, state);
  return [posts, feed];
};
