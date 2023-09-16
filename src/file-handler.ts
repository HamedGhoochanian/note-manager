import * as fsP from 'fs/promises';
import * as fs from 'fs';
import { Note } from './types';
import * as path from 'path';
import * as chalk from 'chalk';

export class FileHandler {
  constructor(fileName: string) {
    this.address = path.join(process.cwd(), fileName);
    if (!fs.existsSync(this.address)) {
      fs.writeFileSync(this.address, JSON.stringify({ notes: [] }), {
        encoding: 'utf-8',
      });
    } else {
      try {
        JSON.parse(fs.readFileSync(this.address, { encoding: 'utf-8' }));
      } catch {
        console.error(chalk.red('file is not a valid json'));
      }
    }
  }

  private readonly address: string;

  async getMaxId(): Promise<number> {
    const notes = await this.getAll();
    return notes.reduce((curr, { id }) => (id > curr ? id : curr), 0);
  }

  async getAll(): Promise<Note[]> {
    const fileData = await fsP.readFile(this.address, { encoding: 'utf-8' });
    const parsed = JSON.parse(fileData) as { notes: Note[] };
    return parsed.notes;
  }

  async get(targetId: number): Promise<Note> {
    const notes = await this.getAll();
    return notes.find(({ id }) => id == targetId);
  }

  async add(note: Note): Promise<void> {
    const notes = await this.getAll();
    notes.push(note);
    await fsP.writeFile(this.address, JSON.stringify({ notes }), {
      encoding: 'utf-8',
    });
  }

  async update(updatedNote: Note): Promise<void> {
    const notes = await this.getAll();
    const index = notes.findIndex((val) => val.id === updatedNote.id);
    notes[index] = updatedNote;
    await fsP.writeFile(this.address, JSON.stringify({ notes }), {
      encoding: 'utf-8',
    });
  }

  async delete(id: number) {
    const notes = await this.getAll();
    const index = notes.findIndex((val) => val.id === id);
    notes.splice(index, 1);
    await fsP.writeFile(this.address, JSON.stringify({ notes }), {
      encoding: 'utf-8',
    });
  }
}
