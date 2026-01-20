import { indexContent } from '@phoenix/semantic-core';
import chalk from 'chalk';

export async function indexCommand() {
  console.log('🧠 Starting semantic indexing...');
  // Mock data for testing
  const mockContent = [
    { id: '1', text: 'The ui-architect plans the component hierarchy.' },
    { id: '2', text: 'The component-developer builds reusable UI parts with Tailwind.' },
    { id: '3', text: 'The form-specialist handles complex forms and validation.' }
  ];
  await indexContent(mockContent);
  console.log(chalk.green('✅ Semantic index process completed.'));
}
