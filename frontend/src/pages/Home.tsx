import { Icon } from "@iconify/react";
import DashboardCard from "../components/atoms/DashboardCard";



export default function Home() {
  return (
    <>
    <div className="flex w-full gap-6">
      <DashboardCard iconName="streamline-plump:module" title="Modul Tersedia" content="123" />
      <DashboardCard iconName="streamline-plump:module" title="Modul terakhir dipelajari" content="Pendidikan Agama Islam">
        <button className="hover:cursor-pointer">
          <Icon icon="icon-park-outline:to-right" width={20} height={20}/>
        </button>
      </DashboardCard>
    </div>
    </>
  )
}
