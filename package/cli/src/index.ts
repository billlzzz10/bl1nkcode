import { Command } from 'commander';
import dotenv from 'dotenv';
import { doctor } from './commands/doctor.js';
import { indexCommand } from './commands/index-command.js';
import { chat } from './commands/chat.js';

dotenv.config();

const program = new Command();

program
  .name('phoenix')
  .description('Gemini Phoenix Engine CLI')
  .version('1.0.0');

program
  .command('doctor')
  .description('Check the health of the CLI tool and its dependencies')
  .action(doctor);

program

  .command('index')

  .description('Create or update the semantic search index')

  .action(indexCommand);



program

  .command('chat <agent>')

  .description('Start an interactive chat session with an agent')

  .action(chat);



program.parse(process.argv);
