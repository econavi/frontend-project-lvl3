const normalizePostsData = (feedId, items) => {
  const posts = items.reduce((acc, post) => {
    const postTitle = post.querySelector('title');
    const postDescription = post.querySelector('description');
    const postLink = post.querySelector('link');
    const pubDate = post.querySelector('pubDate');
    const postId = `${feedId}-${Date.parse(pubDate.textContent)}`;

    return {
      ...acc,
      [postId]: {
        id: postId,
        title: postTitle.textContent,
        description: postDescription.textContent,
        link: postLink.textContent,
        feedId,
      },
    };
  }, {});

  return posts;
};

export default normalizePostsData;
