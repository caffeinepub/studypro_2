import { SubjectBadge } from "@/components/SubjectBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
import { useLibrary } from "@/hooks/useLibrary";
import { useStorageClient } from "@/hooks/useStorageClient";
import type { SubjectWithGeneral } from "@/types";
import { SUBJECTS_WITH_GENERAL } from "@/utils/helpers";
import { format } from "date-fns";
import {
  FileText,
  Filter,
  Loader2,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const FILE_ICONS: Record<string, string> = {
  pdf: "📄",
  jpg: "🖼️",
  jpeg: "🖼️",
  png: "🖼️",
  doc: "📝",
  docx: "📝",
  default: "📁",
};

function getFileIcon(fileType: string) {
  return FILE_ICONS[fileType.toLowerCase()] ?? FILE_ICONS.default;
}

export function StudyLibrary() {
  const { files, addFile, deleteFile } = useLibrary();
  const storageClient = useStorageClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<SubjectWithGeneral | "All">("All");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    subject: "General" as SubjectWithGeneral,
    description: "",
    selectedFile: null as File | null,
  });

  const filteredFiles = files.filter((f) => {
    const matchesSearch =
      search === "" ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || f.subject === filter;
    return matchesSearch && matchesFilter;
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((p) => ({
        ...p,
        selectedFile: file,
        name: p.name || file.name.replace(/\.[^.]+$/, ""),
      }));
    }
  };

  const handleSubmit = async () => {
    if (!form.selectedFile && !form.name.trim()) {
      toast.error("Please select a file or enter a name");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let fileKey = "";
      let fileType = "pdf";

      if (form.selectedFile) {
        fileType = form.selectedFile.name.split(".").pop() ?? "pdf";
        fileKey = await storageClient.uploadFile(form.selectedFile, (pct) =>
          setUploadProgress(pct),
        );
      }

      addFile({
        name: form.name || form.selectedFile?.name || "Unnamed",
        subject: form.subject,
        description: form.description,
        dateAdded: format(new Date(), "yyyy-MM-dd"),
        fileKey,
        fileType,
      });

      toast.success("File added to library");
      setSheetOpen(false);
      setForm({
        name: "",
        subject: "General",
        description: "",
        selectedFile: null,
      });
    } catch {
      toast.error("Upload failed. File saved without attachment.");
      addFile({
        name: form.name || "Unnamed",
        subject: form.subject,
        description: form.description,
        dateAdded: format(new Date(), "yyyy-MM-dd"),
        fileKey: "",
        fileType: "pdf",
      });
      setSheetOpen(false);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleOpenFile = (fileKey: string) => {
    if (!fileKey) {
      toast.info("No file attached");
      return;
    }
    try {
      const url = storageClient.getFileUrl(fileKey);
      window.open(url, "_blank");
    } catch {
      toast.error("Could not open file");
    }
  };

  return (
    <div data-ocid="library.page" className="space-y-4 pb-2">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-foreground">
          Study Library
        </h1>
        <Button
          data-ocid="library.upload_button"
          size="sm"
          onClick={() => setSheetOpen(true)}
          className="bg-[oklch(0.62_0.22_265)] text-white rounded-xl h-8 px-3 gap-1"
        >
          <Upload className="w-4 h-4" />
          Upload
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          data-ocid="library.search_input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search files..."
          className="pl-9 bg-[oklch(0.15_0.02_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
        />
      </div>

      {/* Filter tabs */}
      <div
        data-ocid="library.filter.tab"
        className="flex gap-1.5 overflow-x-auto scrollbar-hide"
      >
        {(["All", ...SUBJECTS_WITH_GENERAL] as const).map((sub) => (
          <button
            key={sub}
            type="button"
            onClick={() => setFilter(sub as SubjectWithGeneral | "All")}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filter === sub
                ? "bg-[oklch(0.62_0.22_265)] text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Files */}
      {filteredFiles.length === 0 ? (
        <div
          data-ocid="library.empty_state"
          className="glass-card rounded-2xl p-8 text-center"
        >
          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-sm text-muted-foreground">
            {search || filter !== "All" ? "No files found" : "No files yet"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Upload PDFs, notes, and documents
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredFiles.map((file, i) => (
              <motion.div
                key={file.id}
                data-ocid={`library.file.item.${i + 1}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card rounded-xl p-3"
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => handleOpenFile(file.fileKey)}
                    className="w-10 h-10 rounded-xl bg-[oklch(0.62_0.22_265/0.12)] border border-[oklch(0.62_0.22_265/0.2)] flex items-center justify-center flex-shrink-0 text-lg"
                  >
                    {getFileIcon(file.fileType)}
                  </button>
                  <button
                    type="button"
                    className="flex-1 min-w-0 text-left"
                    onClick={() => handleOpenFile(file.fileKey)}
                  >
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <SubjectBadge subject={file.subject} />
                      <span className="text-xs text-muted-foreground">
                        {file.dateAdded}
                      </span>
                    </div>
                    {file.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {file.description}
                      </p>
                    )}
                  </button>
                  <button
                    type="button"
                    data-ocid={`library.file.delete_button.${i + 1}`}
                    onClick={() => {
                      deleteFile(file.id);
                      toast.success("File removed");
                    }}
                    className="w-8 h-8 rounded-lg bg-[oklch(0.65_0.22_25/0.1)] flex items-center justify-center flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-[oklch(0.78_0.2_25)]" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="bottom"
          className="bg-[oklch(0.15_0.02_275)] border-[oklch(0.3_0.025_275)] rounded-t-3xl max-h-[90vh] overflow-y-auto"
        >
          <SheetHeader className="pb-4">
            <SheetTitle className="font-display text-foreground">
              Add to Library
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 pb-6">
            {/* File picker */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              data-ocid="library.dropzone"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-xl border-2 border-dashed border-[oklch(0.3_0.025_275)] p-6 text-center flex flex-col items-center gap-2 bg-[oklch(0.15_0.02_275/0.5)] transition-all active:bg-[oklch(0.2_0.025_275)]"
            >
              <Upload className="w-8 h-8 text-[oklch(0.62_0.22_265)]" />
              {form.selectedFile ? (
                <p className="text-sm text-[oklch(0.78_0.18_265)] font-medium">
                  {form.selectedFile.name}
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Tap to select file
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOC, Images supported
                  </p>
                </>
              )}
            </button>

            {uploading && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-1.5" />
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">File Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="OSSSC RI Previous Papers"
                className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Subject</Label>
              <Select
                value={form.subject}
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    subject: v as SubjectWithGeneral,
                  }))
                }
              >
                <SelectTrigger className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[oklch(0.18_0.022_275)] border-[oklch(0.3_0.025_275)]">
                  {SUBJECTS_WITH_GENERAL.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
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
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Short description..."
                rows={2}
                className="bg-[oklch(0.2_0.025_275)] border-[oklch(0.3_0.025_275)] rounded-xl resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setSheetOpen(false)}
                disabled={uploading}
                className="flex-1 rounded-xl border-[oklch(0.3_0.025_275)]"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={uploading}
                className="flex-1 rounded-xl bg-[oklch(0.62_0.22_265)] text-white"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Filter className="w-4 h-4 mr-1" />
                    Add File
                  </>
                )}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
