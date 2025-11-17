import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import DashboardCard from "../components/atoms/DashboardCard";
import Headline from "../components/atoms/Headline";
import RootLayout from "../layouts/RootLayout";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";

// Use environment variable for API base URL

interface TeacherStats {
  total_modules: number
  total_lessons: number
  total_students_enrolled: number
  last_module: {
    id: number
    title: string
    description: string
    cover_image: string
    date_created: string
    lessons_count: number
    is_published: boolean
  } | null
  monthly_activity: Array<{
    month: string
    modules_created: number
    lessons_created: number
  }>
}

interface StudentStats {
  active_modules: number
  completed_modules: number
  total_lessons: number
  lessons_completed: number
  last_module: {
    id: number
    title: string
    description: string
    cover_image: string
    progress: number
    lessons_count: number
  } | null
  monthly_activity: Array<{
    month: string
    average_progress: number
    modules_active: number
  }>
}

export default function Home() {
  const navigate = useNavigate();
  const user = getUser();
  const [teacherStats, setTeacherStats] = useState<TeacherStats | null>(null);
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<{[key: string]: number}>({});
  const [rolesLoaded, setRolesLoaded] = useState(false);
  
  // Fetch roles from backend on component mount
  useEffect(() => {
    async function fetchRoles() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/roles/`);
        if (response.ok) {
          const rolesData = await response.json();
          const roleMap: {[key: string]: number} = {};
          rolesData.forEach((role: any) => {
            roleMap[role.name] = role.id;
          });
          setRoles(roleMap);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setRolesLoaded(true);
      }
    }
    
    fetchRoles();
  }, []);
  
  // Role detection based on actual role IDs from backend
  const isTeacher = rolesLoaded && roles.Teacher && user?.role === roles.Teacher;
  const isStudent = rolesLoaded && roles.Student && user?.role === roles.Student;
  const isAdmin = rolesLoaded && roles.Admin && user?.role === roles.Admin;
  
  const data = [
    {
      title: "Ini hanya berita",
      url: "/",
    },
    {
      title: "Ini hanya berita",
      url: "/home",
    },
    {
      title: "Ini hanya berita",
      url: "/",
    },
  ];

  // Navigate to admin dashboard if user is admin
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAdmin, navigate]);

  // Fetch stats based on user role
  useEffect(() => {
    // Don't fetch stats until roles are loaded
    if (!rolesLoaded) return;
    
    async function loadStats() {
      // Don't fetch if no user or admin
      if (!user || isAdmin) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const token = localStorage.getItem('access_token');
        const endpoint = isTeacher ? 'teacher/stats' : 'student/stats';
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (isTeacher) {
            setTeacherStats(data.stats);
          } else {
            setStudentStats(data.stats);
          }
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, [isTeacher, isStudent, isAdmin, rolesLoaded]);

  // Loading state while roles are being fetched
  if (!rolesLoaded) {
    return (
      <RootLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Icon icon="line-md:loading-loop" className="text-6xl text-black mx-auto mb-4" />
            <p className="text-gray-600">Memuat peran...</p>
          </div>
        </div>
      </RootLayout>
    );
  }

  // Loading state (before role detection)
  if (!user || isLoading && !teacherStats && !studentStats) {
    return (
      <RootLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Icon icon="line-md:loading-loop" className="text-6xl text-black mx-auto mb-4" />
            <p className="text-gray-600">Memuat dashboard...</p>
          </div>
        </div>
      </RootLayout>
    );
  }

  // Admin view - redirect to admin dashboard
  if (isAdmin) {
    return (
      <RootLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Icon icon="line-md:loading-loop" className="text-6xl text-black mx-auto mb-4" />
            <p className="text-gray-600">Mengarahkan ke dashboard admin...</p>
          </div>
        </div>
      </RootLayout>
    );
  }

  // Render Teacher Dashboard
  if (isTeacher) {
    return (
      <RootLayout>
        <Headline news={data} />
        
        {/* Teacher Dashboard Cards */}
        <div className="flex w-full gap-6 mt-12">
          <DashboardCard
            iconName="streamline-plump:module"
            title="Modul Anda"
            content={isLoading ? "..." : (teacherStats?.total_modules || 0).toString()}
          />
          <DashboardCard
            text={teacherStats?.last_module ? `${teacherStats.last_module.lessons_count} materi` : ""}
            title="Modul Terakhir Dibuat"
            content={teacherStats?.last_module?.title || "Belum ada modul"}
          >
            {teacherStats?.last_module && (
              <button 
                className="hover:cursor-pointer" 
                onClick={() => navigate(`/teacher/modules/${teacherStats.last_module?.id}`)}
              >
                <Icon icon="icon-park-outline:to-right" width={20} height={20} />
              </button>
            )}
          </DashboardCard>
        </div>

        {/* Teacher Activity Chart */}
        {teacherStats?.monthly_activity && teacherStats.monthly_activity.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Statistik</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="space-y-6">
                {teacherStats.monthly_activity.map((activity, index) => {
                  const totalActivity = activity.modules_created + activity.lessons_created;
                  const maxActivity = Math.max(
                    ...teacherStats.monthly_activity.map(a => a.modules_created + a.lessons_created)
                  );
                  const percentage = maxActivity > 0 ? (totalActivity / maxActivity) * 100 : 0;
                  
                  // Format month
                  const monthDate = new Date(activity.month + '-01');
                  const monthName = monthDate.toLocaleDateString('id-ID', { 
                    month: 'long', 
                    year: 'numeric' 
                  });

                  return (
                    <div key={activity.month} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{monthName}</span>
                        <span className="text-sm text-gray-500">
                          {activity.modules_created} modul, {activity.lessons_created} materi
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {/* Modules Bar */}
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div 
                              className="bg-black h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${activity.modules_created > 0 ? (activity.modules_created / (maxActivity || 1)) * 100 : 0}%` 
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.modules_created} modul
                          </p>
                        </div>
                        
                        {/* Lessons Bar */}
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div 
                              className="bg-gray-600 h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${activity.lessons_created > 0 ? (activity.lessons_created / (maxActivity || 1)) * 100 : 0}%` 
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.lessons_created} materi
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div className="flex gap-6 mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-black rounded"></div>
                  <span className="text-sm text-gray-600">Modul Dibuat</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-600 rounded"></div>
                  <span className="text-sm text-gray-600">Materi Dibuat</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </RootLayout>
    );
  }

  // Render Student Dashboard (default)
  return (
    <RootLayout>
      <Headline news={data} />
      
      {/* Student Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <DashboardCard
          iconName="mdi:book-open-page-variant"
          title="Modul Aktif"
          content={isLoading ? "..." : (studentStats?.active_modules || 0).toString()}
          text="Sedang dipelajari"
        />
        <DashboardCard
          iconName="mdi:checkbox-marked-circle"
          title="Modul Selesai"
          content={isLoading ? "..." : (studentStats?.completed_modules || 0).toString()}
          text="Telah diselesaikan"
        />
        <DashboardCard
          text={studentStats?.last_module ? `${studentStats.last_module.progress}% selesai` : ""}
          title="Modul Terakhir"
          content={studentStats?.last_module?.title || "Belum ada"}
        >
          {studentStats?.last_module && (
            <button 
              className="hover:cursor-pointer" 
              onClick={() => navigate(`/student/modules/${studentStats.last_module?.id}/corridor`)}
            >
              <Icon icon="icon-park-outline:to-right" width={20} height={20} />
            </button>
          )}
        </DashboardCard>
      </div>

      {/* Student Activity Stats */}
      {studentStats?.monthly_activity && studentStats.monthly_activity.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Statistik Aktivitas Belajar</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="space-y-6">
              {studentStats.monthly_activity.map((activity) => {
                const monthDate = new Date(activity.month + '-01');
                const monthName = monthDate.toLocaleDateString('id-ID', { 
                  month: 'long', 
                  year: 'numeric' 
                });

                return (
                  <div key={activity.month} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{monthName}</span>
                      <span className="text-sm text-gray-500">
                        {activity.modules_active} modul • {activity.average_progress}% rata-rata progres
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div 
                        className="bg-black h-full rounded-full transition-all duration-500"
                        style={{ width: `${activity.average_progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Summary */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg border-2 border-black">
                  <div className="text-2xl font-bold text-black">
                    {studentStats.lessons_completed}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Materi Selesai</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border-2 border-gray-400">
                  <div className="text-2xl font-bold text-gray-700">
                    {studentStats.total_lessons}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Total Materi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </RootLayout>
  );
}