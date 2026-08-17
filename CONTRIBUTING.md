# Contributing to App-Studio

We love your input! We want to make contributing to App-Studio as easy and transparent as possible.

## Development Process

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run the tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

```bash
# Install dependencies
npm install

# Start development
npm run start

# Run tests
npm run test

# Run linting
npm run lint

# Run Storybook
npm run storybook
```

## Project Structure

```
src/
├── components/    # React components
├── hooks/        # Custom React hooks
├── providers/    # Context providers
├── utils/        # Utility functions
└── types/        # TypeScript types
```

## Testing

- Write tests for new features
- Maintain existing test coverage
- Run `npm test` before submitting PRs

## Documentation

- Update relevant documentation
- Add JSDoc comments to new code
- Update examples if needed

## Code Style

- Follow existing code style
- Use TypeScript
- Run linting before committing