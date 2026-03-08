import { format } from "date-fns";
import { useCallback } from "react";
import type { LibraryFile } from "../types";
import { useLocalStorage } from "./useLocalStorage";

const today = format(new Date(), "yyyy-MM-dd");

const SEED_LIBRARY: LibraryFile[] = [
  {
    id: "lib-1",
    name: "OSSSC RI Previous Year Papers 2023",
    subject: "General",
    description: "Previous year question papers with answers",
    dateAdded: today,
    fileKey: "",
    fileType: "pdf",
  },
  {
    id: "lib-2",
    name: "Odia Grammar Complete Guide",
    subject: "Odia",
    description: "Comprehensive Odia grammar book covering all topics",
    dateAdded: today,
    fileKey: "",
    fileType: "pdf",
  },
  {
    id: "lib-3",
    name: "Quantitative Aptitude by R.S. Aggarwal",
    subject: "Math",
    description: "Standard reference book for math preparation",
    dateAdded: today,
    fileKey: "",
    fileType: "pdf",
  },
  {
    id: "lib-4",
    name: "Reasoning Notes - Shortcuts",
    subject: "Reasoning",
    description: "Quick shortcuts and tricks for reasoning questions",
    dateAdded: today,
    fileKey: "",
    fileType: "pdf",
  },
];

export function useLibrary() {
  const [files, setFiles] = useLocalStorage<LibraryFile[]>(
    "studypro_library",
    SEED_LIBRARY,
  );

  const addFile = useCallback(
    (file: Omit<LibraryFile, "id">) => {
      const newFile: LibraryFile = {
        ...file,
        id: `lib-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      };
      setFiles((prev) => [newFile, ...prev]);
    },
    [setFiles],
  );

  const deleteFile = useCallback(
    (id: string) => {
      setFiles((prev) => prev.filter((f) => f.id !== id));
    },
    [setFiles],
  );

  return { files, addFile, deleteFile };
}
