const normalizePostsData = (feedId, items) => {
  const posts = items.reduce((acc, post) => {
    const postId = `${feedId}-${Date.parse(post.pubDate)}`;

    return {
      ...acc,
      [postId]: {
        ...post,
        id: postId,
        feedId,
      },
    };
  }, {});

  return posts;
};

export default normalizePostsData;
