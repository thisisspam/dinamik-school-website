"use server";

import { redirect } from "next/navigation";
import { clearSession, createSession, verifyCredentials } from "@/lib/auth";

export async function loginAction(formData: FormData): Promise<void> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  const isValid = await verifyCredentials(username, password);
  if (!isValid) {
    redirect("/admin/login?error=1");
  }

  await createSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/admin/login");
}
