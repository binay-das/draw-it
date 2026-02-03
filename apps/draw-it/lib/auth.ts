import { cookies } from "next/headers";
import { auth } from "@repo/common";

export async function getAuthUser(): Promise<{ id: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    return auth.verifyToken(token);
  } catch {
    return null;
  }
}
