const parserDoc = (doc) => {
  const items = Array.from(doc.querySelectorAll('item'));
  const postsData = items.map((item) => {
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    const description = item.querySelector('description').textContent;
    const postData = {
      link,
      title,
      description,
    };
    return postData;
  });
  const feedDescription = doc.querySelector('description').textContent;
  const feedTitle = doc.querySelector('title').textContent;
  const link = doc.querySelector('link').textContent;
  const feed = {
    feedDescription,
    feedTitle,
    link,
  };
  return [postsData, [feed]];
};

class ParseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ParseError';
  }
}
const getXMLDocument = (xmlString, i18next) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new ParseError(i18next.t('errors.ParseError'));
  } else {
    return doc;
  }
};
export default (content, i18n) => {
  const data = getXMLDocument(content, i18n);
  const parseData = parserDoc(data);
  return parseData;
};
