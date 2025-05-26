'use client';

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {ManageEntities} from "mongo-entity-generator";

export default function EntitiesPage() {
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
    <DefaultLayout>
      <ManageEntities token={token} />
    </DefaultLayout>
  );
}

