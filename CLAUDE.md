# Pico-Fermi-Wordle Development Guide

## Commands
- **Dev server**: `npm run dev` - Start Vite development server
- **Build**: `npm run build` - Create production build
- **Lint**: `npm run lint` - Run ESLint on all files
- **Preview**: `npm run preview` - Preview production build locally

## Code Style Guidelines
- **React components**: Use functional components with hooks
- **File structure**: Keep components in `/src/components/` with matching CSS files
- **Imports order**: React → Components → Utils → CSS
- **Naming**: PascalCase for components, camelCase for functions/variables
- **State management**: Use React hooks with proper dependency arrays
- **Component pattern**: Props destructuring, logical organization of hooks and handlers
- **CSS**: Use component-scoped CSS files with kebab-case class names
- **Error handling**: Validate input with clear error messages
- **Project setup**: Vite build system with ESM modules

Follow existing patterns in the codebase when adding new features or making changes.