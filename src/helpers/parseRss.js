const parseRss = (rss) => {
  const raw = rss.data.contents;

  const parser = new DOMParser();
  const feedDoc = parser.parseFromString(raw, 'text/xml');
  const error = feedDoc.querySelector('parsererror');

  if (error) {
    throw new Error(error);
  }

  const title = feedDoc.querySelector('title');
  const description = feedDoc.querySelector('description');
  const items = [...feedDoc.querySelectorAll('item')];

  return {
    title: title.textContent,
    description: description.textContent,
    items,
  };
};

export default parseRss;
