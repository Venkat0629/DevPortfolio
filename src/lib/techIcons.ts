// Maps technology names to Devicon CDN SVG URLs
// Source: https://devicon.dev/ (open-source tech icons)

const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

const techIconMap: Record<string, string> = {
  // Languages
  'Java': `${DEVICON_BASE}/java/java-original.svg`,
  'JavaScript': `${DEVICON_BASE}/javascript/javascript-original.svg`,
  'Python': `${DEVICON_BASE}/python/python-original.svg`,
  'HTML': `${DEVICON_BASE}/html5/html5-original.svg`,
  'HTML5': `${DEVICON_BASE}/html5/html5-original.svg`,
  'CSS': `${DEVICON_BASE}/css3/css3-original.svg`,
  'CSS3': `${DEVICON_BASE}/css3/css3-original.svg`,
  'SQL': `${DEVICON_BASE}/mysql/mysql-original.svg`,

  // Frameworks
  'Spring Boot': `${DEVICON_BASE}/spring/spring-original.svg`,
  'Spring Security': `${DEVICON_BASE}/spring/spring-original.svg`,
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
  'Oracle': `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><rect x="2.5" y="6" width="19" height="12" rx="6" stroke="#F97316" stroke-width="2.4"/><circle cx="12" cy="12" r="2.2" fill="#F97316"/></svg>')}`,
  'Cassandra': `${DEVICON_BASE}/cassandra/cassandra-original.svg`,
  'AWS (EC2, S3)': `${DEVICON_BASE}/amazonwebservices/amazonwebservices-plain-wordmark.svg`,
  'JIRA': `${DEVICON_BASE}/jira/jira-original.svg`,
  'Git/JIRA': `${DEVICON_BASE}/git/git-original.svg`,
  'JPA/JWT': `${DEVICON_BASE}/java/java-original.svg`,
  'JPA': `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.66 3.13 3 7 3s7-1.34 7-3V5"/><path d="M5 11v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6"/></svg>')}`,
  'JWT': `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="5" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="12" cy="19" r="2"/><path d="M12 7v2M7 12h2M15 12h2M12 15v2"/></svg>')}`,
  'Weather API': `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>')}`,

  // Tools & Platforms
  'OpenStack': `${DEVICON_BASE}/openstack/openstack-original.svg`,
  'CI/CD': `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="5" height="5" rx="1.2"/><rect x="16" y="4" width="5" height="5" rx="1.2"/><rect x="9.5" y="15" width="5" height="5" rx="1.2"/><path d="M8 6.5h8M12 9.5v5.5"/></svg>')}`,
  'ServiceNow': `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="#81B441"/><path d="M8.2 12.2a3.8 3.8 0 0 1 6.46-2.76 2.9 2.9 0 1 1 1.14 5.56H8.8a2.4 2.4 0 0 1-.6-4.8Z" fill="white"/></svg>')}`,

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
