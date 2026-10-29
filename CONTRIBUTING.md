# Contributing to TDC Cockpit

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Your First Code Contribution](#your-first-code-contribution)
- [Style Guides](#style-guides)

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## I Have a Question

Before you ask a question, it is best to search for existing [Issues](https://github.com/yourusername/tdc-cockpit/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue.

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an [Issue](https://github.com/yourusername/tdc-cockpit/issues/new).
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.

## I Want To Contribute

> ### Legal Notice
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project license.

### Reporting Bugs

#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Determine if your bug is really a bug and not an error on your side.
- To see if other users have experienced (and potentially already solved) the same issue you are having, check if there is not already a bug report existing for your bug or error in the [bug tracker](https://github.com/yourusername/tdc-cockpit/issues?q=label%3Abug).

#### How Do I Submit a Good Bug Report?

> You must never report security related issues, vulnerabilities or bugs including sensitive information to the issue tracker, or elsewhere in public. Instead sensitive bugs must be sent by email to your-email@example.com.

We use GitHub issues to track bugs and errors. If you run into an issue with the project:

- Open an [Issue](https://github.com/yourusername/tdc-cockpit/issues/new). (Since we can't be sure at this point whether it is a bug or not, we ask you not to talk about a bug yet and not to label the issue.)
- Explain the behavior you would expect and the actual behavior.
- Please provide as much context as possible and describe the *reproduction steps*.
- Provide information about OS, Browser, Node.js version, etc.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for TDC Cockpit, **including completely new features and minor improvements to existing functionality**.

#### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Perform a [search](https://github.com/yourusername/tdc-cockpit/issues) to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.
- Find out whether your idea fits with the scope and aims of the project.

#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/yourusername/tdc-cockpit/issues).

- Use a **clear and descriptive title** for the issue to identify the suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why. At this point you can also tell which alternatives do not work for you.
- You may want to **include screenshots and animated GIFs** which help you demonstrate the steps or point out the part which the suggestion is related to.
- **Explain why this enhancement would be useful** to most TDC Cockpit users.

### Your First Code Contribution

#### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git

#### Setup Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/tdc-cockpit.git
   cd tdc-cockpit
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

#### Making Changes

1. Make your changes in your feature branch
2. Test your changes thoroughly
3. Run type checking:
   ```bash
   npm run typecheck
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Commit your changes with a clear message:
   ```bash
   git commit -m "feat: add new feature"
   ```
6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Open a Pull Request

## Style Guides

### Git Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation only changes
- `style:` - Changes that do not affect the meaning of the code
- `refactor:` - A code change that neither fixes a bug nor adds a feature
- `perf:` - A code change that improves performance
- `test:` - Adding missing tests or correcting existing tests
- `chore:` - Changes to the build process or auxiliary tools

Examples:
```
feat: add dark mode toggle
fix: resolve login issue on mobile
docs: update README with deployment instructions
style: format code according to style guide
```

### Code Style

- Use TypeScript for all new code
- Follow existing code patterns and conventions
- Use functional components with hooks
- Keep components small and focused
- Write meaningful comments for complex logic
- Use descriptive variable and function names

### Component Structure

```typescript
// Imports
import React from 'react';

// Types/Interfaces
interface ComponentProps {
  // props
}

// Component
export default function Component({ prop1, prop2 }: ComponentProps) {
  // hooks
  // handlers
  // render
  return (
    // JSX
  );
}
```

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow the existing design system
- Use CSS variables for theme colors
- Maintain responsive design (mobile-first)
- Test in both light and dark modes

### Testing

- Test your changes in the browser
- Verify responsive behavior on different screen sizes
- Check both light and dark themes
- Test all affected features
- Ensure no console errors

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the documentation with details of any changes to the interface
3. The PR will be merged once it has been reviewed and approved

## Additional Notes

### Issue and Pull Request Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested

---

Thank you for contributing to TDC Cockpit! 🎉
