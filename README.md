# Tensorus - Agentic Tensor Database Platform

*The next generation of AI-powered tensor databases with intelligent agent collaboration*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/ledgerbingo-gmailcoms-projects/v0-agentic-tensor-databases)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/XPm0D0U2tOK)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)

## 🚀 Overview

Tensorus is a cutting-edge platform that revolutionizes how you interact with tensor databases through intelligent AI agents. Our system transforms traditional data processing into an intuitive, conversational experience where specialized agents collaborate to handle complex tensor operations seamlessly.

### ✨ Key Features

#### 🔐 **Complete Authentication System**
- **Secure User Authentication** - JWT-based authentication with comprehensive security
- **User Registration & Login** - Elegant, responsive forms with real-time validation
- **Password Recovery** - Secure password reset functionality
- **Social Authentication** - GitHub and Google OAuth integration (demo)
- **User Dashboard** - Personalized control center with account management

#### 🤖 **AI Agent Network**
- **Data Ingestion Agent** - Processes and validates incoming data files
- **Tensor Transformation Agent** - Converts data into optimal tensor representations
- **Operation Learning Agent** - Learns and optimizes tensor operations
- **Query Processing Agent** - Interprets natural language queries
- **Orchestration Agent** - Coordinates all agent activities

#### 📊 **Advanced Data Processing**
- **Intelligent Data Upload** - Drag-and-drop interface with real-time processing
- **Tensor Visualization** - Interactive 3D tensor representations
- **Natural Language Queries** - Ask questions about your data in plain English
- **Real-time Analytics** - Live insights and data processing statistics
- **Clustering & Analysis** - K-means clustering and anomaly detection

#### 🛠️ **Developer Experience**
- **Developer Portal** - Complete API key management system
- **RESTful API** - Comprehensive API endpoints for all operations
- **Interactive Documentation** - Built-in API exploration and testing
- **Usage Analytics** - Track API usage, rate limits, and performance
- **TypeScript Support** - Full type safety throughout the application

#### 🎨 **Modern UI/UX**
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode** - Automatic theme switching with user preference
- **Component Library** - Built with shadcn/ui and Radix UI primitives
- **Smooth Animations** - Framer Motion powered interactions
- **Accessibility** - WCAG compliant with full keyboard navigation

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui, Radix UI
- **Authentication**: JWT with Context API state management
- **Data Processing**: Custom tensor processing algorithms
- **Animations**: Framer Motion
- **Charts**: Recharts for data visualization
- **Deployment**: Vercel with automatic deployments

### Project Structure
\`\`\`
tensorus-website/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── demo/              # Interactive demo
│   ├── developer/         # Developer portal
│   ├── guide/             # Documentation
│   └── platform/          # Platform overview
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── [features]/       # Feature-specific components
├── lib/                   # Utility libraries
│   └── auth/             # Authentication system
├── utils/                 # Data processing utilities
└── types/                 # TypeScript type definitions
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/pnpm/yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/tensorus-website.git
   cd tensorus-website
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Account
For testing, use these credentials:
- **Email**: `demo@tensorus.com`
- **Password**: `password`

## 📖 Usage Guide

### 1. Authentication
- **Sign Up**: Create a new account with email verification
- **Sign In**: Access your dashboard with secure authentication
- **Dashboard**: View your account overview, API usage, and recent activity

### 2. Data Processing
- **Upload Data**: Drag and drop CSV/JSON files for processing
- **Tensor Conversion**: Automatic conversion to optimized tensor format
- **Query Interface**: Ask natural language questions about your data
- **Visualization**: Explore your tensors with interactive 3D visualizations

### 3. Developer Integration
- **API Keys**: Generate and manage API keys in the Developer Portal
- **Documentation**: Access comprehensive API documentation
- **Usage Tracking**: Monitor API calls, rate limits, and performance metrics

### 4. AI Agent Network
- **Agent Monitoring**: Watch AI agents collaborate in real-time
- **Message Tracking**: See communication between specialized agents
- **Performance Analytics**: Monitor agent efficiency and response times

## 🔧 API Reference

### Authentication
\`\`\`typescript
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
POST /api/auth/logout
\`\`\`

### Data Processing
\`\`\`typescript
POST /api/data/upload
GET /api/data/process/{id}
POST /api/data/query
GET /api/data/tensors
\`\`\`

### Agent Network
\`\`\`typescript
GET /api/agents/status
GET /api/agents/messages
POST /api/agents/query
\`\`\`

## 🌟 Key Improvements Made

### Technical Enhancements
- ✅ **Complete TypeScript Migration** - Fixed all 46+ TypeScript compilation errors
- ✅ **Suspense Boundary Fix** - Resolved Next.js App Router warnings
- ✅ **Authentication System** - Full JWT-based user management
- ✅ **Developer Portal** - Complete API key management system
- ✅ **Enhanced Type Safety** - Comprehensive type definitions throughout

### User Experience
- ✅ **Responsive Design** - Mobile-first approach with perfect scaling
- ✅ **Loading States** - Smooth transitions and proper loading indicators
- ✅ **Error Handling** - Comprehensive error messages and recovery
- ✅ **Form Validation** - Real-time validation with helpful feedback

### Performance
- ✅ **Optimized Builds** - Efficient bundling and code splitting
- ✅ **Image Optimization** - Automatic image optimization disabled for flexibility
- ✅ **Type Checking** - Build-time type safety ensures reliability

## 🚀 Deployment

### Vercel (Recommended)
This project is optimized for Vercel deployment:

1. **Connect Repository** - Link your GitHub repository to Vercel
2. **Configure Build** - Build settings are pre-configured in `next.config.mjs`
3. **Deploy** - Automatic deployments on every commit to main branch

### Manual Deployment
\`\`\`bash
npm run build
npm run start
\`\`\`

## 🔄 Development Workflow

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint (configure first)

### Git Integration
The project maintains sync with v0.dev deployments:
1. Make changes in v0.dev chat interface
2. Deploy changes from v0.dev
3. Changes automatically sync to this repository
4. Vercel deploys the latest version

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Code Quality
- Follow TypeScript best practices
- Maintain responsive design principles
- Write comprehensive tests for new features
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [https://vercel.com/ledgerbingo-gmailcoms-projects/v0-agentic-tensor-databases](https://vercel.com/ledgerbingo-gmailcoms-projects/v0-agentic-tensor-databases)
- **v0.dev Project**: [https://v0.dev/chat/projects/XPm0D0U2tOK](https://v0.dev/chat/projects/XPm0D0U2tOK)
- **Documentation**: [View in-app documentation](https://your-domain.com/guide)

## 🙏 Acknowledgments

- Built with [v0.dev](https://v0.dev) for rapid prototyping
- UI components powered by [shadcn/ui](https://ui.shadcn.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

---

**Ready to revolutionize your data processing?** [Get started now](https://your-domain.com/auth/signup) and experience the future of tensor databases with AI agents!
