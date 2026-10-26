# Troubleshooting

## "Module not found" errors
```bash
# Ensure all dependencies are installed
pnpm install

# Rebuild packages in order
pnpm clean:packages
pnpm build:packages
```

## Storybook won't start
```bash
# Clean and rebuild everything
pnpm clean
pnpm install
pnpm build:packages
pnpm storybook
```

## Type errors in React components
```bash
# React types are auto-generated from core components
cd packages/ui-components
pnpm build

# This regenerates the types in react-ui-components
cd ../react-ui-components
pnpm build
```

## Tests failing
```bash
# Ensure you're in the correct package
cd packages/ui-components

# Clean and rebuild
pnpm clean
pnpm build
pnpm test
```

## pnpm version issues
```bash
# Use the exact version specified
corepack enable
corepack prepare pnpm@10.33.4 --activate
```
