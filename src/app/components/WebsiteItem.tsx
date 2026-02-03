import { useDrag } from "react-dnd";

interface WebsiteItemProps {
  id: string;
  title: string;
  url: string;
  onDelete: (id: string) => void;
}

export function WebsiteItem({ id, title, url }: WebsiteItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'website',
    item: { id, title, url },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const getFaviconUrl = (websiteUrl: string) => {
    try {
      const domain = new URL(websiteUrl).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return "";
    }
  };

  return (
    <div 
      ref={drag}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-grab"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-3 flex-1 min-w-0 hover:text-blue-400 transition-colors text-gray-200"
      >
        <img 
          src={getFaviconUrl(url)} 
          alt={`${title} icon`}
          className="size-5 flex-shrink-0"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <span className="truncate">{title}</span>
      </a>
    </div>
  );
}