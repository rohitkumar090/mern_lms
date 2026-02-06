import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { BarChart, Book, LogOut, Menu, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";

function InstructorDashboardpage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { resetCredentials } = useContext(AuthContext);
  const { instructorCoursesList, setInstructorCoursesList } =
    useContext(InstructorContext);

  async function fetchAllCourses() {
    const response = await fetchInstructorCourseListService();
    if (response?.success) setInstructorCoursesList(response?.data);
  }

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorDashboard listOfCourses={instructorCoursesList} />,
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <InstructorCourses listOfCourses={instructorCoursesList} />,
    },
  ];

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <div className="flex md:h-[695px] bg-gray-100 max-w-[1420px] m-auto">
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-50 flex items-center justify-between px-4 py-3">
        <h2 className="text-lg font-bold">Instructor View</h2>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {mobileMenuOpen && (
          <div className="absolute top-14 right-4 w-48 bg-white shadow-lg rounded-md border p-2">
            {menuItems.map((item) => (
              <Button
                key={item.value}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab(item.value);
                  setMobileMenuOpen(false);
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}

            <Button
              variant="ghost"
              className="w-full justify-start text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </header>

      <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
        <div className="p-4 flex flex-col flex-1">
          <h2 className="text-2xl font-bold mb-4">Instructor View</h2>

          <nav className="flex flex-col gap-2 flex-1">
            {menuItems.map((menuItem) => (
              <Button
                key={menuItem.value}
                variant={
                  activeTab === menuItem.value ? "secondary" : "ghost"
                }
                className="w-full justify-start"
                onClick={() => setActiveTab(menuItem.value)}
              >
                <menuItem.icon className="mr-2 h-4 w-4" />
                {menuItem.label}
              </Button>
            ))}
          </nav>

          <Button
            variant="ghost"
            className="w-full justify-start mt-auto border"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 mt-14 md:mt-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuItems.map((menuItem) => (
              <TabsContent key={menuItem.value} value={menuItem.value}>
                {menuItem.component}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboardpage;
