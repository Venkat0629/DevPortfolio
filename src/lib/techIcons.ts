// Maps technology names to Devicon CDN SVG URLs
// Source: https://devicon.dev/ (open-source tech icons)

const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

const techIconMap: Record<string, string> = {
  // Languages
  'Java': `${DEVICON_BASE}/java/java-original.svg`,
  'JavaScript': `${DEVICON_BASE}/javascript/javascript-original.svg`,
  'Python': `${DEVICON_BASE}/python/python-original.svg`,
  'HTML': `${DEVICON_BASE}/html5/html5-original.svg`,
  'CSS': `${DEVICON_BASE}/css3/css3-original.svg`,
  'SQL': `${DEVICON_BASE}/mysql/mysql-original.svg`,

  // Frameworks
  'Spring Boot': `${DEVICON_BASE}/spring/spring-original.svg`,
  'Spring Cloud': `${DEVICON_BASE}/spring/spring-original.svg`,
  'React': `${DEVICON_BASE}/react/react-original.svg`,
  'ReactJS': `${DEVICON_BASE}/react/react-original.svg`,
  'React Hooks': `${DEVICON_BASE}/react/react-original.svg`,
  'React Router': `${DEVICON_BASE}/react/react-original.svg`,
  'Angular': `${DEVICON_BASE}/angularjs/angularjs-original.svg`,
  'Redux': `${DEVICON_BASE}/redux/redux-original.svg`,
  'Bootstrap': `${DEVICON_BASE}/bootstrap/bootstrap-original.svg`,
  'Bootstrap Carousel': `${DEVICON_BASE}/bootstrap/bootstrap-original.svg`,

  // DevOps & Cloud
  'Docker': `${DEVICON_BASE}/docker/docker-original.svg`,
  'Kubernetes': `${DEVICON_BASE}/kubernetes/kubernetes-original.svg`,
  'Jenkins': `${DEVICON_BASE}/jenkins/jenkins-original.svg`,
  'AWS': `${DEVICON_BASE}/amazonwebservices/amazonwebservices-plain-wordmark.svg`,
  'Azure': `${DEVICON_BASE}/azure/azure-original.svg`,
  'Ansible': `${DEVICON_BASE}/ansible/ansible-original.svg`,
  'Git': `${DEVICON_BASE}/git/git-original.svg`,
  'Linux': `${DEVICON_BASE}/linux/linux-original.svg`,

  // Databases & Messaging
  'MongoDB': `${DEVICON_BASE}/mongodb/mongodb-original.svg`,
  'Redis': `${DEVICON_BASE}/redis/redis-original.svg`,
  'Apache Kafka': `${DEVICON_BASE}/apachekafka/apachekafka-original.svg`,
  'Kafka': `${DEVICON_BASE}/apachekafka/apachekafka-original.svg`,

  // Alternate naming variants (used in Skills section)
  'HTML5/CSS3': `${DEVICON_BASE}/html5/html5-original.svg`,
  'Material-UI': `${DEVICON_BASE}/materialui/materialui-original.svg`,
  'MySQL': `${DEVICON_BASE}/mysql/mysql-original.svg`,
  'PostgreSQL': `${DEVICON_BASE}/postgresql/postgresql-original.svg`,
  'Oracle': `${DEVICON_BASE}/oracle/oracle-original.svg`,
  'Cassandra': `${DEVICON_BASE}/cassandra/cassandra-original.svg`,
  'AWS (EC2, S3)': `${DEVICON_BASE}/amazonwebservices/amazonwebservices-plain-wordmark.svg`,
  'JIRA': `${DEVICON_BASE}/jira/jira-original.svg`,
  'Git/JIRA': `${DEVICON_BASE}/git/git-original.svg`,
  'JPA/JWT': `${DEVICON_BASE}/java/java-original.svg`,
  'Weather API': `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>')}`,

  // Tools & Platforms
  'OpenStack': `${DEVICON_BASE}/openstack/openstack-original.svg`,

  // Concept icons (inline SVG data URIs)
  'Microservices': `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><line x1="12" y1="7.5" x2="5" y2="16.5"/><line x1="12" y1="7.5" x2="19" y2="16.5"/><line x1="7.5" y1="19" x2="16.5" y2="19"/></svg>')}`,
  'REST APIs': `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h10"/><circle cx="20" cy="18" r="2"/></svg>')}`,
  'API Integration': `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h10"/><circle cx="20" cy="18" r="2"/></svg>')}`,
  'Responsive Design': `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>')}`,
  'Debouncing': `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>')}`,
  'Module-scoped CSS': `${DEVICON_BASE}/css3/css3-original.svg`,
  'Flexbox': `${DEVICON_BASE}/css3/css3-original.svg`,
  'Swiper Library': `${DEVICON_BASE}/javascript/javascript-original.svg`,
};

export function getTechIconUrl(techName: string): string | null {
  const url = techIconMap[techName];
  return url || null;
}
