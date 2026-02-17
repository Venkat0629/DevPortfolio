# Lumi AI Chat Widget Setup Guide

## Overview

Lumi is an intelligent, AI-powered chat assistant integrated into the portfolio website. It provides real-time, accurate responses about Veera's professional profile based on portfolio data.

## Quick Start

### 1. Development
```bash
# Start development server
npm run dev

# The Lumi chat widget will be available at http://localhost:5173
# Look for the chat button in the bottom-right corner
```

### 2. Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Configuration

### Environment Variables
Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure these variables:
```env
VITE_CHAT_ENABLED=true          # Enable/disable NEXUS chat widget
VITE_CHAT_POSITION=bottom-right # Position: bottom-right, bottom-left
VITE_CHAT_THEME=auto            # Theme: light, dark, auto
```

## Features

### NEXUS Capabilities
- **Experience**: Work history, roles, companies
- **Skills**: Technologies, frameworks, tools
- **Projects**: Portfolio projects, descriptions
- **Certifications**: AWS, Azure, Oracle, HackerRank
- **Education**: Academic background
- **Contact**: Email, phone, location
- **Navigation**: Direct section links
- **Actions**: Open resume, contact form

### Action Tokens
NEXUS uses special tokens for actions:
- `[[ACTION:openResume]]` - Opens resume viewer
- `[[ACTION:openContactForm]]` - Opens contact form
- `[[NAV:/#section]]` - Navigates to section

### Sample Enhanced Queries
Try these queries to test NEXUS AI:

**Career Analysis:**
- "Tell me about his career flow"
- "What's his career progression?"
- "Show me his professional journey"

**DevOps Expertise:**
- "What are his DevOps skills?"
- "Tell me about his cloud experience"
- "What DevOps tools does he know?"

**Detailed Experience:**
- "Tell me about his experience"
- "What companies has he worked for?"
- "How long has he been working?"

**Skills Analysis:**
- "What are his top skills?"
- "What technologies does he know?"
- "Show me his skill levels"

**Projects:**
- "What projects has he worked on?"
- "Tell me about his featured projects"
- "What's his recent work?"

**Other Queries:**
- "What's his educational background?"
- "What certifications does he have?"
- "How can I contact him?"

## Architecture

### File Structure
```
src/
├── components/ui/
│   ├── ChatWidget.tsx          # Main Lumi chat component
│   └── LazyChatWidget.tsx     # Lazy-loaded wrapper
├── lib/
│   ├── chat/                        # Lumi Chat System (organized)
│   │   ├── index.ts                 # Main exports
│   │   ├── chatAgent.ts             # Chat agent (1200+ trained patterns)
│   │   ├── chatTypes.ts             # TypeScript interfaces
│   │   ├── chatConstants.ts         # Configuration constants
│   │   └── chatConfig.ts            # Chat configuration
│   ├── animations.ts                # Animation utilities
│   ├── contactEmail.ts              # Email service
│   ├── techIcons.ts                 # Technology icons
│   └── utils.ts                     # General utilities
└── App.tsx                     # Integration point
```

### Performance Features
- **Lazy Loading**: Lumi loads on-demand
- **Code Splitting**: Separate bundle for chat functionality
- **Minimal Bundle**: ~7KB additional to main bundle (optimized)
- **Responsive**: Works on all screen sizes
- **Dark Mode**: Automatic theme detection

## Customization

### Changing Responses
Edit `src/lib/chat/chatAgent.ts` to modify:
- Lumi response logic
- Data sources
- Action triggers
- Navigation behavior

### Configuration
Edit `src/lib/chat/chatConstants.ts` to modify:
- Response delays
- UI constants
- Error messages
- Navigation mapping

### Types
Edit `src/lib/chat/chatTypes.ts` to modify:
- Interface definitions
- Type declarations

### Styling
Lumi uses Tailwind CSS classes:
- Primary colors: `primary-500`, `primary-600`
- Accent colors: `accent-500`, `accent-600`
- Card styling: `bg-card`, `border-border`

### Position
Change Lumi position in `LazyChatWidget.tsx`:
```css
/* bottom-right (default) */
fixed bottom-4 right-4

/* bottom-left */
fixed bottom-4 left-4
```

## Troubleshooting

### Common Issues

1. **NEXUS chat button not visible**
   - Check `VITE_CHAT_ENABLED=true`
   - Verify CSS z-index conflicts
   - Check browser console for errors

2. **Responses not working**
   - Verify `portfolio.json` is accessible
   - Check console for import errors
   - Ensure `chatService.ts` is properly exported

3. **Actions not triggering**
   - Check event listeners in `App.tsx`
   - Verify element IDs exist
   - Test navigation manually first

### Debug Mode
Add this to `.env.local`:
```env
VITE_CHAT_DEBUG=true
```

This will enable console logging for NEXUS interactions.

## Deployment

### Vercel
NEXUS works out-of-the-box with Vercel:
1. Push to GitHub
2. Deploy to Vercel
3. NEXUS will be automatically included

### Other Platforms
Ensure the build process includes:
- All NEXUS chat widget files
- Portfolio data JSON
- Environment variables

## Future Enhancements

### Planned Features
- Vector embeddings for better search
- Analytics for NEXUS interactions
- Multi-language support
- Voice input/output
- Custom themes

### Model Upgrades
To switch NEXUS to a different AI model:
1. Update `src/lib/chatService.ts`
2. Modify response generation logic
3. Update system prompt if needed
4. Test thoroughly

## Support

For NEXUS issues or questions:
1. Check this guide first
2. Review browser console
3. Test with different queries
4. Verify portfolio data accuracy
