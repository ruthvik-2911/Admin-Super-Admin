import * as React from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

export default function AdminLayout() {
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0E1117] flex">
      {/* Sidebar Wrapper */}
      <div 
        className={`hidden lg:block transition-all duration-300 ease-in-out ${
          isOpen ? "w-72" : "w-20"
        } flex-shrink-0`}
      >
         <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      {/* Mobile Sidebar Overlay (Sidebar will handle its own visibility on mobile) */}
      <div className="lg:hidden">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header />
        <main className="flex-1 w-full overflow-x-hidden relative transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-12">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
