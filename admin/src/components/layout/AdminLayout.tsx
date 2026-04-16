import * as React from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

export default function AdminLayout() {
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <div className="min-h-screen bg-[#F5F6FA] dark:bg-[#0E1117] flex dashboard-bg transition-colors overflow-x-hidden">
      {/* Sidebar Wrapper */}
      <div 
        className={`hidden lg:block transition-all duration-300 ease-in-out relative z-30 ${
          isOpen ? "w-72" : "w-20"
        } flex-shrink-0`}
      >
         <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        <Header />
        <main className="flex-1 w-full overflow-x-hidden relative transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
