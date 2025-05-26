"use client";

import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { checkIsTenant, getSubdomain } from "@/utils/isTenant";
// import { useAuth } from "@/contexts/AuthContext"; // Assume you have an AuthContext
import { useState, useEffect } from "react";
import sidebarRoutes from '../../../public/data/sidebarRoutes.json';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

// Base MenuItem interface without icon
interface BaseMenuItem {
  label: string;
  route: string;
}

// Frontend MenuItem interface with React.ReactNode icon
interface MenuItem extends BaseMenuItem {
  icon: React.ReactNode;
  children?: MenuItem[];
}

// Table icon component
const TableIcon = () => (
  <svg
    className="fill-current"
    width="18" 
    height="18"
    viewBox="0 0 18 18"
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M15.7875 0H2.2125C1.25625 0 0.46875 0.7875 0.46875 1.74375V16.2562C0.46875 17.2125 1.25625 18 2.2125 18H15.7875C16.7438 18 17.5312 17.2125 17.5312 16.2562V1.74375C17.5312 0.7875 16.7438 0 15.7875 0ZM16.2938 16.2562C16.2938 16.5375 16.0688 16.7625 15.7875 16.7625H2.2125C1.93125 16.7625 1.70625 16.5375 1.70625 16.2562V1.74375C1.70625 1.4625 1.93125 1.2375 2.2125 1.2375H15.7875C16.0688 1.2375 16.2938 1.4625 16.2938 1.74375V16.2562Z" fill=""/>
    <path d="M14.5312 2.8125H3.46875C3.13125 2.8125 2.8125 3.13125 2.8125 3.46875V14.5312C2.8125 14.8687 3.13125 15.1875 3.46875 15.1875H14.5312C14.8687 15.1875 15.1875 14.8687 15.1875 14.5312V3.46875C15.1875 3.13125 14.8687 2.8125 14.5312 2.8125ZM13.9125 13.9125H4.0875V4.0875H13.9125V13.9125Z" fill=""/>
    <path d="M7.03125 5.34375H11.8125V6.58125H7.03125V5.34375Z" fill=""/>
    <path d="M7.03125 8.15625H11.8125V9.39375H7.03125V8.15625Z" fill=""/>
    <path d="M7.03125 10.9688H11.8125V12.2062H7.03125V10.9688Z" fill=""/>
    <path d="M5.34375 5.34375H6.58125V6.58125H5.34375V5.34375Z" fill=""/>
    <path d="M5.34375 8.15625H6.58125V9.39375H5.34375V8.15625Z" fill=""/>
    <path d="M5.34375 10.9688H6.58125V12.2062H5.34375V10.9688Z" fill=""/>
  </svg>
);

// Dashboard icon component
const DashboardIcon = () => (
  <svg
    className="fill-current"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
      fill=""
    />
    <path
      d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
      fill=""
    />
    <path
      d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
      fill=""
    />
    <path
      d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
      fill=""
    />
  </svg>
);

// Entities icon component
const EntitiesIcon = () => (
  <svg
    className="fill-current"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
      fill=""
    />
    <path
      d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
      fill=""
    />
    <path
      d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
      fill=""
    />
    <path
      d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
      fill=""
    />
  </svg>
);

const getIconComponent = (iconType: string) => {
  switch (iconType) {
    case 'dashboard':
      return <DashboardIcon />;
    case 'entities':
      return <EntitiesIcon />;
    case 'table':
      return <TableIcon />;
    default:
      return <TableIcon />;
  }
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isTenant, setIsTenant] = useState(false);
  const logoSrc = "/images/sw-light.svg";

  useEffect(() => {
    setIsTenant(checkIsTenant());
  }, []);

  useEffect(() => {
    // Transform and sort the menu items
    const transformedMenuItems = sidebarRoutes.menuItems.map((item) => {
      // Transform the main menu item
      const transformedItem = {
        ...item,
        icon: getIconComponent(item.icon)
      };

      // If item has children (like entities), sort them alphabetically
      if (item.children) {
        const sortedChildren = [...item.children].sort((a: any, b: any) => {
          // Keep "Create New" at the top
          if (a.label === "Create New") return -1;
          if (b.label === "Create New") return 1;
          // Case-insensitive alphabetical sorting
          return a.label.localeCompare(b.label, undefined, { 
            sensitivity: 'base',
            numeric: true 
          });
        });

        transformedItem.children = sortedChildren.map((child: any) => ({
          ...child,
          icon: getIconComponent(child.icon)
        }));
      }

      return transformedItem;
    });

    setMenuItems(transformedMenuItems);
    
  }, []);

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <div
        className={`fixed left-0 top-0 z-9999 flex h-screen w-50 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mt-2 flex items-center justify-between gap-2 px-2">
          <Link className="inline-block" href="/">
            <Image
              className="dark:hidden logo-style-sw"
              src={logoSrc}
              alt="Logo"
              width={300}
              height={70}
            />
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav id="sidebarMenu" className="px-1">
            <ul className="mb-6 flex flex-col gap-1.5">
              {menuItems.map((menuItem, index) => (
                <SidebarItem
                  key={index}
                  item={menuItem}
                  pageName={pageName}
                  setPageName={setPageName}
                />
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </ClickOutside>
  );
};

export default Sidebar;
