import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';

const execAsync = promisify(exec);

async function checkCommand(command: string, successMsg: string, failureMsg: string) {
  try {
    await execAsync(command);
    console.log(chalk.green(`✅ ${successMsg}`));
    return true;
  } catch (error) {
    console.error(chalk.red(`❌ ${failureMsg}`));
    return false;
  }
}

export async function checkEnvironment() {
  console.log('\nChecking system dependencies:');
  const nodeCheck = await checkCommand('node -v', 'Node.js is installed.', 'Node.js is NOT installed.');
  const pnpmCheck = await checkCommand('pnpm -v', 'pnpm is installed.', 'pnpm is NOT installed.');
  // Docker is optional now
  const uvCheck = await checkCommand('uv --version', 'uv (Python tool) is installed.', 'uv is NOT installed.');

  console.log('\n---');
  if (nodeCheck && pnpmCheck && uvCheck) {
    console.log(chalk.bold.green('🎉 Your environment is ready for the Phoenix Engine!'));
  } else {
    console.log(chalk.bold.red('🔥 Some environment checks failed. Please review the messages above.'));
  }
}

export * from './agents.js';
