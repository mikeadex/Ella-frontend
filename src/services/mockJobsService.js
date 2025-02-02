// Mock data for jobs
const mockJobs = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  title: `${['Senior', 'Lead', 'Full Stack', 'Frontend', 'Backend'][index % 5]} ${['Developer', 'Engineer', 'Architect', 'Designer'][index % 4]}`,
  company: `${['Tech', 'Software', 'Digital', 'Cloud', 'AI'][index % 5]} Solutions Inc.`,
  company_logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(['Tech', 'Software', 'Digital', 'Cloud', 'AI'][index % 5])}`,
  location: `${['London', 'New York', 'San Francisco', 'Berlin', 'Toronto'][index % 5]}, ${['UK', 'USA', 'USA', 'Germany', 'Canada'][index % 5]}`,
  salary_range: `$${Math.floor(Math.random() * 50 + 100)}k - $${Math.floor(Math.random() * 50 + 150)}k`,
  description: 'We are looking for an experienced developer to join our growing team. The ideal candidate will have strong problem-solving skills and experience with modern development practices.',
  tags: [
    ['React', 'TypeScript', 'Node.js', 'AWS'][index % 4],
    ['JavaScript', 'Python', 'Java', 'Go'][index % 4],
    ['Docker', 'Kubernetes', 'CI/CD', 'DevOps'][index % 4],
    ['REST API', 'GraphQL', 'Microservices', 'Cloud'][index % 4],
  ],
  posted_at: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
}));

export const fetchJobs = async (page = 1, perPage = 25) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedJobs = mockJobs.slice(startIndex, endIndex);

  return {
    results: paginatedJobs,
    count: mockJobs.length,
    page,
    perPage,
    totalPages: Math.ceil(mockJobs.length / perPage),
  };
};
