import { Icon } from "@iconify/react";
import type { IconifyIcon } from '@iconify/react';
import { useNavigate } from "react-router-dom";



export interface SidebarButtonProps {
    text: string;
    iconName: IconifyIcon | string;
    isActive?: boolean;
    url: string;
}


export default function SidebarButton(props: SidebarButtonProps) {

  const navigate = useNavigate()
  
  return (
    <button onClick={() => navigate(props.url)} className={`flex gap-2 items-center bg-black text-white hover:bg-gray-300/20 rounded-md  w-full p-2 font-normal hover:cursor-pointer text-sm`} >
        <Icon icon={props.iconName} width={20} height={20} />
        <h3 className="font-[Poppins]">{props.text}</h3>
    </button>
  )
}
