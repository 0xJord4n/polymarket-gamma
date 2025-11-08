# Contributing to polymarket-gamma-ts

Thank you for considering contributing to polymarket-gamma-ts! We welcome contributions from everyone.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue on GitHub with:

- A clear, descriptive title
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Your environment (Node.js version, OS, etc.)
- Any relevant code snippets or error messages

### Suggesting Features

We welcome feature suggestions! Please open an issue with:

- A clear, descriptive title
- Detailed explanation of the feature
- Use cases and examples
- Any implementation ideas you might have

### Pull Requests

1. **Fork the repository** and create your branch from `main`:
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Make your changes**:
   - Write clean, readable code
   - Follow the existing code style
   - Add/update tests for new features or bug fixes
   - Add/update documentation if needed

4. **Write tests**:
   ```bash
   npm run test:watch
   ```
   - All new features should include unit tests
   - Maintain or improve test coverage
   - Ensure all tests pass before submitting PR

5. **Run linting and type checking**:
   ```bash
   npm run lint
   npm run check
   ```

6. **Fix any issues**:
   ```bash
   npm run lint:fix
   npm run format
   ```

7. **Run tests**:
   ```bash
   npm run test
   ```

8. **Build the project**:
   ```bash
   npm run build
   ```

9. **Commit your changes**:
   - Use clear, descriptive commit messages
   - Follow conventional commits format:
     - `feat: add new feature`
     - `fix: resolve bug`
     - `docs: update documentation`
     - `chore: update dependencies`
     - `refactor: improve code structure`
     - `test: add tests`

10. **Push to your fork** and submit a pull request

11. **Wait for review** - we'll review your PR as soon as possible

## Code Style

This project uses BiomeJS for linting and formatting. Please ensure your code:

- Passes `bun run lint` without errors
- Is formatted with `bun run format`
- Uses single quotes for strings
- Uses semicolons
- Uses trailing commas in objects and arrays
- Follows TypeScript best practices
- Has proper type annotations (no `any` types unless absolutely necessary)

## Development Workflow

```bash
# Install dependencies
npm install

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run check

# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build
```

## Project Structure

```
polymarket-gamma-ts/
├── src/
│   ├── client.ts       # Main client implementation
│   ├── types/          # TypeScript type definitions
│   │   └── index.ts
│   └── index.ts        # Package exports
├── examples/           # Usage examples
├── dist/              # Build output (generated)
├── biome.json         # BiomeJS configuration
├── tsconfig.json      # TypeScript configuration
├── tsconfig.build.json # Build configuration
└── package.json       # Package metadata
```

## Adding New Features

When adding new features:

1. **Update types** in `src/types/index.ts` if needed
2. **Implement the feature** in `src/client.ts`
3. **Export the feature** in `src/index.ts` if it's a new type or function
4. **Add examples** showing how to use the feature
5. **Update README** with documentation for the new feature
6. **Ensure type safety** - all public APIs should be fully typed

## Testing

This project uses **Vitest** for unit testing. All contributions should include tests:

1. **Write tests for new features**:
   - Add tests in `src/__tests__/`
   - Follow existing test patterns
   - Mock API calls using `vi.fn()`

2. **Run tests during development**:
   ```bash
   npm run test:watch  # Auto-run tests on file changes
   ```

3. **Ensure all tests pass**:
   ```bash
   npm run test        # Run all tests once
   ```

4. **Check test coverage**:
   ```bash
   npm run test:coverage  # Generate coverage report
   ```

5. **Test requirements**:
   - All tests must pass before PR is merged
   - New features should have corresponding unit tests
   - Bug fixes should include regression tests
   - Aim to maintain or improve code coverage

## Questions?

If you have questions, feel free to:

- Open an issue for discussion
- Ask in your pull request
- Check existing issues and PRs

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, trolling, or discriminatory language
- Personal attacks or insults
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:

- The project's commit history
- Release notes (for significant contributions)
- The README (for major features or improvements)

Thank you for contributing to polymarket-gamma-ts! 🚀
