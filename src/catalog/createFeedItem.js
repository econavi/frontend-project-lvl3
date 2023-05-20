function createFeedItem(feedData) {
  const { title, description } = feedData;

  const li = document.createElement('li');
  const h3 = document.createElement('h3');
  const p = document.createElement('p');

  li.setAttribute('class', 'list-group-item border-0 border-end-0');
  h3.setAttribute('class', 'h6 m-0');
  p.setAttribute('class', 'm-0 small text-black-50');

  h3.textContent = title;
  p.textContent = description;

  li.append(h3, p);

  return li;
}

export default createFeedItem;
