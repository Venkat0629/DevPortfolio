export interface Meta {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  siteUrl: string;
  ogImage: string;
}

export interface Personal {
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  resumeUrl: string;
  availability: string;
}

export interface Social {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  dribbble?: string;
  medium?: string;
  youtube?: string;
  hackerrank?: string;
  crio?: string;
  [key: string]: string | undefined;
}

export interface HeroCTA {
  text: string;
  link: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface Hero {
  greeting: string;
  headline: string;
  subheadline: string;
  cta: {
    primary: HeroCTA;
    secondary: HeroCTA;
  };
  stats: HeroStat[];
}

export interface About {
  title: string;
  subtitle: string;
  description: string[];
  highlights: string[];
}

export interface Skill {
  name: string;
  level: number;
}

export interface SkillCategory {
  name: string;
  icon: string;
  skills: Skill[];
}

export interface Skills {
  title: string;
  subtitle: string;
  categories: SkillCategory[];
}

export interface Position {
  id: number;
  company: string;
  website?: string;
  logo: string;
  position: string;
  location: string;
  type: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
  technologies: string[];
}

export interface Experience {
  title: string;
  subtitle: string;
  positions: Position[];
}

export interface ProjectLinks {
  live?: string;
  github?: string;
}

export interface ProjectStats {
  [key: string]: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  technologies: string[];
  category: string;
  featured: boolean;
  links: ProjectLinks;
  stats?: ProjectStats;
}

export interface Projects {
  title: string;
  subtitle: string;
  items: Project[];
}

export interface ServiceCapability {
  title: string;
  description: string;
  outcomes: string[];
  engagement: string;
}

export interface Services {
  title: string;
  subtitle: string;
  intro: string;
  offerings: ServiceCapability[];
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  date: string;
  credentialUrl: string;
  logo: string;
  category: string;
}

export interface Certifications {
  title: string;
  subtitle: string;
  items: Certification[];
}

export interface FormField {
  label: string;
  placeholder: string;
  required: boolean;
}

export interface Contact {
  title: string;
  subtitle: string;
  description: string;
  formFields: {
    name: FormField;
    email: FormField;
    subject: FormField;
    message: FormField;
  };
  submitText: string;
  successMessage: string;
  errorMessage: string;
}

export interface Footer {
  copyright: string;
  tagline: string;
}

export interface Theme {
  defaultMode: 'light' | 'dark';
  primaryColor: string;
  accentColor: string;
}

export interface NavItem {
  name: string;
  href: string;
}

export interface EducationItem {
  id: number;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  grade: string;
  type: string;
}

export interface Education {
  title: string;
  subtitle: string;
  items: EducationItem[];
}

export interface PortfolioData {
  meta: Meta;
  personal: Personal;
  social: Social;
  hero: Hero;
  about: About;
  skills: Skills;
  experience: Experience;
  projects: Projects;
  services: Services;
  certifications: Certifications;
  education: Education;
  contact: Contact;
  footer: Footer;
  theme: Theme;
  navigation: NavItem[];
}
