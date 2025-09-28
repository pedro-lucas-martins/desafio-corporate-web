import {
  NoteUpsertDTO,
  NoteReadDTO,
  NoteTitleDTO,
  NotesApiService as INotesApiService,
  ApiConfig,
} from "../types";

// Configuração base da API
const API_CONFIG: ApiConfig = {
  baseURL: "http://localhost:3000", // Ajuste conforme necessário
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

// Classe para gerenciar as chamadas da API
class NotesApiService implements INotesApiService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiConfig = API_CONFIG) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = config.headers || {};
  }

  // Método auxiliar para fazer requisições HTTP
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Se a resposta for 204 (No Content), retorna null
      if (response.status === 204) {
        return null as T;
      }

      // Se não for uma resposta ok, lança erro
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      // Tenta fazer parse do JSON
      const data: T = await response.json();
      return data;
    } catch (error) {
      console.error(`Erro na requisição para ${endpoint}:`, error);
      throw error;
    }
  }

  // POST /note - Criar nova anotação
  async createNote(noteData: NoteUpsertDTO): Promise<NoteReadDTO> {
    return await this.makeRequest<NoteReadDTO>("/note", {
      method: "POST",
      body: JSON.stringify(noteData),
    });
  }

  // GET /note?title=... - Buscar anotações por título
  async searchNotesByTitle(title: string = ""): Promise<NoteTitleDTO[]> {
    const queryParam = title ? `?title=${encodeURIComponent(title)}` : "";
    return await this.makeRequest<NoteTitleDTO[]>(`/note${queryParam}`);
  }

  // GET /note/content/:title - Buscar conteúdo completo de uma anotação
  async getNoteContent(title: string): Promise<NoteReadDTO> {
    return await this.makeRequest<NoteReadDTO>(
      `/note/content/${encodeURIComponent(title)}`
    );
  }

  // PUT /note/:title - Atualizar anotação existente
  async updateNote(
    title: string,
    noteData: NoteUpsertDTO
  ): Promise<NoteReadDTO> {
    return await this.makeRequest<NoteReadDTO>(
      `/note/${encodeURIComponent(title)}`,
      {
        method: "PUT",
        body: JSON.stringify(noteData),
      }
    );
  }

  // DELETE /note/:title - Deletar anotação
  async deleteNote(title: string): Promise<void> {
    await this.makeRequest<void>(`/note/${encodeURIComponent(title)}`, {
      method: "DELETE",
    });
  }

  // Método para buscar todas as anotações (usando busca vazia)
  async getAllNotes(): Promise<NoteReadDTO[]> {
    try {
      const titleResults = await this.searchNotesByTitle("");

      // Se não há resultados, retorna array vazio
      if (!titleResults || titleResults.length === 0) {
        return [];
      }

      // Para cada título, busca o conteúdo completo
      const notesPromises = titleResults.map((titleDto: NoteTitleDTO) =>
        this.getNoteContent(titleDto.title)
      );

      const notes = await Promise.all(notesPromises);
      return notes;
    } catch (error) {
      // Se retornar 204 (No Content), significa que não há anotações
      if (error instanceof Error && error.message.includes("204")) {
        return [];
      }
      throw error;
    }
  }

  // Método para verificar conectividade com a API
  async checkConnection(): Promise<boolean> {
    try {
      await this.makeRequest<NoteTitleDTO[]>("/note");
      return true;
    } catch (error) {
      console.warn("API não está acessível:", error);
      return false;
    }
  }

  // Método para atualizar configuração da API
  updateConfig(newConfig: Partial<ApiConfig>): void {
    if (newConfig.baseURL) {
      this.baseURL = newConfig.baseURL;
    }
    if (newConfig.headers) {
      this.defaultHeaders = { ...this.defaultHeaders, ...newConfig.headers };
    }
  }
}

// Instância singleton do serviço
const notesApiService = new NotesApiService();

export default notesApiService;

// Exporta também métodos individuais para facilitar o uso
export const {
  createNote,
  searchNotesByTitle,
  getNoteContent,
  updateNote,
  deleteNote,
  getAllNotes,
  checkConnection,
} = notesApiService;
