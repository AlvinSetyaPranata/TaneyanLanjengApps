import SidebarButton from "../atoms/SidebarButton";


export interface SidebarProps {
  isExpanded: boolean
}

export default function Sidebar(props: SidebarProps) {
  return (
    <div className={`${props.isExpanded ? "w-[250px]" : "w-0"} duration-500 ease-in bg-black text-white min-h-screen h-full py-6 overflow-x-hidden`}>
        <h1 className="text-center text-lg font-semibold text-[Poppins]">TaneyanLanjeng</h1>
        <div className="py-20 px-2 flex flex-col gap-8">
          <SidebarButton url="/"  text="Home" iconName="ic:round-home"/>
          <SidebarButton url="/modules"  text="Daftar Modul" iconName="streamline-plump:module-solid"/>
        </div>
    </div>
  )
}
