import { Icon } from "@iconify/react";
import { useState } from "react";

type DropdownItemType = {
    title: string;
    url: string;
    isFinished: boolean;
}

export interface DropdownProps {
    title: string;
    items: DropdownItemType[];
}

export default function Dropdown(props: DropdownProps) {

    const [dropdownState, setDropdownState] = useState(false)

  return (
    <button className="flex gap-x-4 items-center hover:cursor-pointer" onClick={() => setDropdownState(state => !state)}>
        <Icon icon="tabler:chevron-down" className={`text-gray-500 text-sm ${dropdownState ? 'rotate-180 duration-300 ease-in' : 'rotate-0 duration-300 ease-in'}`} />
        <div className="flex-1 flex justify-between items-center ">
            <h2 className="font-semibold">{props.title}</h2>
            <div className="p-[1px] bg-green-600 rounded-full">
                <Icon icon="material-symbols:check-rounded" className="text-white"/>
            </div>
        </div>
    </button>
  )
}
