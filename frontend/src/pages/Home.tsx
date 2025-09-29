import { Icon } from "@iconify/react";
import DashboardCard from "../components/atoms/DashboardCard";
import Headline from "../components/atoms/Headline";



export default function Home() {

  const data = [
    {
      title: "This is just a news",
      url: "/"
    },
    {
      title: "This is just a news",
      url: "/home"
    },
    {
      title: "This is just a news",
      url: "/"
    },
  ]

  return (
    <>
    <Headline news={data} />
    <div className="flex w-full gap-6 mt-12">
      <DashboardCard iconName="streamline-plump:module" title="Modul Tersedia" content="123" />
      <DashboardCard text="90%" title="Modul terakhir dipelajari" content="Pendidikan Agama Islam">
        <button className="hover:cursor-pointer">
          <Icon icon="icon-park-outline:to-right" width={20} height={20}/>
        </button>
      </DashboardCard>
    </div>
    </>
  )
}
