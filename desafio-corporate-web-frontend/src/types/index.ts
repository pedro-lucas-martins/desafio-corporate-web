export interface NoteUpsertDTO {
  title: string;
  content: string;
}

export interface NoteReadDTO {
  id: number;
  title: string;
  content: string;
}

export interface NoteTitleDTO {
  title: string;
}

export interface AppState {
  notes: NoteReadDTO[];
  searchTerm: string;
  isCreateDialogOpen: boolean;
  isEditDialogOpen: boolean;
  currentNote: NoteUpsertDTO;
  editingNote: NoteReadDTO | null;
  loading: boolean;
  error: string;
  success: string;
  isOnlineMode: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface NotesApiService {
  createNote(noteData: NoteUpsertDTO): Promise<NoteReadDTO>;
  searchNotesByTitle(title?: string): Promise<NoteTitleDTO[]>;
  getNoteContent(title: string): Promise<NoteReadDTO>;
  updateNote(title: string, noteData: NoteUpsertDTO): Promise<NoteReadDTO>;
  deleteNote(title: string): Promise<void>;
  getAllNotes(): Promise<NoteReadDTO[]>;
}

export type FormEvent = React.FormEvent<HTMLFormElement>;
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type TextareaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;
export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;

export interface NoteCardProps {
  note: NoteReadDTO;
  onEdit: (note: NoteReadDTO) => void;
  onDelete: (title: string) => void;
  loading?: boolean;
}

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export enum MessageType {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
  WARNING = "warning",
}

export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}
