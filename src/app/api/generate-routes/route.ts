import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { entityName, attributes, routes } = await request.json();
    
    if (!entityName || !routes || !routes.schemas) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid request data' 
      }, { status: 400 });
    }

    console.log("Executed CLI", entityName);

    // Determine the correct base directory
    const appDir = fs.access(path.join(process.cwd(), 'src'))
      .then(() => path.join(process.cwd(), 'src'))
      .catch(() => process.cwd());

    const baseDir = path.join(await appDir, 'app', entityName.toLowerCase());
    const componentsDir = path.join(await appDir, 'components', entityName.toLowerCase());
    const storeDir = path.join(await appDir, 'store');
    const schemasDir = path.join(await appDir, 'validationschemas');

    // Create directories
    await Promise.all([
      fs.mkdir(baseDir, { recursive: true }),
      fs.mkdir(path.join(baseDir, 'create'), { recursive: true }),
      fs.mkdir(path.join(baseDir, 'edit', '[id]'), { recursive: true }),
      fs.mkdir(path.join(baseDir, '[id]'), { recursive: true }),
      fs.mkdir(componentsDir, { recursive: true }),
      fs.mkdir(storeDir, { recursive: true }),
      fs.mkdir(schemasDir, { recursive: true })
    ]);

    // Create validation schema file
    const schemaContent = routes.schemas[`${entityName.toLowerCase()}Schema.ts`];
    if (schemaContent) {
      await fs.writeFile(
        path.join(schemasDir, `${entityName.toLowerCase()}Schema.ts`),
        schemaContent
      );
    }

    // Create component files
    await Promise.all([
      fs.writeFile(path.join(componentsDir, 'List.tsx'), routes.pages.list),
      fs.writeFile(path.join(componentsDir, 'Create.tsx'), routes.pages.create),
      fs.writeFile(path.join(componentsDir, 'Edit.tsx'), routes.pages.edit),
      fs.writeFile(path.join(componentsDir, 'View.tsx'), routes.pages.view),
    ]);

    // Create app routes with DefaultLayout
    const listPageContent = `import List from '@/components/${entityName.toLowerCase()}/List';
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function Page() {
  return (
    <DefaultLayout>
      <List />
    </DefaultLayout>
  );
}`;
    const createPageContent = `import Create from '@/components/${entityName.toLowerCase()}/Create';
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function Page() {
  return (
    <DefaultLayout>
      <Create />
    </DefaultLayout>
  );
}`;
    const editPageContent = `import Edit from '@/components/${entityName.toLowerCase()}/Edit';
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <DefaultLayout>
      <Edit params={params} />
    </DefaultLayout>
  );
}`;
    const viewPageContent = `import View from '@/components/${entityName.toLowerCase()}/View';
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <DefaultLayout>
      <View params={params} />
    </DefaultLayout>
  );
}`;

    // Write app route files
    await Promise.all([
      fs.writeFile(path.join(baseDir, 'page.tsx'), listPageContent),
      fs.writeFile(path.join(baseDir, 'create', 'page.tsx'), createPageContent),
      fs.writeFile(path.join(baseDir, 'edit', '[id]', 'page.tsx'), editPageContent),
      fs.writeFile(path.join(baseDir, '[id]', 'page.tsx'), viewPageContent),
      
      // Store
      fs.writeFile(
        path.join(storeDir, `${entityName.toLowerCase()}Store.ts`),
        routes.store[`${entityName.toLowerCase()}Store.ts`]
      )
    ]);

    // Format all generated files including schema
    try {
      // Create a list of files that were actually generated
      const filesToFormat = [
        path.join(baseDir, 'page.tsx'),
        path.join(baseDir, 'create', 'page.tsx'),
        path.join(baseDir, 'edit', '[id]', 'page.tsx'),
        path.join(baseDir, '[id]', 'page.tsx'),
        path.join(componentsDir, 'List.tsx'),
        path.join(componentsDir, 'Create.tsx'),
        path.join(componentsDir, 'Edit.tsx'),
        path.join(componentsDir, 'View.tsx'),
        path.join(storeDir, `${entityName.toLowerCase()}Store.ts`),
        path.join(schemasDir, `${entityName.toLowerCase()}Schema.ts`)
      ].filter(file => fsSync.existsSync(file));

      if (filesToFormat.length > 0) {
        await execAsync(`npx prettier --write "${filesToFormat.join('" "')}"`);
      }
    } catch (error) {
      console.error('Prettier formatting error:', error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate routes' 
    }, { status: 500 });
  }
}