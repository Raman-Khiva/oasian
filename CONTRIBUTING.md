# 🤝 Contributing to Oasian

Thank you for your interest in contributing to **Oasian**! We welcome contributions from developers of all skill levels. This guide provides step-by-step instructions for setting up your development environment, adhering to code standards, and submitting pull requests.

---

## 📜 Code of Conduct

All contributors are expected to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before getting started.

---

## 🛠️ Local Development Environment Setup

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **pnpm**: `v10.0.0` or higher (`npm i -g pnpm`)
- **Git**

### Step-by-Step Setup

1. **Fork & Clone the Repository**
   ```bash
   git clone https://github.com/[YOUR_GITHUB_USERNAME]/oasian.git
   cd oasian
   ```

2. **Install Workspace Dependencies**
   ```bash
   pnpm install
   ```

3. **Set Up Environment Variables**
   Copy `.env.example` to `.env` in the project root:
   ```bash
   cp .env.example .env
   ```
   Fill in your local or development database URL (`DATABASE_URL`), Clerk credentials, and Groq API key.

4. **Initialize Database**
   Generate Prisma client types and seed initial test data:
   ```bash
   pnpm db:generate
   pnpm db:push
   pnpm db:seed
   ```

5. **Start Dev Server**
   ```bash
   pnpm dev
   ```

---

## 🌿 Git Branching Strategy

We follow a standard feature branch workflow:

- `main`: Production-ready codebase.
- `feat/feature-name`: New features or enhancements.
- `fix/bug-description`: Bug fixes.
- `docs/documentation-update`: Documentation additions or updates.
- `refactor/component-name`: Code refactoring.

---

## 💬 Commit Message Guidelines

We enforce **Conventional Commits** for clean git history:

- `feat(web): add resume PDF export functionality`
- `fix(db): correct Neon connection string parsing`
- `docs(readme): add recruiter setup instructions`
- `style(ui): update primary button hover gradient`
- `refactor(groq): optimize resume extraction prompt`

---

## 🧪 Testing & Validation Commands

Before submitting a PR, ensure all checks pass locally:

```bash
# Typecheck TypeScript across all workspace packages
pnpm typecheck

# Run ESLint validation
pnpm lint

# Format code with Prettier
pnpm format

# Verify production build
pnpm build
```

---

## 📥 Submitting a Pull Request

1. Create a clear, descriptive branch (`git checkout -b feat/my-feature`).
2. Make your changes and verify with `pnpm lint` and `pnpm typecheck`.
3. Commit your changes following Conventional Commits.
4. Push to your fork (`git push origin feat/my-feature`).
5. Open a Pull Request against `main` using our [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md).
