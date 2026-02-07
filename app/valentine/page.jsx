"use client";

import { useRouter } from "next/navigation";
import ValentinePrompt from "../../components/ValentinePrompt";

export default function ValentinePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen">
      <ValentinePrompt onClose={() => router.push("/logic")} />
    </main>
  );
}
