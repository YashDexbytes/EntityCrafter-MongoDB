export interface SidebarRoute {
  icon: string;
  label: string;
  route: string;
  children?: SidebarRoute[];
}

export interface SidebarRoutes {
  menuItems: SidebarRoute[];
} 