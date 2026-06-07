import { MfeMount } from "@/components/mfe/MfeMount";

export default function AuthPage() {
  return <MfeMount url={process.env.NEXT_PUBLIC_MF_AUTH_URL!} className="w-full" />;
}
