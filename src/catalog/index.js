import createFeedItem from './createFeedItem';
import createPostItem from './createPostItem';

const catalog = (data) => {
  const feedsData = Object.values(data.feeds);
  const postsData = Object.values(data.posts);
  const { readedPosts } = data;

  const feedsListContainer = document.querySelector('[data-list="feeds"]');
  const postsListContainer = document.querySelector('[data-list="posts"]');

  feedsListContainer.innerHTML = '';
  postsListContainer.innerHTML = '';

  const feeds = feedsData.map((_data) => createFeedItem(_data));
  const posts = postsData.map((_data) => createPostItem(_data, readedPosts));

  feedsListContainer.append(...feeds);
  postsListContainer.append(...posts);
};

export default catalog;
