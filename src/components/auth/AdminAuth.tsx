'use client';

import { supabase } from '@/supabaseClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';

export default function AdminAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/');
        return;
      }

      const { data: profile, error } = await supabase.from('profile').select('role').eq('user_id', user.id).single();

      if (error || !profile || profile.role !== 'admin') {
        router.replace('/');
      } else {
        setIsAuthorized(true);
      }
    };

    checkAdminStatus();
  }, [router]);

  if (!isAuthorized) {
    return null; // Render nothing until authorized, or redirect happens.
  }

  return <>{children}</>;
} 