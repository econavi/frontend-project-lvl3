import axios from 'axios';
import normalizePostsData from './normalizePostsData';

const subscribeToUpdates = (feedId, path, state) => {
  setTimeout(() => {
    axios
      .get(path)
      .then((rss) => {
        const posts = normalizePostsData(feedId, rss.data.contents);
        state.catalog = {
          ...state.catalog,
          posts: { ...state.catalog.posts, ...posts },
        };
        subscribeToUpdates(feedId, path, state);
      })
      .catch((error) => {
        console.error('Update fetching has error', error);
      });
  }, 5000);
};

export default subscribeToUpdates;
