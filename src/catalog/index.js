import createFeedItem from './createFeedItem';
import createPostItem from './createPostItem';

const catalog = (data, t) => {
  const feedsData = data.feeds;
  const postsData = data.posts;
  const { readedPosts } = data;

  const feedsListContainer = document.querySelector('[data-list="feeds"]');
  const postsListContainer = document.querySelector('[data-list="posts"]');

  feedsListContainer.innerHTML = '';
  postsListContainer.innerHTML = '';

  const feeds = feedsData.map((_data) => createFeedItem(_data));
  const posts = postsData.map((_data) => createPostItem(_data, readedPosts, t));

  feedsListContainer.append(...feeds);
  postsListContainer.append(...posts);
};

export default catalog;
