import axios from 'axios';
import uniqueId from 'lodash/uniqueId';

import catalog from './catalog';
import useForm from './form';
import useModal from './modal';
import useTranslate from './i18next';
import getInitialState from './state';

import buildPath from './helpers/buildPath';
import parseRss from './helpers/parseRss';
import subscribeToUpdates from './helpers/subscribeToUpdates';
import normalizeFeedData from './helpers/normalizeFeedData';
import normalizePostsData from './helpers/normalizePostsData';

const { t } = useTranslate();
const { openModal } = useModal();
const renderCatalog = (data, onClick) => catalog(data, onClick);

const handleChangeState = (path, value, state) => {
  if (path === 'catalog') {
    const handleClick = (postId) => {
      const newReadedPosts = new Set(state.catalog.readedPosts);
      newReadedPosts.add(postId);
      state.catalog.readedPosts = newReadedPosts;
      state.modal.openedPost = postId;
      renderCatalog(value, handleClick);
    };

    renderCatalog(value, handleClick);
  }

  if (path === 'modal.openedPost') {
    const postId = value;
    const postData = state.catalog.posts[postId];
    if (postData) openModal(postData);
  }
};

const state = getInitialState(handleChangeState);

const { handleFormProcess, renderError, form } = useForm(state);

const handleSubmit = (event) => {
  event.preventDefault();
  handleFormProcess('sending');

  const formError = state.form.error;

  if (formError) {
    renderError(formError);
    handleFormProcess('filling');
    return;
  }

  const { inputValue } = state.form;

  const path = buildPath(inputValue);

  axios
    .get(path)
    .then((rss) => {
      const feedId = uniqueId('feed-');
      const requestUrl = inputValue;
      const parsedFeedData = parseRss(rss);

      const feed = normalizeFeedData({
        id: feedId,
        title: parsedFeedData.title,
        description: parsedFeedData.description,
        requestUrl,
      });

      const posts = normalizePostsData(feedId, parsedFeedData.items);

      state.catalog = {
        ...state.catalog,
        feeds: { ...state.catalog.feeds, ...feed },
        posts: { ...state.catalog.posts, ...posts },
      };

      handleFormProcess('sent');

      subscribeToUpdates(feedId, path, state, () => {
        renderError(t('networkError'));
      });
    })
    .catch((error) => {
      console.error(error);
      renderError(t('networkError'));
    });
};

const init = () => {
  form.addEventListener('submit', handleSubmit);
};

export default () => ({ init });
