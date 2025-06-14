const comments = [
  {
    id: 2,
    articleSlug: "What-Should-the-Jazz-do",
    author: 'JohnDoe',
    text: 'This was super duper insightful! This was super duper insightful! This was super duper insightful! This was super duper insightful! This was super duper insightful!',
    timestamp: '2025-06-11T12:00:00Z',
    likes: 2,
    parentId: null,  // This is a top-level comment
  },
  {
    id: 1,
    articleSlug: "What-Should-the-Jazz-do",
    author: 'JaneSmith',
    text: 'Great article!',
    timestamp: '2025-06-11T12:05:00Z',
    likes: 0,
    parentId: null,  // Also top-level
  },
  {
    id: 3,
    articleSlug: "What-Should-the-Jazz-do",
    author: 'AnotherReader',
    text: 'Agreed with Jane! This was super duper insightful! This was super duper insightful! This was super duper insightful! This was super duper insightful! This was super duper insightful!',
    timestamp: '2025-06-11T12:10:00Z',
    likes: 1,
    parentId: 1,  // This must point to Jane's comment (id 1)
  },
  {
    id: 4,
    articleSlug: "What-Should-the-Jazz-do",
    author: 'AnotherReader',
    text: 'DisAgreed with Jane!',
    timestamp: '2025-06-11T12:10:00Z',
    likes: 1,
    parentId: null,
  },
  {
    id: 5,
    articleSlug: "What-Should-the-Jazz-do",
    author: 'AnotherReader',
    text: 'Agreed with Marty Jane!',
    timestamp: '2025-06-11T12:10:00Z',
    likes: 1,
    parentId: 4,  // A reply to the previous one
  }
];

export default comments;
