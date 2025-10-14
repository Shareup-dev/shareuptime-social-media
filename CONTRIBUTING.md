# Contributing to ShareUpTime

Thank you for your interest in contributing to ShareUpTime! This document provides guidelines for contributing to our social media platform.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ for backend development
- React Native CLI for mobile development
- Git for version control
- PostgreSQL for database (optional for development)

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Shareup-dev/shareuptime-social-media.git
   cd shareuptime-social-media
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Mobile App Setup**:
   ```bash
   cd mobile-app
   npm install
   npx react-native start
   ```

## 📝 Development Guidelines

### Code Style

- Use TypeScript for new features
- Follow ESLint and Prettier configurations
- Maintain consistent naming conventions
- Add JSDoc comments for functions

### Commit Messages

Use conventional commit format:

```
type(scope): brief description

- feat: new feature
- fix: bug fix
- docs: documentation
- style: formatting
- refactor: code restructuring
- test: adding tests
- chore: maintenance
```

Example:
```
feat(backend): add user profile endpoint
fix(mobile): resolve navigation bug
docs(readme): update setup instructions
```

## 🔄 Pull Request Process

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
6. **Push to your fork**
7. **Open a Pull Request**

### PR Requirements

- Clear description of changes
- Screenshots for UI changes
- Tests for new features
- Documentation updates
- No merge conflicts

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test
npm run test:coverage
```

### Mobile Testing

```bash
cd mobile-app
npm test
npx react-native run-android --variant=release
```

## 📋 Issue Reporting

When reporting issues, please include:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots or logs if applicable

## 🏗️ Architecture Guidelines

### Backend Structure

- Controllers handle HTTP requests
- Services contain business logic
- Models define data structures
- Middleware handles cross-cutting concerns

### Mobile Structure

- Components are reusable UI elements
- Screens represent app pages
- Services handle API communication
- Redux manages application state

## 🔒 Security

- Never commit sensitive data
- Use environment variables for secrets
- Follow OWASP security guidelines
- Report security issues privately

## 📞 Communication

- GitHub Issues for bugs and features
- Discussions for questions
- Email: shareuptimex@gmail.com

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to ShareUpTime! 🌟