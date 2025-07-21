### `GPSTab.tsx` Architecture and Pattern Documentation

This component is designed to manage a nested array of GPS records within a parent form using a clean, dialog-based user interface.

#### 1. State Management

The component relies on a combination of `react-hook-form` for data and local `useState` for UI control.

*   **`useFieldArray`**: This is the core hook from `react-hook-form` for managing the `gps` data array.
    *   `fields`: An array containing the current GPS records. This is the single source of truth for the data displayed in the table.
    *   `append`: A function to add a new, empty record to the `fields` array.
    *   `remove`: A function to delete a record from the `fields` array at a specific index.

*   **Local State (`useState`)**: This state is used exclusively for managing the UI and user interactions, not the form data itself.
    *   `isDialogOpen`: A boolean that controls whether the Add/Edit dialog is open or closed.
    *   `dialogMode`: A state (`'add'` or `'edit'`) that determines the dialog's title and behavior.
    *   `selectedGpsIndex`: Stores the array index of the item currently being edited or targeted for deletion. This is crucial for ensuring actions apply to the correct record.
    *   `isDeleteAlertOpen`: A boolean that controls the visibility of the "Are you sure?" confirmation dialog for deletions.

#### 2. Core Logic and Handlers

The functions in this component orchestrate the entire CRUD (Create, Read, Update, Delete) workflow.

*   **`openDialog(mode, index)`**: This function opens the form dialog.
    *   **In 'add' mode**: It first calls `append(NEW_GPS_RECORD)` to add a blank record to the form state, then sets `selectedGpsIndex` to the index of this new record.
    *   **In 'edit' mode**: It sets `selectedGpsIndex` to the index of the row the user clicked.
    *   Finally, it sets `isDialogOpen` to `true`.

*   **`closeDialog()`**: This function handles closing the form dialog gracefully.
    *   **Cleanup Logic**: If the dialog was in 'add' mode and the user cancels, it removes the newly appended (but unsaved) record. This prevents empty, orphaned records.
    *   It resets all dialog-related state (`isDialogOpen`, `dialogMode`, `selectedGpsIndex`) to their default `null` or `false` values.

*   **`handleSave()`**: This function is called when the user clicks "Save" in the dialog.
    *   **Targeted Validation**: It uses `trigger(`gps.${selectedGpsIndex}`)` to run validation *only* on the fields of the record being edited. This is more efficient than validating the entire form.
    *   If validation passes, it simply closes the dialog. The data is already up-to-date in the central form state thanks to `react-hook-form`.

*   **`handleDelete(index)` & `confirmDelete()`**: Deletion is a safe, two-step process.
    1.  `handleDelete` is called first. It sets the `selectedGpsIndex` and opens the `AlertDialog` for confirmation.
    2.  `confirmDelete` is called only if the user confirms. It uses `remove(selectedGpsIndex)` to delete the record and then resets the state.

#### 3. Rendering and UI (JSX)

The component's structure is clean and conditionally renders UI elements based on the state.

1.  **Header**: A flex container holds the section title and the "Yeni GPS Ekle" button.
2.  **Table Container**:
    *   A wrapper `div` with `min-h-[300px]` and other flex/border styles is crucial. **This is the fix for the layout bug**; it ensures the table area has a defined minimum height and doesn't collapse.
    *   **Conditional Rendering**:
        *   If `fields.length > 0`, it renders the `GPSTable` component.
        *   If `fields.length === 0`, it renders a user-friendly "empty state" message.
3.  **Dialogs**:
    *   **Add/Edit `Dialog`**: Its visibility is controlled by `isDialogOpen`. It contains the `GPSForm` and the "Save"/"Cancel" buttons. The title changes dynamically based on `dialogMode`.
    *   **Delete `AlertDialog`**: Its visibility is controlled by `isDeleteAlertOpen` and provides the confirmation step for deletions.

### How to Apply This Pattern to Other Tabs

You can replicate this robust pattern in other tabs (like HGS or any future modules) by following these steps:

1.  **Create `*Constants.ts`**: Define the data `type` (e.g., `Hgs`), UI messages, and a `NEW_*_RECORD` default object for the new module.
2.  **Create `*Form.tsx`**: Build the form component for editing a single record (e.g., `HGSForm`).
3.  **Create `*Table.tsx`**: Build the table component to display the list of records (e.g., `HGSTable`).
4.  **Implement the `*Tab.tsx` Orchestrator**:
    *   Copy the structure and logic from `GPSTab.tsx`.
    *   Replace all instances of "Gps" with the new module's name (e.g., "Hgs").
    *   Update the `useFieldArray` hook to point to the correct field name in your main form schema (e.g., `name: 'hgs'`).
    *   Ensure the `*Table` is wrapped in the same styled `div` to prevent the layout bug.

By following this blueprint, you can quickly and consistently build out new sections of your application with a modern, reliable, and user-friendly design.
