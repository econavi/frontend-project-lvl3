const normalizePostsData = (feedId, items) => {
  const posts = items.map((post) => {
    const postId = `${feedId}-${post.link}`;

    return {
      ...post,
      id: postId,
      feedId,
    };
  });

  return posts;
};

export default normalizePostsData;
