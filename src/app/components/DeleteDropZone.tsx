import { useDrop } from "react-dnd";
import { Trash2 } from "lucide-react";

interface DeleteDropZoneProps {
  onDrop: (category: string) => void;
}

export function DeleteDropZone({ onDrop }: DeleteDropZoneProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'category',
    drop: (item: { category: string }) => {
      onDrop(item.category);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`fixed bottom-0 left-0 right-0 h-24 flex items-center justify-center z-50 transition-colors ${
        isOver ? 'bg-red-500/90' : 'bg-red-500/70'
      } backdrop-blur-sm`}
    >
      <div className="flex flex-col items-center gap-2 text-white">
        <Trash2 className={`size-10 transition-transform ${isOver ? 'scale-125' : 'scale-100'}`} />
        <p className="font-medium">Drop here to delete category</p>
      </div>
    </div>
  );
}