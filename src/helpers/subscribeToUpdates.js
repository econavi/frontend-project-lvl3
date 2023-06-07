import axios from 'axios';

import parseRss from './parseRss';
import normalizePostsData from './normalizePostsData';

const subscribeToUpdates = (feedId, path, state, errorCallback) => {
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
        subscribeToUpdates(feedId, path, state);
      })
      .catch((error) => {
        console.error(error);
        errorCallback();
      });
  }, 5000);
};

export default subscribeToUpdates;
