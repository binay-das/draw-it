import { Button } from "@repo/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="text-4xl font-bold">DRAW IT</div>
      <div>HomePage</div>
      <Link href="/signin">Login</Link>
      <Link href="/signup">Register</Link>
      <Link href={"/draw"}>
        <Button>Draw</Button>
      </Link>
    </div>
  );
}