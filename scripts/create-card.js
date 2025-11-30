#!/usr/bin/env node

/**
 * Card Generator Script
 * Creates a new card with all necessary files from templates
 *
 * Usage: npm run create-card <card-name>
 * Example: npm run create-card weather
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get card name from command line arguments
const cardName = process.argv[2];

if (!cardName) {
  console.error('\n❌ Error: Card name is required');
  console.log('\n📖 Usage: npm run create-card <card-name>');
  console.log('   Example: npm run create-card weather\n');
  process.exit(1);
}

// Validate card name (kebab-case)
const kebabCaseRegex = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
if (!kebabCaseRegex.test(cardName)) {
  console.error('\n❌ Error: Card name must be in kebab-case (e.g., "my-card", "btc-price")');
  console.log('   Letters, numbers, and hyphens only. Must start with a letter.\n');
  process.exit(1);
}

// Convert card name to different cases
const toPascalCase = (str) => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

const toTitleCase = (str) => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const CardNamePascal = toPascalCase(cardName);
const CardNameTitle = toTitleCase(cardName);

// Paths
const cardsDir = path.join(__dirname, '..', 'packages', 'cards', 'src');
const cardDir = path.join(cardsDir, cardName);
const indexPath = path.join(cardsDir, 'index.ts');

// Check if card already exists
if (fs.existsSync(cardDir)) {
  console.error(`\n❌ Error: Card "${cardName}" already exists at ${cardDir}\n`);
  process.exit(1);
}

// Create card directory
console.log(`\n🎨 Creating new card: ${cardName}\n`);
fs.mkdirSync(cardDir, { recursive: true });

// File templates
const templates = {
  'types.ts': `/**
 * ${CardNameTitle} Card - Type Definitions
 */

export interface ${CardNamePascal}Data {
  // TODO: Define your data structure
  message: string;
  timestamp: number;
}
`,

  'data.ts': `/**
 * ${CardNameTitle} Card - Data Fetching
 */

import type { ${CardNamePascal}Data } from './types';

/**
 * Fetches data for the ${CardNameTitle} card
 *
 * TODO: Implement your data fetching logic
 * - Fetch from an external API
 * - Compute data locally
 * - Read from a file
 * - etc.
 */
export async function get${CardNamePascal}Data(): Promise<${CardNamePascal}Data> {
  // TODO: Replace with your actual data fetching
  // Example with external API:
  // const response = await fetch('https://api.example.com/data');
  // const json = await response.json();
  // return { message: json.msg, timestamp: Date.now() };

  return {
    message: 'Hello from ${CardNameTitle}!',
    timestamp: Date.now(),
  };
}
`,

  'render.tsx': `/**
 * ${CardNameTitle} Card - Rendering Components
 */

import type { CardRenderProps, CardSkeletonProps, CardErrorProps } from '@aob/core';
import type { ${CardNamePascal}Data } from './types';

/**
 * Main render component for the ${CardNameTitle} card
 */
export const ${CardNamePascal}Render = ({
  data,
  theme,
  cardMeta,
  actions,
  isLoading,
}: CardRenderProps<${CardNamePascal}Data>) => {
  if (!data) return null;

  return (
    <div
      style={{
        padding: '1rem',
        color: theme.palette.text,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
          {cardMeta.title}
        </h3>
        <button
          onClick={() => { void actions.requestRefresh(); }}
          disabled={isLoading}
          style={{
            background: 'transparent',
            border: \`1px solid \${theme.palette.border}\`,
            borderRadius: '4px',
            color: theme.palette.text,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            padding: '0.25rem 0.5rem',
            fontSize: '0.875rem',
            opacity: isLoading ? 0.5 : 1,
          }}
        >
          {isLoading ? '⟳' : '↻'}
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* TODO: Customize your card content */}
        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
          {data.message}
        </p>
        <p style={{ margin: 0, fontSize: '0.75rem', color: theme.palette.textMuted }}>
          Updated: {new Date(data.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

/**
 * Skeleton/loading state component (optional)
 */
export const ${CardNamePascal}Skeleton = ({ theme, cardMeta }: CardSkeletonProps) => {
  return (
    <div
      style={{
        padding: '1rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: theme.palette.textMuted }}>
        {cardMeta.title}
      </h3>

      {/* Animated skeleton bars */}
      <div
        style={{
          height: '2rem',
          background: theme.palette.border,
          borderRadius: '4px',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
      <div
        style={{
          height: '1rem',
          width: '60%',
          background: theme.palette.border,
          borderRadius: '4px',
          animation: 'pulse 1.5s ease-in-out infinite',
          animationDelay: '0.2s',
        }}
      />

      <style>
        {\`
          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
        \`}
      </style>
    </div>
  );
};

/**
 * Error state component (optional)
 */
export const ${CardNamePascal}Error = ({ error, actions, theme }: CardErrorProps) => {
  return (
    <div
      style={{
        padding: '1rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '2rem' }}>⚠️</div>
      <p style={{ margin: 0, color: theme.palette.danger, fontSize: '0.875rem' }}>
        {String(error)}
      </p>
      <button
        onClick={() => { void actions.requestRefresh(); }}
        style={{
          background: theme.palette.accent,
          border: 'none',
          borderRadius: '4px',
          color: theme.palette.background,
          cursor: 'pointer',
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          fontWeight: 600,
        }}
      >
        Try Again
      </button>
    </div>
  );
};
`,

  'index.ts': `/**
 * ${CardNameTitle} Card - Main Definition
 */

import type { CardDefinition } from '@aob/core';
import { CardId, LayoutConstraints } from '@aob/core';
import type { ${CardNamePascal}Data } from './types';
import { get${CardNamePascal}Data } from './data';
import { ${CardNamePascal}Render, ${CardNamePascal}Skeleton, ${CardNamePascal}Error } from './render';

/**
 * ${CardNameTitle} Card Definition
 *
 * TODO: Configure the card settings below
 */
export const ${CardNamePascal}Card: CardDefinition<${CardNamePascal}Data> = {
  // Unique identifier (must match folder name)
  id: CardId.createOrThrow('${cardName}'),

  // Display title
  title: '${CardNameTitle}',

  // Layout constraints (grid units)
  layout: LayoutConstraints.createOrThrow({
    minW: 1,        // Minimum width
    minH: 1,        // Minimum height
    defaultW: 2,    // Default width
    defaultH: 2,    // Default height
    maxW: 4,        // Maximum width (optional)
    maxH: 4,        // Maximum height (optional)
  }),

  // Data fetching function
  getData: get${CardNamePascal}Data,

  // Data policy (optional) pour activer cache/batching côté serveur
  // dataPolicy: {
  //   source: '${cardName.toUpperCase().replace(/-/g, '_')}',
  //   resourceIds: ['primary'],
  //   cacheTtlMs: 60000,
  //   // batch: true,
  // },

  // Rendering functions
  render: ${CardNamePascal}Render,
  renderSkeleton: ${CardNamePascal}Skeleton,   // Optional: remove to use default
  renderError: ${CardNamePascal}Error,         // Optional: remove to use default

  // Behavior configuration (optional)
  behavior: {
    useDefaultSkeleton: false,   // Set to true to use framework's default skeleton
    useDefaultError: false,      // Set to true to use framework's default error UI
  },

  // Optional border color (CSS color string)
  borderColor: '#3b82f6',  // Blue - TODO: Choose your color

  // Optional external link
  // externalLink: 'https://example.com',
};
`,

  'README.md': `# ${CardNameTitle} Card

## Description

TODO: Describe what this card does and what data it displays.

## Configuration

### Layout
- **Default size**: 2x2
- **Min size**: 1x1
- **Max size**: 4x4

### Refresh
- **Auto-refresh**: Every 60 seconds
- **Global refresh**: Enabled

## Data Source

TODO: Document where the data comes from (API, local computation, etc.)

## Customization

### Changing the refresh interval
Edit \`index.ts\` and modify the \`refresh.intervalMs\` value (in milliseconds).

### Changing the layout
Edit \`index.ts\` and modify the \`layout\` constraints.

### Changing the appearance
Edit \`render.tsx\` to customize the visual design.

## Development

1. **Test your data fetching**:
   - Implement \`get${CardNamePascal}Data()\` in \`data.ts\`
   - Test with sample data first

2. **Design the UI**:
   - Customize \`${CardNamePascal}Render\` in \`render.tsx\`
   - Use theme colors for consistency

3. **Handle edge cases**:
   - Test loading state (skeleton)
   - Test error state
   - Test with missing/null data

## Example Usage

This card is automatically registered when imported in \`packages/cards/src/index.ts\`.

\`\`\`typescript
import { ${CardNamePascal}Card } from './${cardName}';
\`\`\`
`,
};

// Create all template files
console.log('📝 Creating template files:');
for (const [filename, content] of Object.entries(templates)) {
  const filePath = path.join(cardDir, filename);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`   ✓ ${filename}`);
}

// Update index.ts to export the new card
console.log('\n📦 Registering card in index.ts...');

let indexContent = fs.readFileSync(indexPath, 'utf8');

// Add import statement
const importStatement = `import { ${CardNamePascal}Card } from './${cardName}';\n`;
const lastImportIndex = indexContent.lastIndexOf('import');
const nextLineAfterLastImport = indexContent.indexOf('\n', lastImportIndex);
indexContent =
  indexContent.slice(0, nextLineAfterLastImport + 1) +
  importStatement +
  indexContent.slice(nextLineAfterLastImport + 1);

// Add to allCards array (before the closing bracket)
const allCardsMatch = indexContent.match(/export const allCards: CardDefinition<any>\[\] = \[([\s\S]*?)\];/);
if (allCardsMatch) {
  const cardsArrayContent = allCardsMatch[1];
  const lastCardMatch = cardsArrayContent.trim().match(/(\w+Card),?\s*$/);

  if (lastCardMatch) {
    const insertPosition = indexContent.indexOf(lastCardMatch[0]) + lastCardMatch[0].length;
    const needsComma = !lastCardMatch[0].includes(',');

    indexContent =
      indexContent.slice(0, insertPosition) +
      (needsComma ? ',' : '') +
      `\n  ${CardNamePascal}Card,` +
      indexContent.slice(insertPosition);
  }
}

fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('   ✓ Card registered in allCards array');

// Success message
console.log('\n✅ Card created successfully!\n');
console.log('📁 Location:', cardDir);
console.log('\n📋 Next steps:');
console.log(`   1. Edit ${cardName}/data.ts to implement data fetching`);
console.log(`   2. Edit ${cardName}/render.tsx to customize the UI`);
console.log(`   3. Edit ${cardName}/index.ts to configure layout and refresh settings`);
console.log(`   4. Run "pnpm --filter @aob/web dev" to see your card\n`);
console.log('📖 Documentation: See README.md in your card folder\n');
