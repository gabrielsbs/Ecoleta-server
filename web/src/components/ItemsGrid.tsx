import React from "react";
import { Item } from "../models/points.models";

export interface ItemsGridProps {
  items: Item[];
  handleItemClick: (id: number) => void;
  hasItemBeenSelected: (id: number) => boolean;
}

const ItemsGrid = ({
  items,
  handleItemClick,
  hasItemBeenSelected,
}: ItemsGridProps) => {
  return (
    <ul className="items-grid">
      {items.map((item) => {
        return (
          <li
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={hasItemBeenSelected(item.id) ? "selected" : ""}
          >
            <img src={item.image_url} alt={item.title} />
            <span>{item.title}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default ItemsGrid;
