import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import Link from 'next/link';

// FOR IN-COMPONENT ACTIONS (LIKE IN A DRAWER)
interface ActionHandlers {
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export const createActionsColumn = <T extends Record<string, any>>(
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row.index)}
          title="Sil"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    ),
  };
};

// FOR PAGE NAVIGATION ACTIONS (MAIN LISTING TABLES)
interface UrlActionProps {
  viewUrlPrefix?: string;
  editUrlPrefix?: string;
}

export const createUrlActionsColumn = <T extends { id: any; }>({
  viewUrlPrefix,
  editUrlPrefix,
}: UrlActionProps): ColumnDef<T> => {
  return {
    id: "actions",
    header: "İşlemler",
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        {viewUrlPrefix && (
          <Link href={`${viewUrlPrefix}/${row.original.id}`}>
            <Button variant="ghost" size="icon" title="Görüntüle">
              <EyeIcon className="h-4 w-4" />
            </Button>
          </Link>
        )}
        {editUrlPrefix && (
          <Link href={`${editUrlPrefix}/${row.original.id}/edit`}>
            <Button variant="ghost" size="icon" title="Düzenle">
              <PencilIcon className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    ),
  };
};
