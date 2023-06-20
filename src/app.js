import axios from 'axios';
import uniqueId from 'lodash/uniqueId';
import { object, string } from 'yup';

import renderCatalog from './catalog';
import i18nextInit from './i18next';
import getInitialState from './state';

import buildPath from './helpers/buildPath';
import parseRss from './helpers/parseRss';
import subscribeToUpdates from './helpers/subscribeToUpdates';
import normalizePostsData from './helpers/normalizePostsData';

const init = () => {
  const i18nextInitial = i18nextInit();

  i18nextInitial.then((t) => {
    const handleChangeState = (path, value, state, elements) => {
      if (path === 'form.process') {
        switch (value) {
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
      }

      if (path === 'form.error') {
        elements.input.classList.add('is-invalid');
        elements.feedback.textContent = value;
        elements.feedback.classList.remove('text-success');
        elements.feedback.classList.add('text-danger');
      }

      if (path === 'catalog') {
        renderCatalog(value, t);
      }

      if (path === 'modal.openedPost') {
        const postId = value;
        const postData = state.catalog.posts.find((post) => post.id === postId);
        const title = elements.modal.querySelector('.modal-title');
        const description = elements.modal.querySelector('.modal-body');
        const fullArticleLink = elements.modal.querySelector('.full-article');

        title.textContent = postData.title;
        description.textContent = postData.description;
        fullArticleLink.href = postData.link;
      }

      if (path === 'error') {
        if (value) {
          elements.feedback.textContent = t(value);
          elements.feedback.classList.remove('text-success');
          elements.feedback.classList.add('text-danger');
        } else {
          elements.feedback.textContent = '';
          elements.feedback.classList.remove('text-danger');
        }
      }
    };

    const elements = {
      catalog: document.querySelector('[data-list="posts"]'),
      modal: document.body.querySelector('#modal'),
      form: document.querySelector('form'),
      input: document.querySelector('#url-input'),
      submit: document.querySelector('button'),
      feedback: document.querySelector('.feedback'),
    };

    const state = getInitialState(handleChangeState, elements);

    const formSchema = object({
      inputValue: string().url(t('urlIncorrect')).required(t('notEmpty')),
    });

    const handleSubmit = (event) => {
      event.preventDefault();
      state.form.process = 'sending';

      const formData = new FormData(event.target);
      const inputValue = formData.get('url');

      formSchema
        .validate({ inputValue })
        .then((data) => {
          const loadedFeeds = state.catalog.feeds.map((item) => item.path);
          const isFeedExist = loadedFeeds.includes(data.inputValue);
          const isRssInvalid = !data.inputValue.includes('rss');

          if (isFeedExist) {
            state.form.error = t('urlExist');
            return;
          }

          if (isRssInvalid) {
            state.form.error = t('rssInvalid');
            return;
          }

          const path = buildPath(inputValue);
          const feedId = uniqueId('feed-');

          axios
            .get(path)
            .then((rss) => {
              const parsedFeedData = parseRss(rss);

              const feed = {
                id: feedId,
                title: parsedFeedData.title,
                description: parsedFeedData.description,
                path: inputValue,
              };

              const posts = normalizePostsData(feedId, parsedFeedData.items);

              state.catalog = {
                ...state.catalog,
                feeds: [feed, ...state.catalog.feeds],
                posts: [...posts, ...state.catalog.posts],
              };

              state.form.process = 'sent';

              subscribeToUpdates(state);
            })
            .catch(() => {
              state.error = 'networkError';
              state.form.process = 'filling';
            });
        })
        .catch((error) => {
          const [value] = error.errors;
          state.form.error = value;
        });
    };

    const handlePostClick = ({ target }) => {
      const postId = target.dataset.id;

      if (!postId) return;

      state.modal.openedPost = postId;
      state.catalog = {
        ...state.catalog,
        readedPosts: [...state.catalog.readedPosts, postId],
      };
    };

    elements.form.addEventListener('submit', handleSubmit);
    elements.catalog.addEventListener('click', handlePostClick);
  });
};

export default () => ({ init });
