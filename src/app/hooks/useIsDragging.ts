import { useDragLayer } from "react-dnd";

export function useIsDragging() {
  const { isDragging, itemType } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    itemType: monitor.getItemType(),
  }));

  return {
    isWebsiteDragging: isDragging && itemType === 'website',
    isCategoryDragging: isDragging && itemType === 'category',
  };
}
