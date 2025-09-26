import { Icon, type IconifyIcon } from '@iconify/react';
import type { PropsWithChildren } from 'react';


export interface DashboardCardProps extends PropsWithChildren {
    iconName: IconifyIcon | string;
    title: string;
    content: string;
}

export default function DashboardCard(props: DashboardCardProps) {
  return (
    <div className="rounded-xl border border-gray-300 w-[300px] p-5 bg-white">
        <div className="bg-gray-100 w-max p-3 rounded-lg">
            <Icon icon={props.iconName} width={24} height={24} />
        </div>
        <h4 className='text-gray-500 text-sm mt-8'>{props.title}</h4>
        <div className='flex justify-between items-center'>
          <h2 className='text-black text-2xl font-bold mt-2 line-clamp-1'>{props.content}</h2>
          {props.children}
        </div>
    </div>
  )
}
