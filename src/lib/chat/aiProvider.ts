interface AIProvider {
  name: string;
  generateResponse(prompt: string, context: any): Promise<string>;
  isAvailable(): boolean;
}

// Groq (Free tier available)
class GroqProvider implements AIProvider {
  name = 'Groq';
  private apiKey: string;
  private baseURL = 'https://api.groq.com/openai/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async generateResponse(prompt: string, _context: any): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('Groq API key not configured');
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant', // Free model
          messages: [
            {
              role: 'system',
              content: context.systemPrompt || 'You are a helpful assistant.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.';
    } catch (error) {
      console.error('Groq API error:', error);
      throw error;
    }
  }
}

// OpenAI (Free credits available)
class OpenAIProvider implements AIProvider {
  name = 'OpenAI';
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async generateResponse(prompt: string, context: any): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // Cheaper model
          messages: [
            {
              role: 'system',
              content: context.systemPrompt || 'You are a helpful assistant.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }
}

// Anthropic Claude (Free tier available)
class AnthropicProvider implements AIProvider {
  name = 'Anthropic Claude';
  private apiKey: string;
  private baseURL = 'https://api.anthropic.com/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async generateResponse(prompt: string, _context: any): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('Anthropic API key not configured');
    }

    try {
      const response = await fetch(`${this.baseURL}/messages`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307', // Cheaper model
          max_tokens: 500,
          messages: [
            {
              role: 'user',
              content: `${context.systemPrompt || ''}\n\n${prompt}`
            }
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.content[0]?.text || 'I apologize, but I couldn\'t generate a response.';
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw error;
    }
  }
}

// Google Gemini (Free)
class GeminiProvider implements AIProvider {
  name = 'Google Gemini';
  private apiKey: string;
  private baseURL = 'https://generativelanguage.googleapis.com/v1beta';

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async generateResponse(prompt: string, _context: any): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const response = await fetch(`${this.baseURL}/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${context.systemPrompt || ''}\n\n${prompt}`
                }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || 'I apologize, but I couldn\'t generate a response.';
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }
}

// Fallback provider (rule-based)
class FallbackProvider implements AIProvider {
  name = 'Fallback';
  
  isAvailable(): boolean {
    return true; // Always available
  }

  async generateResponse(prompt: string, _context: any): Promise<string> {
    // Enhanced rule-based fallback with comprehensive question coverage
    const lowerPrompt = prompt.toLowerCase();
    
    // Job role matching questions (highest priority)
    if (lowerPrompt.includes('full stack developer') || lowerPrompt.includes('full-stack developer') || lowerPrompt.includes('fullstack developer') || 
        (lowerPrompt.includes('looking for') && lowerPrompt.includes('developer')) ||
        (lowerPrompt.includes('requirements') && lowerPrompt.includes('profile')) ||
        (lowerPrompt.includes('does this profile match') || lowerPrompt.includes('profile matches'))) {
      
      return `**Excellent Match!** Veera's profile aligns perfectly with Full Stack Developer requirements.

## 🎯 **Core Competencies Match**

**Frontend Excellence (85-90% proficiency):**
• ReactJS & Redux for scalable SPAs
• Angular with TypeScript integration
• Modern JavaScript (ES6+) and responsive design
• Component architecture and state management

**Backend Mastery (90-92% proficiency):**
• Java & Spring Boot microservices
• RESTful API design and security
• Performance optimization and caching
• Database integration (SQL/NoSQL)

**DevOps & Cloud (80-85% proficiency):**
• AWS/Azure cloud deployments
• Docker containerization and Kubernetes orchestration
• CI/CD pipelines with Jenkins
• Infrastructure as Code concepts

## 💼 **Relevant Experience**
• **4+ years** progressive full-stack development
• **E-commerce platforms** (VibeCart - 10K+ users)
• **Enterprise systems** (Dell logistics - multi-million dollar impact)
• **End-to-end ownership** from design to deployment

## 🚀 **Proven Impact**
• **60% improvement** in cloud resource efficiency
• **Scalable architectures** handling enterprise traffic
• **Security enhancements** resolving critical vulnerabilities
• **Cross-functional leadership** in distributed teams

## 📞 **Next Steps**
Veera is **actively available** and brings immediate value with enterprise-grade experience. Ready to discuss specific technical requirements and team dynamics.

**Schedule a conversation to explore alignment with your needs.** [[ACTION:openContactForm]] [[NAV:#experience]]`;
    }
    
    // Skills & Tech Stack questions
    if (lowerPrompt.includes('skills') || lowerPrompt.includes('tech stack') || lowerPrompt.includes('frameworks') || 
        lowerPrompt.includes('react') || lowerPrompt.includes('java') || lowerPrompt.includes('spring') ||
        lowerPrompt.includes('frontend') || lowerPrompt.includes('backend') || lowerPrompt.includes('database') ||
        lowerPrompt.includes('cloud') || lowerPrompt.includes('devops') || lowerPrompt.includes('ci/cd') ||
        lowerPrompt.includes('microservices') || lowerPrompt.includes('api') || lowerPrompt.includes('proficiency')) {
      
      return `🔧 **Technical Excellence - Full Stack Mastery:**

## 🎨 **Frontend Architecture (88% proficiency)**
**React Ecosystem:**
• Component-driven architecture with Redux state management
• Performance optimization (lazy loading, code splitting)
• TypeScript integration for type safety
• Responsive design with modern CSS frameworks

**Angular Expertise:**
• Enterprise-grade SPA development
• Dependency injection and RxJS patterns
• Material Design implementation
• Progressive Web App (PWA) development

## ⚙️ **Backend Engineering (92% proficiency)**
**Java & Spring Boot:**
• Microservices architecture with Spring Cloud
• RESTful API design with OpenAPI documentation
• Security implementation (JWT, OAuth2)
• Performance tuning and caching strategies

**System Integration:**
• Event-driven architecture with Kafka messaging
• Database design (SQL/NoSQL) with optimization
• Third-party API integration patterns
• Real-time data processing and analytics

## 🗄️ **Data & Database Engineering (85% proficiency)**
**Relational Databases:**
• MySQL/PostgreSQL with advanced indexing
• Query optimization and performance tuning
• Transaction management and ACID compliance
• Database migration and versioning

**NoSQL & Caching:**
• MongoDB for flexible document storage
• Redis for high-performance caching
• Data modeling and aggregation pipelines
• Distributed caching strategies

## ☁️ **Cloud & DevOps (82% proficiency)**
**Cloud Platforms:**
• AWS (EC2, S3, Lambda, RDS, CloudFormation)
• Azure (App Service, Functions, Cosmos DB)
• Multi-cloud strategy and cost optimization
• Infrastructure as Code (IaC) principles

**DevOps Practices:**
• Docker containerization and orchestration
• Kubernetes for container management
• CI/CD pipelines with Jenkins/GitHub Actions
• Monitoring and observability (ELK stack)

## 🔄 **Integration & Communication**
**API Development:**
• RESTful and GraphQL API design
• API versioning and backward compatibility
• Rate limiting and security implementations
• Comprehensive API documentation

**Message Systems:**
• Kafka for event streaming and microservices
• Real-time communication with WebSockets
• Message queue patterns (RabbitMQ, SQS)
• Event sourcing and CQRS patterns

Veera delivers **production-ready solutions** with enterprise-grade quality, scalability, and maintainability across the full technology stack. [[NAV:#skills]]`;
    }
    
    // Experience & Projects questions
    if (lowerPrompt.includes('experience') || lowerPrompt.includes('projects') || lowerPrompt.includes('work') || 
        lowerPrompt.includes('career') || lowerPrompt.includes('professional') || lowerPrompt.includes('companies') ||
        lowerPrompt.includes('deloitte') || lowerPrompt.includes('nisum') || lowerPrompt.includes('infosys') ||
        lowerPrompt.includes('achievements') || lowerPrompt.includes('impact') || lowerPrompt.includes('metrics') ||
        lowerPrompt.includes('kpi') || lowerPrompt.includes('success') || lowerPrompt.includes('challenges')) {
      
      return `💼 **Enterprise Experience & High-Impact Projects:**

## 🚀 **Career Progression - Strategic Growth**

**🔥 Consultant - Deloitte USI** (Mar 2025 - Present)
*Enterprise Consulting & Digital Transformation*
• **Dell Logistics Platforms** - Multi-million dollar logistics optimization
• **Technical Leadership:** Microservices migration, security remediation
• **Business Impact:** Enhanced vendor workflows, improved reporting systems
• **Tech Stack:** Java, Spring Boot, React, Angular, Jenkins, Docker, AWS

**✅ Software Engineer - Nisum Technologies** (Jun 2024 - Mar 2025)  
*E-commerce Innovation & Scalable Solutions*
• **VibeCart Platform** - Enterprise e-commerce for 10K+ users
• **Williams-Sonoma Integration** - Share Cart & Registry features
• **Technical Achievement:** Scalable microservices with API Gateway
• **Tech Stack:** React, Node.js, MongoDB, Kafka, Docker, Kubernetes

**✅ System Engineer → Senior Contributor - Infosys** (Jan 2022 - Jun 2024)
*Cloud Infrastructure & Platform Engineering*
• **Infosys Polycloud Platform** - Multi-cloud management solution
• **Quantified Impact:** 60% improvement in cloud resource efficiency
• **Scale:** 8+ enterprise integrations, 1000+ daily users
• **Tech Stack:** Java, Spring Boot, AWS, Kubernetes, Jenkins, Terraform

## 🏆 **Signature Projects - Measurable Business Value**

**Dell Logistics Ecosystem** (Current)
*Enterprise logistics management with real-time intelligence*
• **Challenge:** Fragmented logistics systems across multiple vendors
• **Solution:** Unified microservices architecture with feature flags
• **Impact:** Streamlined vendor workflows, enhanced reporting capabilities
• **Scale:** Multi-region deployment, enterprise-grade security

**VibeCart E-Commerce Engine** 
*Scalable shopping platform for high-volume retail*
• **Challenge:** Legacy monolith unable to handle peak traffic
• **Solution:** Microservices with event-driven architecture
• **Impact:** 10K+ concurrent users, 99.9% uptime during peak seasons
• **Innovation:** Real-time inventory, AI-powered recommendations

**Infosys Polycloud Management**
*Multi-cloud orchestration and cost optimization*
• **Challenge:** Uncontrolled cloud spending across 20+ accounts
• **Solution:** Centralized management with automated cost controls
• **Impact:** 60% cost reduction, improved resource utilization
• **Recognition:** Internal innovation award, adopted company-wide

## 📊 **Performance Metrics & Business Outcomes**

**Technical Excellence:**
• **60% improvement** in cloud resource efficiency
• **99.9% uptime** for production systems
• **Sub-second response times** for critical APIs
• **Zero security incidents** in production deployments

**Business Impact:**
• **Multi-million dollar** logistics optimization
• **10K+ user** e-commerce platform scaling
• **Enterprise-grade** security compliance
• **Cross-functional** team leadership and mentorship

**Innovation & Leadership:**
• **13+ projects** delivered across diverse domains
• **Distributed team** collaboration across time zones
• **Technical mentorship** for junior developers
• **Process improvements** adopted organization-wide

Veera combines **technical depth** with **business acumen** to deliver solutions that drive measurable business value and scale enterprise operations. [[NAV:#experience]] [[NAV:#projects]]`;
    }
    
    // Behavioral & Soft Skills questions
    if (lowerPrompt.includes('teamwork') || lowerPrompt.includes('leadership') || lowerPrompt.includes('communication') ||
        lowerPrompt.includes('handle') || lowerPrompt.includes('approach') || lowerPrompt.includes('mentored') ||
        lowerPrompt.includes('describe you') || lowerPrompt.includes('stay up to date') || lowerPrompt.includes('problems')) {
      
      return `🤝 **Leadership & Professional Excellence:**

## 👥 **Collaborative Leadership & Team Dynamics**

**Cross-Functional Partnership:**
• **Strategic Collaboration** with Product, Design, and QA teams
• **Distributed Team Leadership** across multiple time zones (US, India, Europe)
• **Technical Mentorship** - Guided 5+ junior developers to senior roles
• **Knowledge Sharing** - Conducted 10+ technical workshops and code reviews

**Communication Excellence:**
• **Technical Documentation** - Comprehensive API specs and architecture diagrams
• **Stakeholder Presentations** - Executive-level technical strategy briefings
• **Complex Concept Translation** - Making technical concepts accessible to non-technical stakeholders
• **Active Listening** - Deep understanding of business requirements and user needs

## 🎯 **Problem-Solving Methodology**

**Analytical Approach:**
• **Root Cause Analysis** - Systematic debugging and issue resolution
• **Data-Driven Decisions** - Metrics-based problem identification and solution validation
• **Systems Thinking** - Holistic view of interconnected components and dependencies
• **Risk Assessment** - Proactive identification and mitigation of potential issues

**Innovation & Adaptability:**
• **Creative Solutions** - Out-of-the-box thinking for complex technical challenges
• **Technology Evaluation** - Systematic assessment of new tools and frameworks
• **Process Optimization** - Continuous improvement of development workflows
• **Change Management** - Smooth transitions during technology migrations

## 📚 **Continuous Learning & Growth Mindset**

**Professional Development:**
• **10+ Certifications** across cloud platforms and development technologies
• **Industry Engagement** - Active participation in tech conferences and meetups
• **Knowledge Communities** - Contributor to open-source projects and technical blogs
• **Mentorship Programs** - Both as mentor and mentee in professional development initiatives

**Technical Curiosity:**
• **Emerging Technologies** - Regular exploration of AI/ML, blockchain, and edge computing
• **Best Practices** - Staying current with industry standards and design patterns
• **Tool Mastery** - Deep expertise in development tools and productivity enhancers
• **Architecture Evolution** - Understanding and applying modern architectural patterns

## 🌟 **Core Professional Attributes**

**Leadership Qualities:**
• **Situational Leadership** - Adapting management style to team and project needs
• **Accountability Ownership** - Taking responsibility for outcomes and learning from failures
• **Strategic Vision** - Balancing immediate needs with long-term technical goals
• **Empowerment Focus** - Enabling team members to take ownership and grow

**Work Ethic & Values:**
• **Quality-First Mindset** - Commitment to excellence in code and architecture
• **Detail-Oriented Precision** - Meticulous attention to technical and business requirements
• **Proactive Initiative** - Identifying and addressing issues before they become problems
• **Results-Driven Focus** - Delivering measurable business impact and user value

Veera embodies the **ideal blend of technical expertise and emotional intelligence**, fostering high-performing teams while delivering exceptional technical solutions. [[NAV:#about]]`;
    }
    
    // Education & Certifications questions
    if (lowerPrompt.includes('education') || lowerPrompt.includes('degree') || lowerPrompt.includes('college') ||
        lowerPrompt.includes('university') || lowerPrompt.includes('certification') || lowerPrompt.includes('certified') ||
        lowerPrompt.includes('aws') || lowerPrompt.includes('azure') || lowerPrompt.includes('b.tech') ||
        lowerPrompt.includes('learning') || lowerPrompt.includes('thesis') || lowerPrompt.includes('capstone')) {
      
      return `🎓 **Academic Excellence & Continuous Professional Development:**

## 🏫 **Educational Foundation**

**Bachelor of Technology - Mechanical Engineering**
📍 **Vignan's Lara Institute of Technology & Science** (Autonomous)
📅 **2017 - 2021** | 📊 **CGPA: 8.2/10** | 🎓 **First Division**

**Academic Achievement:**
• **Engineering Fundamentals** - Strong foundation in mathematics, physics, and applied mechanics
• **Problem-Solving Skills** - Analytical thinking and systematic approach to complex challenges
• **Project-Based Learning** - Multiple engineering projects with practical applications
• **Technical Communication** - Effective documentation and presentation skills

## 🎓 **Professional Development & Specialized Training**

**Full Stack Development Program**
📍 **Crio.Do - Silicon Valley-Style Developer Training**
📅 **2023 - 2024** | 📊 **Verified Graduate** | 🏆 **Top 20% Performer**

**Program Highlights:**
• **Hands-On Project Experience** - 5+ production-level projects
• **Industry Mentorship** - Guidance from senior engineers at top tech companies
• **Modern Tech Stack** - React, Node.js, AWS, Docker, Kubernetes
• **Agile Methodologies** - Scrum, Kanban, and DevOps practices
• **Code Review Excellence** - Professional-grade code quality standards

## 🏆 **Professional Certifications - Cloud & Development Expertise**

### **Cloud Computing Certifications**
**AWS Certified Cloud Practitioner** (2024)
• **Cloud Concepts** - Fundamental understanding of AWS services
• **Security & Compliance** - Best practices for cloud security
• **Pricing & Support** - Cost optimization and support models

**Microsoft Azure Fundamentals** (2024)
• **Cloud Services** - Core Azure services and solutions
• **Security, Privacy, Compliance** - Azure security fundamentals
• **Pricing & Support** - Azure pricing and SLA concepts

**Oracle Cloud Infrastructure 2025 AI Foundations Associate** (2025)
• **AI/ML Concepts** - Foundation in artificial intelligence and machine learning
• **OCI Services** - Oracle Cloud Infrastructure for AI workloads
• **Responsible AI** - Ethical AI implementation principles

### **Development & Technical Certifications**
**Software Engineer - HackerRank** (2024)
• **Problem-Solving** - Algorithmic thinking and code optimization
• **Data Structures** - Advanced understanding of computer science fundamentals
• **System Design** - Scalable system architecture principles

**REST API (Intermediate) - HackerRank** (2024)
• **API Design** - RESTful architecture and best practices
• **Security** - Authentication, authorization, and data protection
• **Performance** - Optimization and caching strategies

**Java (Basic) - HackerRank** (2024)
• **Core Java** - Object-oriented programming and design patterns
• **Data Structures** - Collections, streams, and functional programming
• **Exception Handling** - Robust error management and logging

**JavaScript (Basic) - HackerRank** (2024)
• **Modern JavaScript** - ES6+ features and asynchronous programming
• **DOM Manipulation** - Dynamic web development techniques
• **Event Handling** - Interactive user interface development

## 🌟 **Community Recognition & Industry Engagement**

**Professional Recognition:**
• **Impact Day 2025** - Deloitte Community Service Award
• **Technical Blog Contributor** - Published articles on cloud architecture
• **Open Source Contributor** - Active participation in GitHub projects
• **Tech Community Speaker** - Presented at local meetups and conferences

## 📚 **Continuous Learning Strategy**

**Knowledge Acquisition:**
• **Industry Publications** - Regular reading of tech blogs and research papers
• **Online Learning Platforms** - Coursera, Udemy, Pluralsight subscriptions
• **Technical Conferences** - AWS Summit, Microsoft Build, Google I/O attendance
• **Peer Learning** - Active participation in technical communities and forums

**Skill Development:**
• **Hands-On Projects** - Continuous development of personal and professional projects
• **Code Review Participation** - Regular contribution to open-source projects
• **Mentorship Programs** - Both mentoring and being mentored by senior engineers
• **Technology Experimentation** - Early adoption of emerging technologies

Veera demonstrates **exceptional commitment to continuous learning**, combining strong academic fundamentals with cutting-edge industry certifications and practical experience. [[NAV:#education]] [[NAV:#certifications]]`;
    }
    
    // Role Fit & Match Score questions
    if (lowerPrompt.includes('fit') || lowerPrompt.includes('role') || lowerPrompt.includes('position') ||
        lowerPrompt.includes('readiness') || lowerPrompt.includes('gaps') || lowerPrompt.includes('plan') ||
        lowerPrompt.includes('map') || lowerPrompt.includes('outcomes') || lowerPrompt.includes('engineer') ||
        lowerPrompt.includes('architect') || lowerPrompt.includes('lead') || lowerPrompt.includes('manager')) {
      
      return `🎯 **Role Fit Assessment & Career Readiness:**

## 💼 **Current Role Alignment**
**Consultant at Deloitte** - Perfect fit for:
• **Solution Architect** roles (technical leadership)
• **Full Stack Developer** positions (end-to-end development)
• **Platform Engineer** opportunities (cloud infrastructure)
• **Technical Lead** positions (team guidance)

## 📊 **Readiness Assessment (0-100 scale)**

**Full Stack Developer: 95%** ✅
• Frontend: React, Angular, JavaScript, TypeScript
• Backend: Java, Spring Boot, REST APIs
• Database: MySQL, PostgreSQL, MongoDB
• Cloud: AWS, Azure, Docker, Kubernetes

**Solution Architect: 85%** ✅
• System design and architecture patterns
• Cloud infrastructure expertise
• Cross-functional stakeholder management
• Technical decision-making experience

**Platform Engineer: 80%** ✅
• DevOps and CI/CD pipelines
• Container orchestration (Kubernetes)
• Infrastructure as Code concepts
• Monitoring and observability

## 🎯 **30-60-90 Day Plan Framework**

**First 30 Days:**
• Understand existing systems and team dynamics
• Identify quick wins and improvement opportunities
• Establish relationships with key stakeholders

**60 Days:**
• Lead small to medium-sized initiatives
• Implement process improvements
• Mentor team members on best practices

**90 Days:**
• Drive architectural decisions
• Lead cross-functional projects
• Establish technical standards

## 📈 **Growth Areas**
• **Advanced cloud architecture** patterns
• **Machine learning** integration
• **Large-scale system** design
• **Team leadership** at scale

Veera demonstrates strong readiness for senior technical roles with clear growth potential and proven delivery capabilities. [[NAV:#experience]] [[NAV:#skills]]`;
    }
    
    // Compensation & Negotiation questions
    if (lowerPrompt.includes('salary') || lowerPrompt.includes('compensation') || lowerPrompt.includes('offer') ||
        lowerPrompt.includes('negotiation') || lowerPrompt.includes('minimum') || lowerPrompt.includes('evaluate') ||
        lowerPrompt.includes('package') || lowerPrompt.includes('ctc')) {
      
      return `💰 **Compensation Philosophy & Negotiation:**

## 🎯 **Compensation Approach**
Veera evaluates compensation holistically, considering:

**💵 Base Salary**
• Market-aligned with 4+ years experience
• Reflects full-stack expertise and cloud skills
• Competitive for consultant-level roles

**🎁 Additional Benefits**
• Performance bonuses and incentives
• Stock options or equity (if applicable)
• Health and insurance benefits
• Professional development budget
• Flexible work arrangements

**📈 Growth Opportunities**
• Career progression pathways
• Skill development programs
• Leadership opportunities
• Learning and certification support

## 💼 **Market Positioning**
With **4+ years of experience** at top companies (Deloitte, Nisum, Infosys) and expertise in high-demand technologies (Java, Spring Boot, React, AWS, Azure), Veera is positioned for **senior developer/consultant level compensation**.

## 🤝 **Negotiation Philosophy**
• **Data-driven** approach using market research
• **Value-focused** on skills and impact delivered
• **Collaborative** negotiation for win-win outcomes
• **Long-term perspective** on career growth

**For specific compensation discussions, Veera is open to transparent conversations about expectations and market alignment.** [[ACTION:openContactForm]] [[NAV:#contact]]`;
    }
    
    // Career Gaps questions
    if (lowerPrompt.includes('gap') || lowerPrompt.includes('break') || lowerPrompt.includes('transition') ||
        lowerPrompt.includes('personal projects') || lowerPrompt.includes('narrative') || lowerPrompt.includes('story')) {
      
      return `📈 **Career Journey & Continuous Growth:**

## 🚀 **Career Progression Overview**
Veera's career shows **consistent upward trajectory** with no significant gaps:

**2021-2022:** **System Engineer** at Infosys
• Started career in enterprise software development
• Built foundation in Java and cloud technologies

**2022-2024:** **System Engineer → Senior Contributor** at Infosys  
• **Polycloud Platform** development
• **60% improvement** in cloud resource management
• Progressive responsibility and technical growth

**2024-2025:** **Software Engineer** at Nisum
• **E-commerce expertise** development
• **Full-stack responsibilities**
• Cross-functional project leadership

**2025-Present:** **Consultant** at Deloitte
• **Enterprise consulting** experience
• **Technical architecture** responsibilities
• **Client-facing** solution delivery

## 📚 **Continuous Development**
• **No career gaps** - consistent employment since 2022
• **Skill progression** from junior to consultant level
• **Technology evolution** from basic to advanced skills
• **Industry diversification** across multiple domains

## 🎯 **Personal Projects & Learning**
• **QTify Audio Streaming** - Skill-up project
• **Full Stack Development Program** - Professional certification
• **10+ certifications** in cloud and development
• **Active community** participation and knowledge sharing

Veera's career demonstrates **continuous growth** with no employment gaps, progressive responsibility, and consistent skill development. [[NAV:#experience]] [[NAV:#education]]`;
    }
    
    // System Design & Architecture questions
    if (lowerPrompt.includes('system design') || lowerPrompt.includes('architecture') || lowerPrompt.includes('scalability') ||
        lowerPrompt.includes('design') || lowerPrompt.includes('patterns') || lowerPrompt.includes('distributed') ||
        lowerPrompt.includes('microservices') || lowerPrompt.includes('idempotency') || lowerPrompt.includes('backpressure')) {
      
      return `🏗️ **System Design & Architecture Expertise:**

## 🎯 **Architecture Experience**

**Microservices Architecture**
• **Service decomposition** based on business domains
• **API Gateway** patterns for service aggregation
• **Service discovery** and load balancing
• **Distributed tracing** and monitoring

**Scalability Patterns**
• **Horizontal scaling** with container orchestration
• **Caching strategies** (Redis, CDN)
• **Database sharding** and replication
• **Load balancing** across multiple instances

**System Design Principles**
• **SOLID principles** for maintainable code
• **Domain-driven design** for business alignment
• **Event-driven architecture** with Kafka
• **API-first design** for integration

## 🔧 **Technical Implementation**

**Distributed Systems**
• **Idempotency** handling in distributed workflows
• **Circuit breakers** for fault tolerance
• **Retry mechanisms** with exponential backoff
• **Dead letter queues** for failed messages

**Performance Optimization**
• **Database indexing** and query optimization
• **Connection pooling** and resource management
• **Asynchronous processing** for non-blocking operations
• **Caching layers** for reduced latency

**Security Architecture**
• **Authentication/Authorization** patterns
• **API security** with JWT tokens
• **Data encryption** in transit and at rest
• **Security vulnerability** assessment and remediation

## 📊 **Real-World Applications**
• **Dell Logistics Portals** - Enterprise microservices
• **VibeCart E-Commerce** - Scalable platform design
• **Infosys Polycloud** - Multi-cloud management system

Veera has hands-on experience designing and implementing scalable, maintainable systems for enterprise applications. [[NAV:#projects]] [[NAV:#skills]]`;
    }
    
    // Greeting patterns
    if (lowerPrompt.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)) {
      return `👋 Hello! I'm Lumi, Veera's professional portfolio assistant. I can provide detailed information about his 4+ years of experience, technical skills, projects, education, and certifications. What would you like to explore?`;
    }
    
    // Who is Veera / Bio questions
    if (lowerPrompt.includes('who is') || lowerPrompt.includes('tell me about') || lowerPrompt.includes('about veera') || lowerPrompt.includes('what is his name') || lowerPrompt.includes('overview')) {
      return `👤 **Veera Venkata Sai Mane** - Full Stack Developer & Consultant

**🎯 Professional Summary:**
Software Developer with **4+ years** of experience building scalable enterprise applications across e-commerce, logistics, and cloud infrastructure domains. Currently working as a **Consultant at Deloitte**, specializing in Java full-stack development, microservices architecture, and cloud deployments.

**💼 Current Role:** Consultant at Deloitte (March 2025 - Present)
**📍 Location:** Hyderabad, Telangana  
**🔓 Availability:** Open to opportunities
**📧 Contact:** venkatsaimane@gmail.com

**🔧 Core Expertise:**
• **Full Stack Development:** Java, Spring Boot, React, Angular
• **Cloud Platforms:** AWS (82%), Azure (80%), Docker, Kubernetes  
• **Databases:** MySQL, PostgreSQL, MongoDB, Redis
• **DevOps:** Jenkins, CI/CD, microservices architecture

**🚀 Key Achievements:**
• 60% improvement in cloud resource management at Infosys
• Scalable e-commerce platform development at Nisum
• Enterprise logistics solutions at Deloitte
• 10+ professional certifications across cloud and development

Veera combines technical depth with business acumen to deliver high-impact solutions for enterprise clients. [[NAV:#about]]`;
    }
    
    // Contact questions
    if (lowerPrompt.includes('contact') || lowerPrompt.includes('email') || lowerPrompt.includes('phone') || lowerPrompt.includes('reach') || lowerPrompt.includes('connect') || lowerPrompt.includes('available')) {
      return `📞 **Professional Contact Information:**

**Direct Contact:**
• 📧 **Email:** venkatsaimane@gmail.com
• 📱 **Phone:** +91 9963064055
• 📍 **Location:** Hyderabad, Telangana
• 🔓 **Availability:** Open to opportunities

**Professional Networks:**
• 💼 **LinkedIn:** https://www.linkedin.com/in/veera-venkata-sai-mane/
• 💻 **GitHub:** https://github.com/Venkat0629
• 🐦 **Twitter:** https://twitter.com/venkat0629
• 🏆 **HackerRank:** https://www.hackerrank.com/profile/venkatsaimane

**Response Time:** Typically within 24-48 hours for professional inquiries

**Best Contact Method:** Email for initial professional discussions and opportunities

Veera is actively exploring new opportunities and welcomes connections for technical discussions, career opportunities, or collaborations. [[ACTION:openContactForm]] [[NAV:#contact]]`;
    }
    
    // Resume questions
    if (lowerPrompt.includes('resume') || lowerPrompt.includes('cv') || lowerPrompt.includes('download resume') || lowerPrompt.includes('summary')) {
      return `📄 **Professional Resume Available**

**Resume Highlights:**
• **4+ years** progressive experience at top companies
• **Full-stack expertise** with measurable achievements
• **Enterprise project portfolio** with business impact
• **10+ certifications** across cloud and development
• **Education background** in engineering

**Key Sections:**
• Professional Experience (Deloitte, Nisum, Infosys)
• Technical Skills & Proficiency Levels
• Project Portfolio with Quantified Results
• Education & Professional Development
• Certifications & Community Recognition

**Download Options:**
• PDF format for easy sharing
• ATS-optimized for recruiter systems
• Detailed technical achievements

**Perfect for:** Job applications, technical interviews, professional networking

The resume showcases Veera's journey from System Engineer to Consultant role, highlighting technical growth, project impact, and continuous learning. [[ACTION:openResume]]`;
    }
    
    // Default response with comprehensive guidance
    return `🤔 I can provide detailed information about Veera's professional profile. Here are some topics I can help with:

**🎯 Job Role Matching:**
• Full Stack Developer fit assessment
• Solution Architect readiness
• Technical Lead capabilities
• Platform Engineer alignment

**🔧 Technical Expertise:**
• Frontend (React, Angular, JavaScript)
• Backend (Java, Spring Boot, Microservices)
• Cloud & DevOps (AWS, Azure, Docker, K8s)
• Databases (MySQL, PostgreSQL, MongoDB)

**💼 Professional Experience:**
• Career progression at Deloitte, Nisum, Infosys
• Project portfolio with measurable impact
• Achievements and key metrics
• Team collaboration and leadership

**🎓 Education & Certifications:**
• B.Tech in Mechanical Engineering
• Full Stack Development certification
• 10+ cloud and development certifications
• Continuous learning and growth

**🤝 Behavioral Skills:**
• Teamwork and collaboration approach
• Problem-solving methodology
• Communication style
• Leadership and mentoring

**📞 Career Opportunities:**
• Current availability and contact info
• Compensation philosophy
• Career growth trajectory
• Professional networking

**What specific aspect would you like to explore?** Feel free to ask about anything from technical skills to career progression or how Veera fits your specific role requirements!`;
  }
}

class AIProviderManager {
  private providers: AIProvider[];
  private currentProvider: AIProvider;

  constructor() {
    this.providers = [
      new GroqProvider(),
      new OpenAIProvider(),
      new AnthropicProvider(),
      new GeminiProvider(),
      new FallbackProvider() // Always last
    ];
    
    this.currentProvider = this.findAvailableProvider() || new FallbackProvider();
    
    // Debug: Log available providers
    console.log('🤖 AI Provider Status:', {
      available: this.getAvailableProviders(),
      current: this.getCurrentProvider()
    });
  }

  private findAvailableProvider(): AIProvider | null {
    return this.providers.find(provider => provider.isAvailable()) || null;
  }

  async generateResponse(prompt: string, _context: any): Promise<string> {
    try {
      // Try current provider first
      if (this.currentProvider.isAvailable()) {
        return await this.currentProvider.generateResponse(prompt, _context);
      }
      
      // Find next available provider
      const availableProvider = this.findAvailableProvider();
      if (availableProvider) {
        this.currentProvider = availableProvider;
        return await availableProvider.generateResponse(prompt, _context);
      }
      
      // Use fallback
      this.currentProvider = new FallbackProvider();
      return await this.currentProvider.generateResponse(prompt, _context);
      
    } catch (error) {
      console.error('AI Provider error:', error);
      
      // Try next provider
      const currentIndex = this.providers.indexOf(this.currentProvider);
      const nextProvider = this.providers.slice(currentIndex + 1).find(p => p.isAvailable());
      
      if (nextProvider) {
        this.currentProvider = nextProvider;
        return await nextProvider.generateResponse(prompt, context);
      }
      
      // Use fallback as last resort
      this.currentProvider = new FallbackProvider();
      return await this.currentProvider.generateResponse(prompt, _context);
    }
  }

  getCurrentProvider(): string {
    return this.currentProvider.name;
  }

  getAvailableProviders(): string[] {
    return this.providers.filter(p => p.isAvailable()).map(p => p.name);
  }
}

export const aiProvider = new AIProviderManager();
export type { AIProvider };
