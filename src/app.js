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

const {
  handleFormProcess, validateInputValue, renderError, form,
} = useForm(state);

const handleSubmit = (event) => {
  event.preventDefault();
  handleFormProcess('sending');

  const formData = new FormData(event.target);
  const inputValue = formData.get('url');

  const validated = validateInputValue(inputValue);

  validated.then(() => {
    const formError = state.form.error;

    if (formError) {
      renderError(formError);
      handleFormProcess('filling');
      return;
    }

    const path = buildPath(inputValue);
    const feedId = uniqueId('feed-');

    axios
      .get(path)
      .then((rss) => {
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
      })
      .catch((error) => {
        console.error(error);
        renderError(t('networkError'));
      })
      .finally(() => {
        subscribeToUpdates(feedId, path, state);
      });
  });
};

const init = () => {
  form.addEventListener('submit', handleSubmit);
};

export default () => ({ init });
