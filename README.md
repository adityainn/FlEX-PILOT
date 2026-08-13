# Flex Pilot (FlEX-PILOT)

Flex Pilot is an AI-powered accessibility engineer that automatically scans web apps, identifies WCAG issues, maps them to source code, generates AI-driven fixes, verifies improvements with Playwright and Axe-core, and creates GitHub Pull Requests. It transforms accessibility testing from a manual process into an autonomous, end-to-end workflow.

## Key Features
- **Cinematic & Interactive Demos**: Autoplay presentation pipelines and sandbox simulations.
- **Axe-core Scanning**: Auto-detection of DOM hierarchy violations.
- **Source Code Mapping**: React AST analysis linking components to code locations.
- **Automated Fix Generation**: Smart typewritten patches tailored to repair WCAG violations.
- **Verification Loop**: Clean regression validation ensuring builds pass WCAG without regressions.
- **GitHub Pull Request Delivery**: Programmatic commits and pull requests detailing the score delta.

## Getting Started

### 1. Start the Backend API
```bash
cd backend
source venv/bin/activate
python3 main.py
```

### 2. Start the Dev Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the dashboard and interactive showcase.
