import { Link, useParams } from "react-router-dom";
import Breadcrumps from "../../components/atoms/Breadcrumps";
import { Icon } from "@iconify/react";
import DetailLayout from "../../layouts/DetailLayout";

export default function ModuleDetail() {
  const { id } = useParams();

  const urls = [
    {
      title: "Modul Kelas",
      url: "/modules",
    },
    {
      title: "Koridor Kelas",
      url: `/modules/${id}`,
    },
  ];

  return (
    <DetailLayout title="Pendidikan Aswaja">
      <div className="px-12 py-8">

      
      <Breadcrumps urls={urls} />
      <div className="flex justify-between items-center">
        <h1 className="mt-8 text-3xl font-semibold">Pendidikan Aswaja</h1>
        <Link className="rounded-md bg-black text-white px-3 py-2 text-sm" to="/modules/112/lesson/112">Lanjut Belajar</Link>
      </div>

      <div className="flex w-full justify-between items-start mt-12 gap-12">
        <div className="border-gray-400 border-[0.5px] w-full rounded-md p-4 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2>Progress Belajar</h2>
            <p>12%</p>
          </div>
          {/* progress-bar-container */}
          <div className="bg-gray-300 rounded-full w-full h-[8px]">
            {/* progress-bar-children */}
            <div className="h-full w-[12%] bg-yellow-500 rounded-full"></div>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="majesticons:clock" className="text-xl text-black" />
            <h3 className="font-medium text-sm">Deadline Belajar: </h3>
            <p className="text-sm">21 Januari 2012</p>
          </div>
        </div>
        <div className=" w-full rounded-md flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:idea" className="text-2xl text-amber-500" />
            <h2>Saran Belajar</h2>
          </div>
          <p className="font-light">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt,
            mollitia ullam consequuntur assumenda at, adipisci dolore saepe
            quidem nihil corporis a. Voluptas exercitationem consequatur vel
            ipsam corporis repellendus nobis molestiae?
          </p>
        </div>
      </div>

      <div className="border-t border-t-gray-300 py-12 mt-24 flex gap-8">
        {/* card */}
        <div className="border-gray-400 border-[0.5px] w-full rounded-md p-4 flex flex-col gap-6">
          <div className="flex items-center gap-x-2">
            <Icon className="text-xl" icon="octicon:paste-24" />
            <h2 className="font-medium">Riwayat Ujian</h2>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            {/* content */}
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="">Berpikir secara logis tentang pandangan tertentu</h3>
                <p className="mt-2 text-gray-400">21 Oktober 2025</p>
              </div>

              <h2>21%</h2>
            </div>
          </div>
        </div>
        {/* card */}
        <div className="border-gray-400 border-[0.5px] w-full rounded-md p-4 flex flex-col gap-6">
          <div className="flex items-center gap-x-2">
            <Icon className="text-2xl" icon="material-symbols-light:chat" />
            <h2 className="font-medium">Diskusi Forum</h2>
          </div>

           <p>Berdikusi tentang apa pertanyaanmu di kelas</p>
          <div className="flex justify-end mt-4">
            {/* content */}
           <Link to="#" className="rounded-md bg-black text-white py-3 px-5 text-sm">Ke Forum Diskusi</Link>
          </div>
        </div>
      </div>
      </div>
    </DetailLayout>
  );
}
