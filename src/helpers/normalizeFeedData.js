const normalizeFeedData = ({
  id, title, description, requestUrl,
}) => {
  const feedItem = {
    [id]: {
      id,
      title,
      description,
      requestUrl,
    },
  };

  return feedItem;
};

export default normalizeFeedData;
