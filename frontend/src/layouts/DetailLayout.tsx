import { Icon } from '@iconify/react';
import { type PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom';


interface DetailLayoutProps extends PropsWithChildren {
  title: string;
  backUrl?: string; // Optional custom back URL
}


export default function DetailLayout(props: DetailLayoutProps) {

  const navigation = useNavigate()

  const handleBack = () => {
    if (props.backUrl) {
      navigation(props.backUrl);
    } else {
      navigation(-1);
    }
  };

  return (
    <>
        {/* heading */}
        <div className='flex justify-between items-center py-6 px-12 border-b border-gray-300'>
          <div className='flex items-center gap-x-4'>
            <button onClick={handleBack} className='hover:cursor-pointer'>
              <Icon icon="fluent:arrow-left-12-filled" className="text-lg"/>
            </button>
            <h1 className='font-semibold'>{props.title}</h1>
          </div>
        </div>  

          {props.children} 

    </>
  )
}
