This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, clone the repository:

```bash
# Clone the repository
git clone https://github.com/elstruck/datax.git

# Navigate to the project directory
cd datax

# Install dependencies
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributing

To contribute to this project, follow these steps:

1. Fork the repository by clicking the 'Fork' button on GitHub
2. Clone your forked repository:
```bash
git clone https://github.com/elstruck/datax.git
```

3. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

4. Make your changes and commit them:
```bash
git add .
git commit -m "Add your descriptive commit message"
```

5. Push to your forked repository:
```bash
git push origin feature/your-feature-name
```

6. Go to GitHub and create a Pull Request:
   - Navigate to your forked repository
   - Click the "Pull Request" button
   - Click "New Pull Request"
   - Select your feature branch
   - Add a title and description for your changes
   - Click "Create Pull Request"

## App Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Main page component
│   ├── globals.css        # Global styles
│   └── fonts/             # Custom font files
│
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   │   └── sidebar.tsx   # Sidebar UI component
│   ├── app-sidebar.tsx   # Main sidebar implementation
│   └── theme-provider.tsx # Theme context provider
│
├── public/               # Static assets
│
└── config files
    ├── next.config.mjs   # Next.js configuration
    ├── tailwind.config.ts # Tailwind CSS configuration
    ├── postcss.config.mjs # PostCSS configuration
    ├── tsconfig.json     # TypeScript configuration
    └── .eslintrc.json    # ESLint configuration
```

### Key Directories and Files

- **`app/`**: Contains the main application code following Next.js 13+ app directory structure
  - `layout.tsx`: Defines the common layout wrapper for all pages
  - `page.tsx`: The main landing page component
  - `globals.css`: Global styles and Tailwind CSS utilities

- **`components/`**: Houses all React components
  - `ui/`: Contains reusable UI components
  - `app-sidebar.tsx`: Main sidebar component implementation
  - `theme-provider.tsx`: Manages theme state and context

- **Configuration Files**: Various configuration files for the development environment
  - TypeScript, ESLint, Tailwind CSS, and Next.js configurations