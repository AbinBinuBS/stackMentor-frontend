import React from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SidebarProps } from '../../../interfaces/ImenteeInferfaces';


const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
  menuItems,
  activeColors
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <button
        className="fixed left-4 z-50 mt-6 lg:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`
          fixed inset-0 bg-black bg-opacity-50 z-40
          transition-opacity duration-300 ease-in-out
          ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
          lg:hidden
        `}
        onClick={toggleSidebar}
      />

      <div
        className={`
          w-64 bg-white shadow-md fixed left-0 top-36 z-50
          transition-transform duration-300 ease-in-out
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:shadow-none lg:ml-10
        `}
      >
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li
                key={item.path}
                className={`
                  ${
                    isActive(item.path)
                      ? `${activeColors.bg} ${activeColors.text} font-semibold`
                      : ""
                  }
                  py-2 px-4 rounded cursor-pointer flex items-center
                `}
                onClick={() => navigate(item.path)}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;