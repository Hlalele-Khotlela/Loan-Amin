// src/components/EditableList.tsx
import React from "react";

type EditableListProps<T> = {
  items: T[];
  getKey: (item: T) => string | number;
  renderItem: (item: T) => React.ReactNode;
  onEdit: (item: T) => void;
  onDelete: (id: string | number) => void;
};

export function EditableList<T>({
  items,
  getKey,
  renderItem,
  onEdit,
  onDelete,
}: EditableListProps<T>) {

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={getKey(item)}
          className="flex justify-between items-center border-b pb-2"
        >
          <span>{renderItem(item)}</span>
          <div className="space-x-2">
            <button
              onClick={() => onEdit(item)}
              className="px-2 py-1 bg-blue-500 text-white rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(getKey(item))}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
