import axios from "axios";
import { NoteReadDTO, NoteUpsertDTO, NoteTitleDTO } from "../types";

const BACKEND_PROXY_PATH = "/notesbackend";

const api = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

class NotesApiService {
  async createNote(noteData: NoteUpsertDTO): Promise<NoteReadDTO> {
    const response = await api.post<NoteReadDTO>(
      `${BACKEND_PROXY_PATH}/note`,
      noteData
    );
    return response.data;
  }

  async searchNotesByTitle(title: string = ""): Promise<NoteTitleDTO[]> {
    const response = await api.get<NoteTitleDTO[]>(
      `${BACKEND_PROXY_PATH}/note`,
      {
        params: { title },
      }
    );
    return response.data;
  }

  async getNoteContent(title: string): Promise<NoteReadDTO> {
    const response = await api.get<NoteReadDTO>(
      `${BACKEND_PROXY_PATH}/note/content/${encodeURIComponent(title)}`
    );
    return response.data;
  }

  async updateNote(
    title: string,
    noteData: NoteUpsertDTO
  ): Promise<NoteReadDTO> {
    const response = await api.put<NoteReadDTO>(
      `${BACKEND_PROXY_PATH}/note/${encodeURIComponent(title)}`,
      noteData
    );
    return response.data;
  }

  async deleteNote(title: string): Promise<void> {
    await api.delete(`${BACKEND_PROXY_PATH}/note/${encodeURIComponent(title)}`);
  }

  async getAllNotes(): Promise<NoteReadDTO[]> {
    try {
      const titleResults = await this.searchNotesByTitle("");
      if (
        !titleResults ||
        !Array.isArray(titleResults) ||
        titleResults.length === 0
      ) {
        return [];
      }
      const notesPromises = titleResults.map((titleDto) =>
        this.getNoteContent(titleDto.title)
      );
      return await Promise.all(notesPromises);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 204) {
        return [];
      }
      console.error("Erro detalhado ao buscar todas as anotações:", error);
      throw error;
    }
  }
}

const notesApiService = new NotesApiService();
export default notesApiService;
