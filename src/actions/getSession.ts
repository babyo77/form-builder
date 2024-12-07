"use server";

import api from "@/lib/api";

export async function getSession() {
  try {
    const session = await api.get(`${process.env.NEXT_PUBLIC_BACKEND_URI}`, {
      showErrorToast: false,
    });

    if (session.success) {
      return session.data;
    }
  } catch (e: any) {
    console.log("SESSION ERROR: " + e.message);

    return null;
  }
}
