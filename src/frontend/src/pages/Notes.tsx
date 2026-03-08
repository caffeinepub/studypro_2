import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useNotes } from "@/hooks/useNotes";
import type { Note } from "@/types";
import { NOTE_CATEGORIES } from "@/utils/helpers";
import { format } from "date-fns";
import { Edit2, Plus, Search, StickyNote, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

type Category = Note["category"] | "All";

const CATEGORY_COLORS: Record<Note["category"], string> = {
  Study:
    "bg-[oklch(0.62_0.22_265/0.15)] text-[oklch(0.78_0.18_265)] border-[oklch(0.62_0.22_265/0.3)]",
  Personal:
    "bg-[oklch(0.72_0.2_320/0.15)] text-[oklch(0.78_0.18_320)] border-[oklch(0.72_0.2_320/0.3)]",
  Work: "bg-[oklch(0.68_0.18_155/0.15)] text-[oklch(0.78_0.18_155)] border-[oklch(0.68_0.18_155/0.3)]",
  Ideas:
    "bg-[oklch(0.75_0.18_65/0.15)] text-[oklch(0.82_0.16_65)] border-[oklch(0.75_0.18_65/0.3)]",
};

const defaultForm = {
  title: "",
  category: "Study" as Note["category"],
  description: "",
  date: format(new Date(), "yyyy-MM-dd"),
};

export function Notes() {
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Category>("All");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = notes.filter((n) => {
    const matchSearch =
      search === "" ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || n.category === filter;
    return matchSearch && matchFilter;
  });

  const openAdd = () => {
    setEditId(null);
    setForm(defaultForm);
    setSheetOpen(true);
  };

  const openEdit = (note: Note) => {
    setEditId(note.id);
    setForm({
      title: note.title,
      category: note.category,
      description: note.description,
      date: note.date,
    });
    setSheetOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (editId) {
      updateNote(editId, form);
      toast.success("Note updated");
    } else {
      addNote(form);
      toast.success("Note added");
    }
    setSheetOpen(false);
  };

  return (
    <div data-ocid="notes.page" className="space-y-4 pb-2">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-foreground">
          Notes
        </h1>
        <Button
          data-ocid="notes.add_button"
          size="sm"
          onClick={openAdd}
          className="bg-[oklch(0.62_0.22_265)] text-white rounded-xl h-8 px-3 gap-1"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="pl-9 bg-[oklch(0.15_0.02_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
        />
      </div>

      {/* Filter */}
      <div
        data-ocid="notes.filter.tab"
        className="flex gap-1.5 overflow-x-auto scrollbar-hide"
      >
        {(["All", ...NOTE_CATEGORIES] as Category[]).map((cat) => (
          <button
            type="button"
            key={cat}
            onClick={() => setFilter(cat)}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filter === cat
                ? "bg-[oklch(0.62_0.22_265)] text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notes */}
      {filtered.length === 0 ? (
        <div
          data-ocid="notes.empty_state"
          className="glass-card rounded-2xl p-8 text-center"
        >
          <StickyNote className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-sm text-muted-foreground">No notes found</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((note, i) => (
              <motion.div
                key={note.id}
                data-ocid={`notes.note.item.${i + 1}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium border ${CATEGORY_COLORS[note.category]}`}
                      >
                        {note.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {note.date}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(expandedId === note.id ? null : note.id)
                      }
                      className="text-left w-full"
                    >
                      <h3 className="text-sm font-semibold text-foreground">
                        {note.title}
                      </h3>
                      <p
                        className={`text-xs text-muted-foreground mt-1 ${
                          expandedId === note.id ? "" : "line-clamp-2"
                        }`}
                      >
                        {note.description}
                      </p>
                    </button>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      type="button"
                      data-ocid={`notes.edit_button.${i + 1}`}
                      onClick={() => openEdit(note)}
                      className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button
                      type="button"
                      data-ocid={`notes.delete_button.${i + 1}`}
                      onClick={() => {
                        deleteNote(note.id);
                        toast.success("Note deleted");
                      }}
                      className="w-8 h-8 rounded-lg bg-[oklch(0.65_0.22_25/0.1)] flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-[oklch(0.78_0.2_25)]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="bottom"
          className="bg-[oklch(0.15_0.02_275)] border-[oklch(0.3_0.025_275)] rounded-t-3xl max-h-[90vh] overflow-y-auto"
        >
          <SheetHeader className="pb-4">
            <SheetTitle className="font-display text-foreground">
              {editId ? "Edit Note" : "Add Note"}
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 pb-6">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Title</Label>
              <Input
                data-ocid="notes.title.input"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Note title"
                className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, category: v as Note["category"] }))
                }
              >
                <SelectTrigger
                  data-ocid="notes.category.select"
                  className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[oklch(0.18_0.022_275)] border-[oklch(0.3_0.025_275)]">
                  {NOTE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Description
              </Label>
              <Textarea
                data-ocid="notes.description.textarea"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Write your note here..."
                rows={5}
                className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Date</Label>
              <Input
                data-ocid="notes.date.input"
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
                className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setSheetOpen(false)}
                className="flex-1 rounded-xl border-[oklch(0.3_0.025_275)]"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button
                data-ocid="notes.submit_button"
                onClick={handleSubmit}
                className="flex-1 rounded-xl bg-[oklch(0.62_0.22_265)] text-white"
              >
                {editId ? "Update" : "Add Note"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
