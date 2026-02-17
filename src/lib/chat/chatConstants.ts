export const CHAT_CONSTANTS = {
  // Response delays
  MIN_RESPONSE_DELAY: 200,
  MAX_RESPONSE_DELAY: 500,
  
  // UI constants
  SCROLL_DELAY: 100,
  TYPING_DELAY: 1000,
  
  // Message limits
  MAX_MESSAGE_LENGTH: 1000,
  MAX_MESSAGES_VISIBLE: 50,
  
  // Animation durations
  ANIMATION_DURATION: 300,
  TRANSITION_DURATION: 200,
  
  // Bot info
  BOT_NAME: 'Lumi',
  BOT_AVATAR: '🤖',
  
  // Navigation mapping
  NAVIGATION_MAP: {
    'bio': '#about',
    'experience': '#experience',
    'careerStart': '#experience',
    'companies': '#experience',
    'currentCompany': '#experience',
    'currentRole': '#experience',
    'skills': '#skills',
    'programmingSkills': '#skills',
    'frontendSkills': '#skills',
    'backendSkills': '#skills',
    'databaseSkills': '#skills',
    'cloudSkills': '#skills',
    'skillProficiency': '#skills',
    'specificTech': '#skills',
    'projects': '#projects',
    'projectRole': '#projects',
    'projectChallenges': '#projects',
    'education': '#education',
    'educationCompletion': '#education',
    'certifications': '#certifications',
    'awsCertifications': '#certifications',
    'azureCertifications': '#certifications',
    'certificationCount': '#certifications',
    'contact': '#contact',
    'email': '#contact',
    'phone': '#contact',
    'location': '#contact',
    'socialLinks': '#contact',
    'birthInfo': '#contact',
    'motivation': '#about',
    'leadership': '#about',
    'feedback': '#about',
    'problems': '#about',
    'industries': '#about',
    'career': '#about',
    'workPreferences': '#about',
  } as const,
  
  // Error messages
  ERROR_MESSAGES: {
    GENERIC: 'Sorry, I encountered an error. Please try again or contact Veera directly.',
    NETWORK: 'Network error. Please check your connection and try again.',
    TIMEOUT: 'Request timed out. Please try again.',
  },
} as const;
