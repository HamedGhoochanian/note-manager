import { CreateInput, ListInput, Note, Result } from './types';
import { FileHandler } from './file-handler';

export class NoteManager {
  constructor(private readonly fileHandler: FileHandler) {}

  async create(input: CreateInput): Promise<Result<Note>> {
    const id = (await this.fileHandler.getMaxId()) + 1;
    const note: Note = {
      id,
      title: input.title,
      content: input.content,
      createdAt: new Date(),
      updatedAt: null,
    };
    await this.fileHandler.add(note);
    return { err: null, data: note };
  }

  async list(input: ListInput): Promise<Result<Note[]>> {
    const notes = await this.fileHandler.getAll();
    return { err: null, data: notes.slice(input.skip, input.limit) };
  }

  async update(id: number, input: CreateInput): Promise<Result<Note>> {
    const note = await this.fileHandler.get(id);
    if (!note) {
      return {
        err: 'note does not exist',
        data: null,
      };
    }
    note.updatedAt = new Date();
    note.content = input.content;
    note.title = input.title;
    await this.fileHandler.update(note);
    return { err: null, data: note };
  }

  async delete(id: number): Promise<Result<string>> {
    const note = await this.fileHandler.get(id);
    if (!note) {
      return {
        err: 'note not found',
        data: null,
      };
    }
    await this.fileHandler.delete(id);
    return { err: null, data: 'note deleted' };
  }

  async get(id: number): Promise<Result<Note>> {
    const note = await this.fileHandler.get(id);
    if (!note) {
      return {
        err: 'note not found',
        data: null,
      };
    }
    return { err: null, data: note };
  }
}
