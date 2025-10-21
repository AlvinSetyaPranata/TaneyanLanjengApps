import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import DashboardCard from "../components/atoms/DashboardCard";
import Headline from "../components/atoms/Headline";
import RootLayout from "../layouts/RootLayout";
import { useNavigate } from "react-router-dom";
import { fetchModulesOverview } from "../utils/api";

export default function Home() {
  const navigate = useNavigate();
  const [modulesCount, setModulesCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const data = [
    {
      title: "This is just a news",
      url: "/",
    },
    {
      title: "This is just a news",
      url: "/home",
    },
    {
      title: "This is just a news",
      url: "/",
    },
  ];

  // Fetch modules count on component mount
  useEffect(() => {
    async function loadModulesCount() {
      try {
        setIsLoading(true);
        const response = await fetchModulesOverview();
        setModulesCount(response.count);
      } catch (err) {
        console.error('Error fetching modules count:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadModulesCount();
  }, []);

  return (
    <RootLayout>
      <Headline news={data} />
      <div className="flex w-full gap-6 mt-12">
        <DashboardCard
          iconName="streamline-plump:module"
          title="Modul Tersedia"
          content={isLoading ? "..." : modulesCount.toString()}
        />
        <DashboardCard
          text="90%"
          title="Modul terakhir dipelajari"
          content="Pendidikan Aswaja"
        >
          <button className="hover:cursor-pointer" onClick={() => navigate("/modules/112/corridor")}>
            <Icon icon="icon-park-outline:to-right" width={20} height={20} />
          </button>
        </DashboardCard>
      </div>
    </RootLayout>
  );
}
