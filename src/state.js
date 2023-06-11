import onChange from 'on-change';

const getInitialState = (handler) => {
  const state = onChange(
    {
      form: {
        process: 'filling',
        error: '',
      },
      catalog: {
        feeds: {},
        posts: {},
        readedPosts: new Set(),
      },
      modal: {
        openedPost: null,
      },
    },
    (path, value) => handler(path, value, state),
    {
      isShallow: false,
    },
  );

  return state;
};

export default getInitialState;
