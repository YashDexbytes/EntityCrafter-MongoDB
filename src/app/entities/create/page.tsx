'use client';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {TableForm} from "mongo-entity-generator";


const CreateEntityPage = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
      router.push('/');
      return;
    }
    setToken(accessToken);
  }, [router]);

  if (!token) {
    return null; // or loading state
  }

  return (
    <div>
      <DefaultLayout>
        <TableForm token={token} />
      </DefaultLayout>
    </div>
  );
};

export default CreateEntityPage;