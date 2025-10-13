# Resume Project - Development Guidelines

## Available Commands

### Development

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Production build (runs in pre-commit hook)
- `pnpm start` - Start production server

### Quality

- `pnpm lint` - Run Next.js linter
- `pnpm print` - Generate PDF resume

### Testing

- No test framework currently configured

## Code Style Guidelines

### Import Organization

```typescript
// External libraries first
import { useState } from "react";
import { z } from "zod";

// Internal imports with @/ alias
import { cn } from "@/lib/utils";
import { ResumeView } from "@/components/resume/resume";
```

### Naming Conventions

- Components: PascalCase (`ResumeView`, `WorkItem`)
- Functions: camelCase (`createToggleHandler`)
- Constants: UPPER_SNAKE_CASE (`DEFAULT_ITEMS_TO_SHOW`)
- Files: kebab-case always

### TypeScript Patterns

- Use Zod for schema validation
- Strict type checking enabled
- Prefer `type` for simple types, `interface` for objects
- Use optional chaining and nullish coalescing

### React Patterns

- Mark client components with `"use client"`
- Use Tailwind utility classes with `cn()` helper
- Component composition over complex props
- Print-specific CSS classes for PDF generation

### Error Handling

- Use Zod validation for runtime type safety
- Simple try-catch patterns
- Minimal error boundaries

## Project Structure

- `/components` - React components (PascalCase files)
- `/lib` - Utilities and schemas (kebab-case files)
- `/app` - Next.js App Router pages
- `/public` - Static assets including PDF exports

## Development Notes

- Pre-commit hook runs `pnpm build` to ensure builds pass
- Uses Next.js 16 beta with App Router
- Tailwind CSS v4 for styling
- Path aliases: `@/*` maps to project root
