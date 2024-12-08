"use server";

import api from "@/lib/api";
import { cookies } from "next/headers";

export async function getSession() {
  try {
    const guest_token = cookies().get("guest_token")?.value;
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/check`,
      {
        showErrorToast: false,
        headers: {
          Authorization: `Bearer ${guest_token}`,
        },
        cache: "no-cache",
      }
    );

    if (response.success) {
      return response.data as any;
    }
    return null;
  } catch (e: any) {
    console.log("SESSION ERROR: " + e.message);
    return null;
  }
}