import axios from "axios";
import { NoteReadDTO, NoteUpsertDTO, NoteTitleDTO } from "../types";

// Cria uma instância do Axios com configurações base
const api = axios.create({
  baseURL: "http://localhost:3000", // Ajuste a URL base conforme necessário
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

class NotesApiService {
  // POST /note - Criar nova anotação
  async createNote(noteData: NoteUpsertDTO): Promise<NoteReadDTO> {
    const response = await api.post<NoteReadDTO>("/note", noteData);
    return response.data;
  }

  // GET /note?title=... - Buscar anotações por título
  async searchNotesByTitle(title: string = ""): Promise<NoteTitleDTO[]> {
    const response = await api.get<NoteTitleDTO[]>("/note", {
      params: { title },
    });
    return response.data;
  }

  // GET /note/content/:title - Buscar conteúdo completo de uma anotação
  async getNoteContent(title: string): Promise<NoteReadDTO> {
    const response = await api.get<NoteReadDTO>(
      `/note/content/${encodeURIComponent(title)}`
    );
    return response.data;
  }

  // PUT /note/:title - Atualizar anotação existente
  async updateNote(
    title: string,
    noteData: NoteUpsertDTO
  ): Promise<NoteReadDTO> {
    const response = await api.put<NoteReadDTO>(
      `/note/${encodeURIComponent(title)}`,
      noteData
    );
    return response.data;
  }

  // DELETE /note/:title - Deletar anotação
  async deleteNote(title: string): Promise<void> {
    // A resposta de um delete bem-sucedido não terá conteúdo, o que o Axios já lida bem.
    await api.delete(`/note/${encodeURIComponent(title)}`);
  }

  // Método para buscar todas as anotações (composição)
  async getAllNotes(): Promise<NoteReadDTO[]> {
    try {
      // Este método pode ser simplificado se o backend tiver uma rota para buscar tudo
      const titleResults = await this.searchNotesByTitle("");
      if (!titleResults || titleResults.length === 0) {
        return [];
      }
      const notesPromises = titleResults.map((titleDto) =>
        this.getNoteContent(titleDto.title)
      );
      return await Promise.all(notesPromises);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 204) {
        return []; // Trata o caso de "No Content" como uma lista vazia
      }
      throw error; // Lança outros erros para serem tratados no componente
    }
  }
}

const notesApiService = new NotesApiService();
export default notesApiService;
