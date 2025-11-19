# Contributing to HMObility Safe Streets

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 🌟 Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🎨 Enhance UI/UX
- ✅ Add tests
- 🔧 Fix issues

## 🚀 Getting Started

### 1. Fork & Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/hmobility-safe-streets.git
cd hmobility-safe-streets
```

### 2. Setup Development Environment

```bash
# Install dependencies
npm install

# Setup backend (optional)
cd backend
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Copy environment variables
cp .env.example .env.local
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

## 📝 Coding Standards

### TypeScript/React

- Use TypeScript for all new files
- Follow ESLint rules (`npm run lint`)
- Use functional components with hooks
- Prefer named exports
- Add JSDoc comments for complex functions

```tsx
/**
 * Calculate accident severity score
 * @param heridos - Number of injured
 * @param defunciones - Number of deaths
 * @returns Severity score (0-10)
 */
function calculateSeverity(heridos: number, defunciones: number): number {
  return Math.min(10, heridos + defunciones * 3);
}
```

### Component Structure

```tsx
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
  onSave: () => void;
}

// 3. Component
const MyComponent = ({ title, onSave }: MyComponentProps) => {
  // Hooks
  const [value, setValue] = useState('');
  
  // Handlers
  const handleClick = () => {
    onSave();
  };
  
  // Render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick}>Save</Button>
    </div>
  );
};

// 4. Export
export default MyComponent;
```

### Styling

- Use Tailwind CSS utility classes
- Follow shadcn/ui patterns
- Maintain dark mode compatibility
- Ensure responsive design (mobile-first)

### Accessibility

- Add `aria-label` to interactive elements
- Use semantic HTML
- Ensure keyboard navigation
- Maintain focus states
- Test with screen readers

## 🧪 Testing

### Running Tests

```bash
# Unit tests (when implemented)
npm test

# E2E tests (when implemented)
npm run test:e2e

# Lint
npm run lint
```

### Writing Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" onSave={() => {}} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
  
  it('calls onSave when clicked', () => {
    const handleSave = vi.fn();
    render(<MyComponent title="Test" onSave={handleSave} />);
    fireEvent.click(screen.getByText('Save'));
    expect(handleSave).toHaveBeenCalled();
  });
});
```

## 🔀 Pull Request Process

### 1. Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Features
git commit -m "feat: add accident severity filter"

# Bug fixes
git commit -m "fix: correct map marker position"

# Documentation
git commit -m "docs: update API documentation"

# Refactoring
git commit -m "refactor: simplify chatbot logic"

# Performance
git commit -m "perf: optimize map rendering"

# Tests
git commit -m "test: add unit tests for validation"

# Chores
git commit -m "chore: update dependencies"
```

### 2. Before Submitting

```bash
# Run linter
npm run lint

# Build successfully
npm run build

# Run tests (when available)
npm test

# Check for type errors
npx tsc --noEmit
```

### 3. Submit PR

1. Push your branch: `git push origin feature/your-feature-name`
2. Open PR on GitHub
3. Fill in PR template
4. Link related issues
5. Request review

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How did you test this?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests pass
```

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g. macOS, Windows]
- Browser: [e.g. Chrome, Safari]
- Version: [e.g. 1.0.0]

**Additional context**
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Problem**
Describe the problem this feature would solve

**Proposed Solution**
Your suggested solution

**Alternatives**
Other solutions you've considered

**Additional Context**
Mockups, examples, references
```

## 📦 Project Structure

Understanding the codebase:

```
src/
├── components/       # React components
│   ├── ui/          # Reusable UI components (shadcn/ui)
│   └── ...          # Feature components
├── pages/           # Route pages
├── lib/             # Utilities and configs
│   ├── logger.ts        # Logging system
│   ├── validation.ts    # Data validation
│   ├── errorBoundary.tsx # Error handling
│   └── config.ts        # App configuration
├── data/            # Static JSON data
└── hooks/           # Custom React hooks

backend/
├── main.py          # FastAPI application
├── reglamento.json  # Regulation database
└── requirements.txt # Python dependencies
```

## 🔒 Security

- Never commit sensitive data (API keys, passwords)
- Use environment variables for secrets
- Sanitize user inputs
- Follow security guidelines in `AUDIT_REPORT.md`
- Report security vulnerabilities privately to maintainers

## 📚 Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [Leaflet Documentation](https://leafletjs.com)

## 🤝 Code Review Process

1. **Automated checks** run on PR
2. **Reviewer assigned** within 24 hours
3. **Address feedback** from reviewers
4. **Approval required** before merge
5. **Squash and merge** to main branch

## 📞 Questions?

- Check existing [Issues](https://github.com/helenaMGV/hmobility-safe-streets/issues)
- Start a [Discussion](https://github.com/helenaMGV/hmobility-safe-streets/discussions)
- Contact maintainers

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for making HMObility Safe Streets better! 🚀
