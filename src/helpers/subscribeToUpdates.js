import axios from 'axios';

import parseRss from './parseRss';
import normalizePostsData from './normalizePostsData';

const subscribeToUpdates = (feedId, path, state) => {
  setTimeout(() => {
    axios
      .get(path)
      .then((rss) => {
        const parsedFeedData = parseRss(rss);
        const posts = normalizePostsData(feedId, parsedFeedData.items);

        state.catalog = {
          ...state.catalog,
          posts: { ...state.catalog.posts, ...posts },
        };

        state.error = '';
      })
      .catch(() => {
        state.error = 'networkError';
      })
      .finally(() => {
        subscribeToUpdates(feedId, path, state);
      });
  }, 5000);
};

export default subscribeToUpdates;
