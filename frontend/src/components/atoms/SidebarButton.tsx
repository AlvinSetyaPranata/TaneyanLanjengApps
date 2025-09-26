import { Icon } from "@iconify/react";
import type { IconifyIcon } from '@iconify/react';



export interface SidebarButtonProps {
    text: string;
    iconName: IconifyIcon | string;
    onClick?: () => void;
    isActive?: boolean;
}


export default function SidebarButton(props: SidebarButtonProps) {
  
  return (
    <button className={`flex gap-2 items-center bg-black text-white hover:bg-gray-300/20 rounded-md  w-full p-2 font-normal hover:cursor-pointer text-sm`} onClick={props.onClick}>
        <Icon icon={props.iconName} width={20} height={20} />
        <p>{props.text}</p>
    </button>
  )
}
