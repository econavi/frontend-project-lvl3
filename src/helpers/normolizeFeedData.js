const normolizeFeedData = (id, data, requestUrl) => {
  const parser = new DOMParser()
  const feedDoc = parser.parseFromString(data, 'text/xml')
  const feedTitle = feedDoc.querySelector('title')
  const feedDescription = feedDoc.querySelector('description')
  const feedItem = {
    [id]: {
      id,
      requestUrl,
      title: feedTitle.textContent,
      description: feedDescription.textContent
    }
  }

  return feedItem
}

export default normolizeFeedData
