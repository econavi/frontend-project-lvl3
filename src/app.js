import axios from 'axios';
import uniqueId from 'lodash/uniqueId';
import { object, string } from 'yup';

import catalog from './catalog';
import useModal from './modal';
import i18nextInitial from './i18next';
import getInitialState from './state';

import buildPath from './helpers/buildPath';
import parseRss from './helpers/parseRss';
import subscribeToUpdates from './helpers/subscribeToUpdates';
import normalizeFeedData from './helpers/normalizeFeedData';
import normalizePostsData from './helpers/normalizePostsData';

const init = () => {
  i18nextInitial.then((t) => {
    const { openModal } = useModal();
    const renderCatalog = (data, onClick) => catalog(data, onClick);

    const handleChangeState = (path, value, state) => {
      if (path === 'catalog') { // catalog.readedPosts
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

    const elements = {
      catalog: document.querySelector('[data-list="posts"]'),
      form: document.querySelector('form'),
      input: document.querySelector('#url-input'),
      submit: document.querySelector('button'),
      feedback: document.querySelector('.feedback'),
    };

    const formSchema = object({
      inputValue: string().url(t('urlIncorrect')).required(t('notEmpty')),
    });

    const validateInputValue = (inputValue) => formSchema.validate({ inputValue })
      .then((data) => {
        const loadedFeeds = Object.values(state.catalog.feeds).map(
          (item) => item.requestUrl,
        );
        const isFeedExist = loadedFeeds.includes(data.inputValue);
        const isRssInvalid = !data.inputValue.endsWith('.rss');

        if (isFeedExist) {
          state.form.error = t('urlExist');
          return;
        }

        if (isRssInvalid) {
          state.form.error = t('rssInvalid');
          return;
        }

        state.form.error = '';
      })
      .catch((error) => {
        const [value] = error.errors;
        state.form.error = value;
      });

    const handleFormProcess = (process) => {
      switch (process) {
        case 'filling':
          elements.submit.disabled = false;
          break;

        case 'sending':
          elements.submit.disabled = true;
          elements.feedback.textContent = t('loading');
          elements.feedback.classList.remove('text-danger');
          elements.feedback.classList.add('text-success');
          break;

        case 'sent':
          elements.submit.disabled = false;
          elements.input.value = '';
          elements.input.focus();
          elements.input.classList.remove('is-invalid');
          elements.feedback.textContent = t('rssUploaded');
          elements.feedback.classList.remove('text-danger');
          elements.feedback.classList.add('text-success');
          break;

        default:
      }
    };

    const renderError = (error) => {
      if (!error) return;

      elements.input.classList.add('is-invalid');
      elements.feedback.textContent = error;
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
    };

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

    elements.form.addEventListener('submit', handleSubmit);
  });
};

export default () => ({ init });
