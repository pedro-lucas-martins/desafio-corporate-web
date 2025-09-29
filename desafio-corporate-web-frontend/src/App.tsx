import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.jsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog.jsx";
import {
  Alert,
  AlertDescription as AlertDesc,
} from "@/components/ui/alert.jsx";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  StickyNote,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import notesApiService from "./services/notesApi";
import {
  NoteReadDTO,
  NoteUpsertDTO,
  InputChangeEvent,
  TextareaChangeEvent,
} from "./types";
import "./App.css";

const App: React.FC = () => {
  const [notes, setNotes] = useState<NoteReadDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);
  const [viewingNote, setViewingNote] = useState<NoteReadDTO | null>(null);
  const [currentNote, setCurrentNote] = useState<NoteUpsertDTO>({
    title: "",
    content: "",
  });
  const [editingNote, setEditingNote] = useState<NoteReadDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const clearMessages = (): void => {
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 5000);
  };

  const fetchNotes = async (): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      const fetchedNotes = await notesApiService.getAllNotes();
      setNotes(fetchedNotes || []);
    } catch (err) {
      console.error("Erro ao buscar anotações:", err);
      setError(
        "Erro ao carregar anotações. Verifique se o backend está rodando."
      );
      setNotes([]);
      clearMessages();
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchNotes();
    }
  }, [searchTerm]);

  const handleCreateNote = async (): Promise<void> => {
    if (!currentNote.title.trim() || !currentNote.content.trim()) {
      setError("Por favor, preencha título e conteúdo");
      clearMessages();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const createdNote = await notesApiService.createNote({
        title: currentNote.title.trim(),
        content: currentNote.content.trim(),
      });
      setNotes((prev) => [...prev, createdNote]);
      setSuccess("Anotação criada com sucesso!");
      setCurrentNote({ title: "", content: "" });
      setIsCreateDialogOpen(false);
      clearMessages();
    } catch (err) {
      console.error("Erro ao criar anotação:", err);
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setError(
          "Já existe uma anotação com esse título. Escolha outro título."
        );
      } else {
        setError("Erro ao criar anotação. Tente novamente.");
      }
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNote = async (): Promise<void> => {
    if (!currentNote.title.trim() || !currentNote.content.trim()) {
      setError("Por favor, preencha título e conteúdo");
      clearMessages();
      return;
    }
    if (!editingNote) {
      setError("Nenhuma anotação selecionada para edição");
      clearMessages();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const updatedNote = await notesApiService.updateNote(editingNote.title, {
        title: currentNote.title.trim(),
        content: currentNote.content.trim(),
      });
      const updatedNotes = notes.map((note) =>
        note.title === editingNote.title ? updatedNote : note
      );
      setNotes(updatedNotes);
      if (viewingNote?.title === editingNote.title) {
        setViewingNote(updatedNote);
      }
      setSuccess("Anotação atualizada com sucesso!");
      setCurrentNote({ title: "", content: "" });
      setEditingNote(null);
      setIsEditDialogOpen(false);
      clearMessages();
    } catch (err) {
      console.error("Erro ao atualizar anotação:", err);
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError("Anotação não encontrada.");
      } else {
        setError("Erro ao atualizar anotação. Tente novamente.");
      }
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteTitle: string): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      await notesApiService.deleteNote(noteTitle);
      setNotes((prev) => prev.filter((note) => note.title !== noteTitle));
      setSuccess("Anotação deletada com sucesso!");
      if (viewingNote?.title === noteTitle) {
        setIsViewDialogOpen(false);
        setViewingNote(null);
      }
      clearMessages();
    } catch (err) {
      console.error("Erro ao deletar anotação:", err);
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError("Anotação não encontrada.");
      } else {
        setError("Erro ao deletar anotação. Tente novamente.");
      }
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = async (note: NoteReadDTO): Promise<void> => {
    setIsViewDialogOpen(false);
    setEditingNote(note);
    setLoading(true);
    try {
      const fullNote = await notesApiService.getNoteContent(note.title);
      setCurrentNote({ ...fullNote });
      setIsEditDialogOpen(true);
    } catch (err) {
      console.error("Erro ao buscar conteúdo da anotação para edição:", err);
      setError("Erro ao carregar anotação para edição.");
      clearMessages();
      setCurrentNote({ ...note });
      setIsEditDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const openViewDialog = async (note: NoteReadDTO): Promise<void> => {
    setLoading(true);
    try {
      const fullNote = await notesApiService.getNoteContent(note.title);
      setViewingNote(fullNote);
      setIsViewDialogOpen(true);
    } catch (err) {
      console.error("Erro ao buscar conteúdo da anotação:", err);
      setError("Erro ao carregar anotação para visualização.");
      clearMessages();
      setViewingNote(note);
      setIsViewDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (): Promise<void> => {
    if (!searchTerm.trim()) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      const searchResults = await notesApiService.searchNotesByTitle(
        searchTerm
      );
      if (searchResults && searchResults.length > 0) {
        const notesPromises = searchResults.map((titleDto) =>
          notesApiService.getNoteContent(titleDto.title)
        );
        const fullNotes = await Promise.all(notesPromises);
        setNotes(fullNotes);
      } else {
        setNotes([]);
      }
    } catch (err) {
      console.error("Erro ao buscar anotações:", err);
      if (axios.isAxiosError(err) && err.response?.status === 204) {
        setNotes([]);
      } else {
        setError("Erro ao buscar anotações.");
        clearMessages();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (e: InputChangeEvent): void => {
    setCurrentNote((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleContentChange = (e: TextareaChangeEvent): void => {
    setCurrentNote((prev) => ({ ...prev, content: e.target.value }));
  };

  const handleSearchChange = (e: InputChangeEvent): void => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <StickyNote className="h-8 w-8 text-yellow-600" />
              <h1 className="text-3xl font-bold text-gray-800">Notes App</h1>
            </div>


            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-grow">
                <div className="relative flex-grow">
                  <Input
                    placeholder="Buscar anotações..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="bg-white shadow-sm w-full"
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={() => handleSearch()}
                  size="icon"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white flex-shrink-0"
                  disabled={loading}
                  aria-label="Pesquisar"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex-shrink-0 hidden md:block">
                <DialogTrigger asChild>
                  <Button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Nova Anotação
                  </Button>
                </DialogTrigger>
              </div>
            </div>
            <div className="mt-4">
              {error && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDesc className="text-red-800">{error}</AlertDesc>
                </Alert>
              )}
              {success && (
                <Alert className="mb-4 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDesc className="text-green-800">{success}</AlertDesc>
                </Alert>
              )}
            </div>
          </header>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Anotação</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para criar uma nova anotação.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Título da anotação"
                value={currentNote.title}
                onChange={handleTitleChange}
                disabled={loading}
              />
              <Textarea
                placeholder="Conteúdo da anotação"
                value={currentNote.content}
                onChange={handleContentChange}
                rows={6}
                disabled={loading}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateNote}
                  className="bg-yellow-500 hover:bg-yellow-600"
                  disabled={loading}
                >
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Criar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {loading && notes.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center gap-2 text-lg text-gray-600">
              <Loader2 className="h-6 w-6 animate-spin" />
              Carregando anotações...
            </div>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-16">
            <StickyNote className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm
                ? "Nenhuma anotação encontrada"
                : "Nenhuma anotação ainda"}
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Tente buscar por outros termos"
                : "Crie sua primeira anotação clicando no botão acima"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {notes.map((note) => (
              <Card
                key={note.id}
                onClick={() => openViewDialog(note)}
                className="bg-white hover:shadow-lg transition-all duration-200 border-l-4 border-l-yellow-400 cursor-pointer"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-1">
                    {note.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm line-clamp-4 mb-4 whitespace-pre-wrap">
                    {note.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {viewingNote && (
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {viewingNote.title}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Conteúdo completo da anotação {viewingNote.title}
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto pr-4">
                <p className="text-gray-700 whitespace-pre-wrap break-words">
                  {viewingNote.content}
                </p>
              </div>
              <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => openEditDialog(viewingNote)}
                  disabled={loading}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={loading}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Deletar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deletar Anotação</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja deletar a anotação "
                        {viewingNote.title}"? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={loading}>
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteNote(viewingNote.title)}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={loading}
                      >
                        {loading && (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        Deletar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {isEditDialogOpen && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Editar Anotação</DialogTitle>
                <DialogDescription>
                  Altere os campos que desejar e clique em salvar.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Título da anotação"
                  value={currentNote.title}
                  onChange={handleTitleChange}
                  disabled={loading}
                />
                <Textarea
                  placeholder="Conteúdo da anotação"
                  value={currentNote.content}
                  onChange={handleContentChange}
                  rows={6}
                  disabled={loading}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleUpdateNote}
                    className="bg-yellow-500 hover:bg-yellow-600"
                    disabled={loading}
                  >
                    {loading && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Salvar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg rounded-full fixed bottom-6 right-6 h-16 w-16 flex items-center justify-center md:hidden"
              disabled={loading}
              aria-label="Criar nova anotação"
            >
              <Plus className="h-8 w-8" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Anotação</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para criar uma nova anotação.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Título da anotação"
                value={currentNote.title}
                onChange={handleTitleChange}
                disabled={loading}
              />
              <Textarea
                placeholder="Conteúdo da anotação"
                value={currentNote.content}
                onChange={handleContentChange}
                rows={6}
                disabled={loading}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateNote}
                  className="bg-yellow-500 hover:bg-yellow-600"
                  disabled={loading}
                >
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Criar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default App;
