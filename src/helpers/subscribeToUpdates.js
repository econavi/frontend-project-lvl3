import axios from 'axios';

import buildPath from './buildPath';
import parseRss from './parseRss';
import normalizePostsData from './normalizePostsData';

const subscribeToUpdates = (state) => {
  setTimeout(() => {
    const promises = state.catalog.feeds.map((feed) => axios.get(buildPath(feed.path)));

    Promise.all(promises)
      .then((response) => {
        response.forEach((data) => {
          if (!data.data) return;

          const parsedFeedData = parseRss(data);
          const { url } = data.data.status;

          const feedId = state.catalog.feeds.find(
            (feed) => feed.path === url,
          ).id;
          const posts = normalizePostsData(feedId, parsedFeedData.items);

          const loadedFeedPostIds = state.catalog.posts
            .filter((post) => post.feedId === feedId)
            .map((post) => post.id);

          const newPosts = [];

          posts.forEach((post) => {
            if (!loadedFeedPostIds.includes(post.id)) {
              newPosts.push(post);
            }
          });

          state.catalog = {
            ...state.catalog,
            posts: [...newPosts, ...state.catalog.posts],
          };
        });
      })
      .finally(() => {
        subscribeToUpdates(state);
      });
  }, 5000);
};

export default subscribeToUpdates;
