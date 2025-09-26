import SidebarButton from "../atoms/SidebarButton";

export default function Sidebar() {
  return (
    <div className="w-[250px] bg-black text-white min-h-screen py-6">
        <h1 className="text-center text-lg font-semibold">TaneyanLanjeng</h1>
        <div className="py-12 px-2">
          <SidebarButton  text="Home" iconName="ic:round-home"/>
        </div>
    </div>
  )
}
