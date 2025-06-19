import { RowSelectionState } from "@tanstack/react-table";
import { MouseEvent } from "react";

/**
 * Gelişmiş satır seçimi için helper fonksiyonlar
 * Bu modül şunları sağlar:
 * - Shift+Click ile aralık seçimi
 * - Ctrl/Cmd+Click ile çoklu seçim
 */

export interface KeyboardSelectionParams<T> {
  // Seçili satırlar
  rowSelection: RowSelectionState;
  // Seçimi güncelleyecek fonksiyon
  setRowSelection: (value: RowSelectionState) => void;
  // Tüm satırların ID listesi
  allRowIds: string[];
  // Son seçilen satırın indeksi
  lastSelectedIndex: React.MutableRefObject<number | null>;
}

/**
 * Klavye kısayollarıyla gelişmiş satır seçimi yapan fonksiyon
 */
export function handleRowSelectionWithKeys<T>({
  rowSelection,
  setRowSelection,
  allRowIds,
  lastSelectedIndex,
}: KeyboardSelectionParams<T>) {
  return (e: MouseEvent<HTMLElement>, rowId: string) => {
    e.preventDefault();
    
    // Tıklanan satırın indeksi
    const clickedIndex = allRowIds.indexOf(rowId);
    const isSelected = !!rowSelection[rowId];
    
    // Shift+Click: Aralık seçimi
    if (e.shiftKey && lastSelectedIndex.current !== null) {
      const newSelection = { ...rowSelection };
      
      // Başlangıç ve bitiş indeksleri
      const start = Math.min(lastSelectedIndex.current, clickedIndex);
      const end = Math.max(lastSelectedIndex.current, clickedIndex);
      
      // Aralıktaki tüm satırları seç
      for (let i = start; i <= end; i++) {
        newSelection[allRowIds[i]] = true;
      }
      
      setRowSelection(newSelection);
      lastSelectedIndex.current = clickedIndex;
      return;
    }
    
    // Ctrl/Cmd+Click: Seçim ekle/çıkar
    if (e.ctrlKey || e.metaKey) {
      setRowSelection({
        ...rowSelection,
        [rowId]: !isSelected,
      });
      lastSelectedIndex.current = clickedIndex;
      return;
    }
    
    // Normal tıklama: Sadece bu satırı seç
    setRowSelection({
      [rowId]: !isSelected,
    });
    lastSelectedIndex.current = clickedIndex;
  };
}
