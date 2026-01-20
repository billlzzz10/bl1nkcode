import { loadAgentPersona } from '@phoenix/core';
import chalk from 'chalk';
import readline from 'readline';

export async function chat(agentName: string) {
  try {
    const persona = await loadAgentPersona(agentName);
    console.log(chalk.bold.cyan(`\nStarting chat session with ${persona.name}...`));
    console.log(chalk.dim(persona.description));
    console.log(chalk.yellow(`System Prompt: ${persona.prompts?.system || 'No system prompt defined.'}`));
    console.log(chalk.dim('\nType "exit" or "quit" to end the session.\n'));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.green(`${agentName}> `)
    });

    rl.prompt();

    rl.on('line', (line) => {
      const input = line.trim();
      if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
        rl.close();
        return;
      }

      if (input) {
        // Mock response for now, focusing on persona context
        console.log(chalk.blue(`${persona.name}:`), `I am acting as a ${persona.name}. You said: "${input}"`);
      }
      rl.prompt();
    }).on('close', () => {
      console.log(chalk.bold.cyan('\nChat session ended. Goodbye!'));
      process.exit(0);
    });

  } catch (error: any) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}
