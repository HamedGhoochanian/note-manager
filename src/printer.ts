import { Note } from './types';
import * as chalk from 'chalk';

export class Printer {
  printNote(note: Note): void {
    console.log(chalk.blue(`Title: ${note.title} id: ${note.id}`));
    console.log(note.content + '\n');
  }

  printError(err: string): void {
    console.log(chalk.red(err));
  }

  printMessage(message: string): void {
    console.log(chalk.blue(message));
  }
}
