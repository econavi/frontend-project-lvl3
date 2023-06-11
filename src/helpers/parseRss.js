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

  const posts = items.map((post) => {
    const postTitle = post.querySelector('title');
    const postDescription = post.querySelector('description');
    const postLink = post.querySelector('link');
    const pubDate = post.querySelector('pubDate');

    return ({
      title: postTitle.textContent,
      description: postDescription.textContent,
      link: postLink.textContent,
      pubDate: pubDate.textContent,
    });
  });

  return {
    title: title.textContent,
    description: description.textContent,
    items: posts,
  };
};

export default parseRss;
