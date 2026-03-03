# Claude Code Guidelines

This file contains project-specific instructions for Claude Code.

For comprehensive project documentation, see [AGENTS.md](./AGENTS.md).

## Quick Reference

### Build Commands

```bash
# Install dependencies
pnpm install

# Build all packages (always run before apps)
pnpm build:packages

# Start Storybook for development
pnpm storybook

# Run tests
pnpm test

# Lint
pnpm lint
pnpm lint:fix
```

### Build Order

**Always build packages before apps:**
```bash
pnpm build:packages  # First
pnpm build:apps      # Then apps
```

### Project Structure

- **Core components**: `packages/ui-components/src/components/`
- **React bindings**: `packages/react-ui-components/` (auto-generated)
- **Storybook**: `apps/react-storybook/`
- **Shared utilities**: `packages/ui-components/src/utils/`
- **Types**: `packages/ui-components/src/types.ts` (exports all component types)

### Component Structure

Each component in `packages/ui-components/src/components/[component-name]/`:
- `[component-name].tsx` - Main component
- `[component-name].types.ts` - TypeScript interfaces
- `[component-name].scss` or `.base.scss/.light.scss/.night.scss` - Styles
- `[component-name].helper.ts` - Helper functions (optional)
- `[component-name].config.ts` - Constants (optional)

### Commit Messages

Follow Conventional Commits: `<type>(<scope>): <subject>`

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `perf`, `test`, `style`

Example: `feat(select): add max selectable items property`

### Testing

```bash
# Run all tests
pnpm test

# Run specific component tests
cd packages/ui-components
pnpm test -- kv-select
```

### Node/pnpm Requirements

- Node.js >= 22
- pnpm 8.15.9 (exact version)
