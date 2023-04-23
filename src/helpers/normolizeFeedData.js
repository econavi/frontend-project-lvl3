const normolizeFeedData = (id, data) => {
  const parser = new DOMParser()
  const feedDoc = parser.parseFromString(data, 'text/xml')
  const feedTitle = feedDoc.querySelector('title')
  const feedDescription = feedDoc.querySelector('description')
  const feedItem = {
    [id]: {
      id,
      title: feedTitle.textContent,
      description: feedDescription.textContent
    }
  }

  return feedItem
}

export default normolizeFeedData
