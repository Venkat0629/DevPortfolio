import portfolioData from '@/data/portfolio.json';
import { aiProvider } from './aiProvider';
import type { ChatResponse } from './chatTypes';

interface PortfolioContext {
  query: string;
  intent: string;
  entities: {
    companies: string[];
    technologies: string[];
    projects: string[];
    skills: string[];
  };
}

export class PortfolioAgent {
  private portfolio: any;
  private systemPrompt: string;

  constructor() {
    this.portfolio = portfolioData;
    this.systemPrompt = this.buildSystemPrompt();
  }

  private buildSystemPrompt(): string {
    const personal = this.portfolio.personal || {};
    const experience = this.portfolio.experience || {};
    const skills = this.portfolio.skills || {};
    const projects = this.portfolio.projects || {};
    const certifications = this.portfolio.certifications || {};
    const education = this.portfolio.education || {};

    return `You are "Lumi," Veera's professional portfolio assistant. You must ONLY use the provided portfolio data as your source of truth.

**PORTFOLIO DATA:**
${JSON.stringify({
  personal,
  experience: experience.positions || [],
  skills: skills.categories || [],
  projects: projects.items || [],
  certifications: certifications.items || [],
  education: education.items || []
}, null, 2)}

**RESPONSE GUIDELINES:**
1. Be concise, professional, and accurate (under 120 words unless asked for more)
2. Use only the data provided above - do not invent information
3. For missing info, say: "I don't have that in Veera's portfolio yet"
4. Include relevant navigation suggestions like [[NAV:#experience]]
5. Add action tokens when relevant: [[ACTION:openResume]], [[ACTION:openContactForm]]
6. Focus on skills, experience, projects, certifications, and professional guidance
7. Maintain a helpful, professional tone

**JOB MATCHING PRIORITY:**
When asked about job roles (Full Stack Developer, Software Engineer, etc.), provide direct assessment:
- Start with clear YES/NO/GOOD MATCH assessment
- List relevant skills and experience that match the role
- Include specific project examples
- Provide quantified achievements
- End with next steps for contact

**KEY FACTS TO REMEMBER:**
- Name: Veera Venkata Sai Mane
- Current Role: Consultant at Deloitte
- Total Experience: 4+ years
- Core Skills: Java, Spring Boot, React, AWS, Azure
- Location: Hyderabad, Telangana
- Email: venkatsaimane@gmail.com
- Availability: Open to opportunities`;
  }

  async generateResponse(query: string): Promise<ChatResponse> {
    try {
      // Analyze query intent and extract entities
      const context = this.analyzeQuery(query);
      
      // Generate response using AI (will be replaced with actual API call)
      const response = await this.processQuery(context);
      
      return response;
    } catch (error) {
      console.error('Error generating response:', error);
      return this.getFallbackResponse();
    }
  }

  private analyzeQuery(query: string): PortfolioContext {
    const lowerQuery = query.toLowerCase();
    
    // Extract entities
    const entities = {
      companies: this.extractCompanies(lowerQuery),
      technologies: this.extractTechnologies(lowerQuery),
      projects: this.extractProjects(lowerQuery),
      skills: this.extractSkills(lowerQuery)
    };

    // Determine intent
    const intent = this.determineIntent(lowerQuery);

    return {
      query,
      intent,
      entities
    };
  }

  private extractCompanies(query: string): string[] {
    const companies = ['deloitte', 'nisum', 'infosys', 'dell', 'williams-sonoma'];
    return companies.filter(company => query.includes(company));
  }

  private extractTechnologies(query: string): string[] {
    const technologies = [
      'java', 'javascript', 'typescript', 'react', 'angular', 'vue', 'nodejs',
      'spring boot', 'spring', 'aws', 'azure', 'gcp', 'docker', 'kubernetes',
      'mysql', 'postgresql', 'mongodb', 'redis', 'kafka', 'jenkins', 'git'
    ];
    return technologies.filter(tech => query.includes(tech));
  }

  private extractProjects(query: string): string[] {
    const projects = ['vibecart', 'polycloud', 'qkart', 'qtify', 'qtrip', 'ebook', 'expenses'];
    return projects.filter(project => query.includes(project));
  }

  private extractSkills(query: string): string[] {
    const skills = ['programming', 'frontend', 'backend', 'full-stack', 'cloud', 'devops', 'database'];
    return skills.filter(skill => query.includes(skill));
  }

  private determineIntent(query: string): string {
    if (query.match(/hi|hello|hey|greetings/)) return 'greeting';
    if (query.match(/who is|tell me about|about|bio/)) return 'bio';
    if (query.match(/experience|work|job|career/)) return 'experience';
    if (query.match(/skills|technology|programming|tech/)) return 'skills';
    if (query.match(/projects|portfolio|built|developed/)) return 'projects';
    if (query.match(/education|degree|college|university/)) return 'education';
    if (query.match(/certification|certified|aws|azure/)) return 'certifications';
    if (query.match(/contact|email|phone|reach/)) return 'contact';
    if (query.match(/resume|cv/)) return 'resume';
    return 'general';
  }

  private async processQuery(context: PortfolioContext): Promise<ChatResponse> {
    // Try AI provider first, fallback to rule-based
    try {
      const aiResponse = await this.callAIAPI(context.query);
      return this.parseAIResponse(aiResponse);
    } catch (error) {
      console.log('AI provider failed, using rule-based response');
      const response = this.generateRuleBasedResponse(context);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
      
      return response;
    }
  }

  private generateRuleBasedResponse(context: PortfolioContext): ChatResponse {
    const { intent, entities } = context;
    
    switch (intent) {
      case 'greeting':
        return {
          content: '👋 Hello! I\'m Lumi, Veera\'s portfolio assistant. I can help you learn about his experience, skills, projects, and more. What would you like to know?',
          navActions: ['#about']
        };
      
      case 'bio':
        return this.generateBioResponse();
      
      case 'experience':
        return this.generateExperienceResponse(entities);
      
      case 'skills':
        return this.generateSkillsResponse(entities);
      
      case 'projects':
        return this.generateProjectsResponse(entities);
      
      case 'education':
        return this.generateEducationResponse();
      
      case 'certifications':
        return this.generateCertificationsResponse();
      
      case 'contact':
        return {
          content: '📞 You can reach Veera at:\n• 📧 Email: venkatsaimane@gmail.com\n• 📱 Phone: +91 9963064055\n• 📍 Location: Hyderabad, Telangana\n• 🔓 Availability: Open to opportunities\n\nFeel free to reach out for career opportunities or technical discussions!',
          actions: ['openContactForm'],
          navActions: ['#contact']
        };
      
      case 'resume':
        return {
          content: '📄 Veera\'s resume is available for download. It contains detailed information about his experience, skills, and projects.',
          actions: ['openResume'],
          navActions: ['#experience']
        };
      
      default:
        return this.generateGeneralResponse();
    }
  }

  private generateBioResponse(): ChatResponse {
    const personal = this.portfolio.personal || {};
    return {
      content: `👤 **Veera Venkata Sai Mane** is a **${personal.title || 'Software Developer'}** with 4+ years of experience building scalable enterprise applications across e-commerce, logistics, and cloud infrastructure domains. Currently working as a Consultant at Deloitte, he specializes in Java full-stack development, microservices architecture, and cloud deployments.`,
      navActions: ['#about']
    };
  }

  private generateExperienceResponse(entities: PortfolioContext['entities']): ChatResponse {
    const positions = this.portfolio.experience?.positions || [];
    
    let content = `💼 Veera has **4+ years** of professional experience:\n\n`;
    
    if (entities.companies.length > 0) {
      const filteredPositions = positions.filter(pos => 
        entities.companies.some(company => pos.company.toLowerCase().includes(company))
      );
      if (filteredPositions.length > 0) {
        content += this.formatPositions(filteredPositions);
      } else {
        content += this.formatPositions(positions.slice(0, 3));
      }
    } else {
      content += this.formatPositions(positions.slice(0, 3));
    }
    
    return {
      content,
      navActions: ['#experience']
    };
  }

  private generateSkillsResponse(entities: PortfolioContext['entities']): ChatResponse {
    const skills = this.portfolio.skills?.categories || [];
    
    if (entities.technologies.length > 0) {
      const relevantSkills = skills.flatMap((category: any) => 
        category.skills.filter((skill: any) => 
          entities.technologies.some(tech => 
            skill.name.toLowerCase().includes(tech)
          )
        )
      );
      
      if (relevantSkills.length > 0) {
        const skillList = relevantSkills.map((skill: any) => `• ${skill.name} (${skill.level}%)`).join('\n');
        return {
          content: `🔧 **Relevant Skills:**\n\n${skillList}\n\nVeera maintains expertise across full-stack development, cloud platforms, and enterprise technologies.`,
          navActions: ['#skills']
        };
      }
    }
    
    const topSkills = skills.slice(0, 2).flatMap((category: any) => 
      category.skills.slice(0, 3).map((skill: any) => `• ${skill.name} (${skill.level}%)`)
    ).join('\n');
    
    return {
      content: `🔧 Veera's core technical skills include:\n\n${topSkills}\n\nExpertise spans full-stack development, cloud architecture, and enterprise technologies.`,
      navActions: ['#skills']
    };
  }

  private generateProjectsResponse(entities: PortfolioContext['entities']): ChatResponse {
    const projects = this.portfolio.projects?.items || [];
    
    if (entities.projects.length > 0) {
      const relevantProjects = projects.filter(project => 
        entities.projects.some(p => project.title.toLowerCase().includes(p))
      );
      
      if (relevantProjects.length > 0) {
        const projectList = relevantProjects.slice(0, 3).map((project: any) => 
          `• **${project.title}** - ${project.description}\n  🔧 ${project.technologies?.slice(0, 3).join(', ')}`
        ).join('\n\n');
        
        return {
          content: `🚀 **Relevant Projects:**\n\n${projectList}`,
          navActions: ['#projects']
        };
      }
    }
    
    const featuredProjects = projects.filter((p: any) => p.featured).slice(0, 3);
    const projectList = featuredProjects.map((project: any) => 
      `• **${project.title}** - ${project.description}\n  🔧 ${project.technologies?.slice(0, 3).join(', ')}`
    ).join('\n\n');
    
    return {
      content: `🚀 **Featured Projects:**\n\n${projectList}`,
      navActions: ['#projects']
    };
  }

  private generateEducationResponse(): ChatResponse {
    const education = this.portfolio.education?.items || [];
    const graduation = education.find((edu: any) => edu.type === 'Graduation');
    
    if (graduation) {
      return {
        content: `🎓 **Education:**\n\n• **${graduation.degree}** in ${graduation.field}\n  🏫 ${graduation.institution}\n  📅 ${graduation.startDate} - ${graduation.endDate}\n  📊 ${graduation.grade}`,
        navActions: ['#education']
      };
    }
    
    return {
      content: '🎓 Veera has a Bachelor\'s degree in Mechanical Engineering and has completed professional development programs in Full Stack Development.',
      navActions: ['#education']
    };
  }

  private generateCertificationsResponse(): ChatResponse {
    const certifications = this.portfolio.certifications?.items || [];
    const cloudCerts = certifications.filter(cert => cert.category === 'Cloud').slice(0, 3);
    
    if (cloudCerts.length > 0) {
      const certList = cloudCerts.map((cert: any) => 
        `• **${cert.name}** (${cert.issuer})\n  📅 ${cert.date}`
      ).join('\n\n');
      
      return {
        content: `🏆 **Cloud Certifications:**\n\n${certList}\n\nVeera maintains multiple cloud certifications validating expertise in AWS, Azure, and emerging technologies.`,
        navActions: ['#certifications']
      };
    }
    
    return {
      content: `🏆 Veera holds **${certifications.length}** professional certifications across cloud platforms, development, and emerging technologies.`,
      navActions: ['#certifications']
    };
  }

  private generateGeneralResponse(): ChatResponse {
    return {
      content: '🤔 I can help you learn about Veera\'s experience, skills, projects, education, certifications, or contact information. What would you like to know?',
      navActions: ['#about']
    };
  }

  private getFallbackResponse(): ChatResponse {
    return {
      content: '🤔 I\'m having trouble processing your question right now. I can tell you about Veera\'s experience, skills, projects, and background. What would you like to know?',
      navActions: ['#about']
    };
  }

  private formatPositions(positions: any[]): string {
    return positions.map((pos: any, index: number) => {
      const duration = this.calculateDuration(pos.startDate, pos.endDate);
      const isCurrent = pos.endDate === 'Present';
      const status = isCurrent ? '🔥 Current' : '✅ Previous';
      
      return `${index + 1}. **${pos.position}** ${status}\n   🏢 ${pos.company}\n   📅 ${pos.startDate} - ${pos.endDate}\n   ⏱️ ${duration}`;
    }).join('\n\n');
  }

  private calculateDuration(startDate: string, endDate: string): string {
    if (!startDate) return 'Unknown duration';
    
    const start = new Date(startDate + '-01');
    const end = endDate === 'Present' ? new Date() : new Date(endDate + '-01');
    
    if (isNaN(start.getTime())) return 'Unknown duration';
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                   (end.getMonth() - start.getMonth());
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) return `${remainingMonths} months`;
    if (remainingMonths === 0) return `${years} years`;
    return `${years} years ${remainingMonths} months`;
  }

  private async callAIAPI(query: string): Promise<string> {
    const context = {
      systemPrompt: this.systemPrompt,
      portfolio: this.portfolio
    };
    
    return await aiProvider.generateResponse(query, context);
  }

  private parseAIResponse(aiResponse: string): ChatResponse {
    // Parse AI response for actions and navigation
    const content = aiResponse;
    const actions: string[] = [];
    const navActions: string[] = [];

    // Extract action tokens
    if (content.includes('[[ACTION:openResume]]')) {
      actions.push('openResume');
    }
    if (content.includes('[[ACTION:openContactForm]]')) {
      actions.push('openContactForm');
    }

    // Extract navigation tokens
    const navMatches = content.match(/\[\[NAV:(.*?)\]\]/g);
    if (navMatches) {
      navMatches.forEach(match => {
        const nav = match.replace('[[NAV:', '').replace(']]', '');
        navActions.push(nav);
      });
    }

    // Clean up tokens from content
    const cleanContent = content
      .replace(/\[\[ACTION:.*?\]\]/g, '')
      .replace(/\[\[NAV:.*?\]\]/g, '')
      .trim();

    return {
      content: cleanContent,
      actions: actions.length > 0 ? actions : undefined,
      navActions: navActions.length > 0 ? navActions : undefined
    };
  }
}

export const portfolioAgent = new PortfolioAgent();
