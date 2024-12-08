"use client";
import { useEffect } from "react";
import api from "@/lib/api";
import { formType } from "@/types/types";
import { useUserContext } from "@/store/userStore";
export interface submissions {
  submittedAt: string;
  userId: string;
}
function SetSession({
  user,
}: {
  user?: {
    token: string;
    savedForm: formType;
    submissions: submissions[];
  } | null;
}) {
  const { setFormBuilderData, setFormSubmission } = useUserContext();
  useEffect(() => {
    if (!user) {
      api
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/make/session`, {
          showErrorToast: false,
        })
        .then(async (res) => {
          if (res.success) {
            api.setAuthToken((res.data as any).token);
            await api.post("/api/login", res.data);
          }
        })
        .catch(() => {
          localStorage.removeItem("auth");
        });
      return;
    }
    if (user.savedForm) {
      setFormBuilderData(user?.savedForm);
    }

    if (user.submissions) {
      setFormSubmission(user.submissions);
    }
    api.setAuthToken(user?.token);
  }, [user, setFormBuilderData, setFormSubmission]);

  return null;
}

export default SetSession;
