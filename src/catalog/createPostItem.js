const createPostItem = (postData, readedPosts) => {
  const { id, title, link } = postData;
  const isReaded = readedPosts.has(id);

  const li = document.createElement('li');

  li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0');

  const a = document.createElement('a');
  a.setAttribute('href', link);
  a.setAttribute('target', '_blank');
  a.setAttribute('class', isReaded ? 'fw-normal' : 'fw-bold');
  a.dataset.id = id;
  a.textContent = title;

  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('class', 'btn btn-outline-primary btn-sm');
  button.dataset.id = id;
  button.dataset.bsToggle = 'modal';
  button.dataset.bsTarget = '#modal';
  button.textContent = 'Просмотр';

  li.append(a, button);

  return li;
};

export default createPostItem;
