"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabaseClient";

export const useAuthGuard = () => {
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/");
      }
    };
    check();
  }, [router]);
};
