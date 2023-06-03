import axios from 'axios';
import uniqueId from 'lodash/uniqueId';

import renderCatalog from './catalog';
import useForm from './form';
import useModal from './modal';
import useTranslate from './i18next';
import getInitialState from './state';

import buildPath from './helpers/buildPath';
import subscribeToUpdates from './helpers/subscribeToUpdates';
import normolizeFeedData from './helpers/normolizeFeedData';
import normolizePostsData from './helpers/normolizePostsData';

const { t } = useTranslate();
const { openModal } = useModal();

const getClickHandler = (state) => (postId) => {
  const newReadedPosts = new Set(state.catalog.readedPosts);
  newReadedPosts.add(postId);
  state.catalog.readedPosts = newReadedPosts;
  state.modal.openedPost = postId;
};

const handleChangeState = (path, value, state) => {
  if (path === 'catalog') {
    renderCatalog(value, getClickHandler(state));
  }

  if (path === 'modal.openedPost') {
    const postId = value;
    const postData = state.catalog.posts[postId];
    if (postData) openModal(postData);
  }
};

const state = getInitialState(handleChangeState);

const { handleFormProcess, form } = useForm(state);

const handleSubmit = (event) => {
  event.preventDefault();

  handleFormProcess('sending');

  const formError = state.form.error;

  if (formError) {
    handleFormProcess('filling');
    handleFormProcess('error');
    return;
  }

  const { inputValue } = state.form;

  const path = buildPath(inputValue);

  axios
    .get(path)
    .then((rss) => {
      const feedId = uniqueId('feed-');
      const requestUrl = inputValue;
      const feed = normolizeFeedData(feedId, rss.data.contents, requestUrl);
      const posts = normolizePostsData(feedId, rss.data.contents);
      state.catalog = {
        ...state.catalog,
        feeds: { ...state.catalog.feeds, ...feed },
        posts: { ...state.catalog.posts, ...posts },
      };
      handleFormProcess('sent');
      subscribeToUpdates(feedId, path, state);
    })
    .catch((error) => {
      console.error(error);
      state.form.error = t('networkError');
    });
};

const init = () => {
  form.addEventListener('submit', handleSubmit);
};

export default () => ({ init });
