import SidebarButton from "../atoms/SidebarButton";


export interface SidebarProps {
  isExpanded: boolean
}

export default function Sidebar(props: SidebarProps) {
  return (
    <div className={`${
      props.isExpanded ? "w-[250px]" : "w-0"
    } duration-500 ease-in bg-black text-white h-screen flex-shrink-0 flex flex-col overflow-hidden`}>
      {/* Sidebar Header - Fixed */}
      <div className="flex-shrink-0 py-6">
        <h1 className="text-center text-lg font-semibold text-[Poppins]">TaneyanLanjeng</h1>
      </div>
      
      {/* Sidebar Content - Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2">
        <div className="py-20 flex flex-col gap-8">
          <SidebarButton url="/" text="Home" iconName="ic:round-home"/>
          <SidebarButton url="/modules" text="Daftar Modul" iconName="streamline-plump:module-solid"/>
        </div>
      </div>
    </div>
  )
}
