import { Plus, Trash2 } from "lucide-react";
import { WebsiteItem } from "@/app/components/WebsiteItem";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { useDrag, useDrop } from "react-dnd";

export interface Website {
  id: string;
  title: string;
  url: string;
  description?: string;
}

interface CategoryCardProps {
  category: string;
  websites: Website[];
  index: number;
  onAddWebsite: (category: string) => void;
  onDeleteWebsite: (id: string, category: string) => void;
  onMoveCard: (dragIndex: number, hoverIndex: number) => void;
  isWebsiteDragging: boolean;
}

export function CategoryCard({ 
  category, 
  websites, 
  index,
  onAddWebsite, 
  onDeleteWebsite,
  onMoveCard,
  isWebsiteDragging
}: CategoryCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'category',
    item: { category, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver: isWebsiteOver }, dropWebsite] = useDrop(() => ({
    accept: 'website',
    drop: (item: { id: string }) => {
      onDeleteWebsite(item.id, category);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: 'category',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMoveCard(item.index, index);
        item.index = index;
      }
    },
  }));

  return (
    <div 
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}
    >
      <Card className="p-6 hover:shadow-xl transition-all bg-white/5 backdrop-blur-sm border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 flex-1">
            <svg
              className="size-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-white">{category}</h2>
            <span className="text-sm text-gray-400">({websites.length})</span>
          </div>
          <div ref={dropWebsite}>
            <Button
              onClick={() => !isWebsiteDragging && onAddWebsite(category)}
              size="sm"
              variant="outline"
              className={`border-white/20 transition-all ${
                isWebsiteDragging
                  ? 'bg-red-500/20 border-red-500 hover:bg-red-500/30'
                  : 'hover:bg-white/10'
              } ${isWebsiteOver ? 'scale-110 bg-red-500/30' : ''}`}
            >
              {isWebsiteDragging ? (
                <Trash2 className="size-4 text-red-400" />
              ) : (
                <Plus className="size-4 text-gray-300" />
              )}
            </Button>
          </div>
        </div>
        <div className="space-y-1">
          {websites.length === 0 ? (
            <p className="text-gray-500 italic text-sm py-4 text-center">No websites yet</p>
          ) : (
            websites.map((website) => (
              <WebsiteItem
                key={website.id}
                id={website.id}
                title={website.title}
                url={website.url}
                onDelete={onDeleteWebsite}
              />
            ))
          )}
        </div>
      </Card>
    </div>
  );
}