import { useState } from "react";
import { CategoryCard, Website } from "@/app/components/CategoryCard";
import { AddWebsiteDialog } from "@/app/components/AddWebsiteDialog";
import { AddCategoryDialog } from "@/app/components/AddCategoryDialog";
import { DeleteDropZone } from "@/app/components/DeleteDropZone";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Library, Plus, Search } from "lucide-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useIsDragging } from "@/app/hooks/useIsDragging";

interface WebsiteLibrary {
  [category: string]: Website[];
}

const initialLibrary: WebsiteLibrary = {
  "Development": [
    {
      id: "1",
      title: "GitHub",
      url: "https://github.com",
      description: "Version control and collaboration platform for developers"
    },
    {
      id: "2",
      title: "Stack Overflow",
      url: "https://stackoverflow.com",
      description: "Q&A community for programmers"
    },
    {
      id: "3",
      title: "MDN Web Docs",
      url: "https://developer.mozilla.org",
      description: "Comprehensive web development documentation"
    }
  ],
  "Design": [
    {
      id: "4",
      title: "Figma",
      url: "https://figma.com",
      description: "Collaborative interface design tool"
    },
    {
      id: "5",
      title: "Dribbble",
      url: "https://dribbble.com",
      description: "Design inspiration and portfolio showcase"
    }
  ],
  "Productivity": [
    {
      id: "6",
      title: "Notion",
      url: "https://notion.so",
      description: "All-in-one workspace for notes and collaboration"
    },
    {
      id: "7",
      title: "Trello",
      url: "https://trello.com",
      description: "Visual project management boards"
    }
  ],
  "Learning": [
    {
      id: "8",
      title: "Coursera",
      url: "https://coursera.org",
      description: "Online courses from top universities"
    }
  ]
};

function AppContent() {
  const { isWebsiteDragging, isCategoryDragging } = useIsDragging();
  const [library, setLibrary] = useState<WebsiteLibrary>(initialLibrary);
  const [categories, setCategories] = useState<string[]>(Object.keys(initialLibrary));
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleAddWebsite = (category: string) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleAddNewWebsite = (website: { title: string; url: string; description: string; category: string }) => {
    setLibrary((prev) => ({
      ...prev,
      [website.category]: [
        ...(prev[website.category] || []),
        {
          id: Date.now().toString(),
          title: website.title,
          url: website.url,
          description: website.description
        }
      ]
    }));
  };

  const handleDeleteWebsite = (id: string, category: string) => {
    setLibrary((prev) => {
      const newLibrary = { ...prev };
      newLibrary[category] = newLibrary[category].filter((site) => site.id !== id);
      return newLibrary;
    });
  };

  const handleDeleteCategory = (category: string) => {
    setLibrary((prev) => {
      const newLibrary = { ...prev };
      delete newLibrary[category];
      return newLibrary;
    });
    setCategories((prev) => prev.filter((cat) => cat !== category));
  };

  const handleAddCategory = (categoryName: string) => {
    if (categoryName && !library[categoryName]) {
      setLibrary((prev) => ({
        ...prev,
        [categoryName]: []
      }));
      setCategories((prev) => [...prev, categoryName]);
    }
  };

  const handleMoveCard = (dragIndex: number, hoverIndex: number) => {
    setCategories((prev) => {
      const newCategories = [...prev];
      const [removed] = newCategories.splice(dragIndex, 1);
      newCategories.splice(hoverIndex, 0, removed);
      return newCategories;
    });
  };

  const filteredCategories = categories.filter((category) => {
    if (!searchQuery) return true;
    const websites = library[category] || [];
    const categoryMatch = category.toLowerCase().includes(searchQuery.toLowerCase());
    const websiteMatch = websites.some(
      (site) =>
        site.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return categoryMatch || websiteMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Library className="size-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-white tracking-wider">RESOURCES DATABASE</h1>
            </div>
            <div className="flex items-center gap-3 flex-1 justify-end max-w-2xl">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
              </div>
              <Button
                onClick={() => setCategoryDialogOpen(true)}
                size="icon"
                variant="outline"
                className="border-white/20 hover:bg-white/10 text-gray-300"
              >
                <Plus className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No categories or websites found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category, index) => (
              <CategoryCard
                key={category}
                category={category}
                websites={library[category] || []}
                index={index}
                onAddWebsite={handleAddWebsite}
                onDeleteWebsite={handleDeleteWebsite}
                onMoveCard={handleMoveCard}
                isWebsiteDragging={isWebsiteDragging}
              />
            ))}
          </div>
        )}
      </main>

      {isCategoryDragging && <DeleteDropZone onDrop={handleDeleteCategory} />}

      <AddWebsiteDialog
        open={dialogOpen}
        category={selectedCategory}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAddNewWebsite}
      />

      <AddCategoryDialog
        open={categoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
        onAdd={handleAddCategory}
      />
    </div>
  );
}

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AppContent />
    </DndProvider>
  );
}
