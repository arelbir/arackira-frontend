import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";

interface ActionHandlers {
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export const createActionsColumn = <T extends { id?: any; }>(
  { onEdit, onDelete }: ActionHandlers
): ColumnDef<T> => {
  return {
    id: "actions",
    header: "İşlemler",
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        <Button variant="ghost" size="icon" onClick={() => onEdit(row.index)} title="Düzenle">
          <PencilIcon className="h-4 w-4" />
        </Button>
        {!row.original.id && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(row.index)}
            title="Sil"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    ),
  };
};
