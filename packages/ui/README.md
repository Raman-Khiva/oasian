# 🎨 `@workspace/ui` — Shared Design System & UI Components

> **Shared UI component library for Oasian, powered by Tailwind CSS v4, Lucide icons, and shadcn/ui.**

---

## 🚀 Overview

The `@workspace/ui` package contains atomic, accessible UI components shared across Next.js web applications in the monorepo.

---

## 💻 Usage

To import components into any app inside the monorepo (`apps/web`, `apps/base`):

```tsx
import { Button } from "@workspace/ui/components/button"
import { Card, CardHeader, CardTitle, CardContent } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
```

---

## ➕ Adding New shadcn/ui Components

To add new UI components from shadcn/ui into this shared package, run from the repository root:

```bash
pnpm dlx shadcn@latest add [component-name] -c apps/web
```

Components will automatically be placed into `packages/ui/src/components`.
