import { Icon } from "@iconify/react";
import { useState } from "react";

export type DropdownItemType = {
  title: string;
  url: string;
  isFinished: boolean;
  children?: DropdownItemType[];
};

export interface DropdownProps {
  title: string;
  items: DropdownItemType[];
  progress?: string;
}

export default function Dropdown(props: DropdownProps) {
  const [dropdownState, setDropdownState] = useState(false);

  const allItemsFinished = (items: DropdownItemType[]): boolean => {
    return items.every((item) => {
      const childrenFinished = item.children ? allItemsFinished(item.children) : true;
      return item.isFinished && childrenFinished;
    });
  };

  const hasItems = props.items && props.items.length > 0;

  return (
    <div className="w-full">
      <button
        className="flex gap-x-4 items-center hover:cursor-pointer w-full"
        onClick={() => hasItems && setDropdownState((state) => !state)}
      >
        {hasItems ? (
          <Icon
            icon="tabler:chevron-down"
            className={`text-gray-500 text-sm ${
              dropdownState
                ? "rotate-180 duration-300 ease-in"
                : "rotate-0 duration-300 ease-in"
            }`}
          />
        ) : (
          <div className="w-4"></div>
        )}
        <div className="flex-1 flex justify-between items-center">
          <h2 className="font-semibold text-left">{props.title}</h2>
          <div className="flex items-center gap-x-2">
            {props.progress && <span className="text-sm text-gray-600">{props.progress}</span>}
            {allItemsFinished(props.items) ? (
              <div className="p-[1px] bg-green-600 rounded-full">
                <Icon
                  icon="material-symbols:check-rounded"
                  className="text-white"
                />
              </div>
            ) : (
              <div className="size-[15px] bg-white border border-green-600 rounded-full"></div>
            )}
          </div>
        </div>
      </button>

      {/* Dropdown Items */}
      {dropdownState && hasItems && (
        <div className="flex mt-2">
          <div className="w-4 flex justify-center">
            <div className="w-0.5 bg-gray-200 h-full"></div>
          </div>
          <div className="flex-1 flex flex-col gap-y-2">
            {props.items.map((item, index) => (
              <DropdownItem key={index} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Dropdown Item Component for nested items
function DropdownItem({ item }: { item: DropdownItemType }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="w-full">
      <div className="flex items-center gap-x-2 py-2">
        {/* Chevron or Dot */}
        {hasChildren ? (
          <button
            onClick={() => setIsExpanded((state) => !state)}
            className="w-4 h-6 flex items-center justify-center flex-shrink-0"
          >
            <Icon
              icon="tabler:chevron-down"
              className={`text-gray-500 text-sm ${
                isExpanded
                  ? "rotate-180 duration-300 ease-in"
                  : "rotate-0 duration-300 ease-in"
              }`}
            />
          </button>
        ) : (
          <div className="w-4 h-6 flex items-center justify-center flex-shrink-0">
            <div className="size-1.5 bg-gray-400 rounded-full"></div>
          </div>
        )}

        {/* Item Content */}
        <div className="flex-1 flex justify-between items-center">
          <a
            href={item.url}
            className="text-gray-700 hover:text-black transition-colors"
          >
            {item.title}
          </a>
          {item.isFinished && (
            <div className="p-[1px] bg-green-600 rounded-full">
              <Icon
                icon="material-symbols:check-rounded"
                className="text-white text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Nested Children */}
      {hasChildren && isExpanded && (
        <div className="flex mt-2">
          <div className="w-4 flex justify-center">
            <div className="w-0.5 bg-gray-200 h-full"></div>
          </div>
          <div className="flex-1 flex flex-col gap-y-2">
            {item.children!.map((child, index) => (
              <DropdownItem key={index} item={child} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
