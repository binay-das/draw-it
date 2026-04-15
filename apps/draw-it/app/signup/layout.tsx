import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@repo/common";
import prisma from "@repo/db";

export default async function SignupLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
        const result = auth.verifyTokenSafe(token);
        if (result.valid && result.id) {
            const user = await prisma.user.findUnique({
                where: { id: result.id },
            });
            if (user) {
                redirect("/canvas");
            }
        }
    }

    return <>{children}</>;
}
