import { Command } from 'commander';
import { NoteManager } from './note-manager';
import { Printer } from './printer';
import { FileHandler } from './file-handler';
import { CreateInput } from './types';

const fileHandler = new FileHandler('notes.json');
const manager = new NoteManager(fileHandler);
const printer = new Printer();
const program = new Command()
  .name('Note Manager')
  .description('CLI for managing notes')
  .version('1.0.0');

program
  .command('list')
  .description('List all notes')
  .option('--limit', 'Maximum number of notes to return', '10')
  .option('--skip', 'Number of notes to skip', '0')
  .action(async (options) => {
    const result = await manager.list({
      skip: parseInt(options.skip),
      limit: parseInt(options.limit),
    });
    result.data.forEach((note) => printer.printNote(note));
  });

program
  .command('create')
  .description('Create a new note')
  .option('--title <string>', "The note's title")
  .option('--content <string>', "The note's content")
  .action(async (options: CreateInput) => {
    const result = await manager.create(options);
    if (result.err) {
      printer.printError(result.err);
    } else {
      printer.printNote(result.data);
    }
  });

program
  .command('delete')
  .description('Remove a note')
  .argument('<id>', 'Note ID')
  .action(async (id: string) => {
    const parsedId = parseInt(id);
    const result = await manager.delete(parsedId);
    if (result.err) {
      printer.printError(result.err);
    } else {
      printer.printMessage(result.data);
    }
  });

program
  .command('get')
  .argument('<id>', 'Note ID')
  .action(async (id: string) => {
    const parsedId = parseInt(id);
    const result = await manager.get(parsedId);
    if (result.err) {
      printer.printError(result.err);
    } else {
      printer.printNote(result.data);
    }
  });

program
  .command('update')
  .argument('<id>', 'Note ID')
  .option('--title <string>', "The note's title")
  .option('--content <string>', "The note's content")
  .action(async (id: string, options: CreateInput) => {
    const parsedId = parseInt(id);
    const result = await manager.update(parsedId, options);
    if (result.err) {
      printer.printError(result.err);
    } else {
      printer.printNote(result.data);
    }
  });

program.parse();
