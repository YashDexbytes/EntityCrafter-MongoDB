import { NextResponse } from 'next/server';
import { promises as fs } from 'fs'; // Use async file system methods
import path from 'path';
import sidebarRoutes from '../../../../public/data/sidebarRoutes.json';
import { SidebarRoutes } from '@/types/sidebar';

// GET endpoint now returns the imported JSON directly
export async function GET() {
  return NextResponse.json(sidebarRoutes);
}

export async function POST(request: Request) {
  try {
    const { entityName } = await request.json();
    const publicPath = path.join(process.cwd(), 'public', 'data', 'sidebarRoutes.json');
    const routesData = sidebarRoutes as SidebarRoutes;

    const customEntitiesIndex = routesData.menuItems.findIndex(
      (item) => item.label === 'Custom Entities'
    );

    if (customEntitiesIndex === -1) {
      throw new Error('Custom Entities section not found');
    }

    const routeExists = routesData.menuItems[customEntitiesIndex].children?.some(
      (item) => item.route === `/${entityName.toLowerCase()}`
    );

    if (!routeExists) {
      if (!routesData.menuItems[customEntitiesIndex].children) {
        routesData.menuItems[customEntitiesIndex].children = [];
      }

      routesData.menuItems[customEntitiesIndex].children.push({
        icon: "table",
        label: entityName.charAt(0).toUpperCase() + entityName.slice(1),
        route: `/${entityName.toLowerCase()}`
      });

      // 🔹 Use async writeFile instead of blocking writeFileSync
      await fs.writeFile(publicPath, JSON.stringify(routesData, null, 2));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating sidebar routes:', error);
    return NextResponse.json(
      { error: 'Failed to update sidebar routes' }, 
      { status: 500 }
    );
  }
}
