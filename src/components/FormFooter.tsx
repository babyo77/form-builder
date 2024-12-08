import React, { useCallback, useEffect, useRef, useState } from "react";
import TickIcon from "@/components/icons/TickIcon";
import { Button } from "@/components/ui/button";
import DraftIcon from "@/components/icons/DraftIcon";
import { AddQuestions } from "./AddQuestions";
import { useUserContext } from "@/store/userStore";
import api from "@/lib/api";
import { validateFormStructure } from "@/validation/formStructureValidation";
import { LoaderCircle } from "lucide-react";
import useDebounce from "@/app/hooks/useDebounce";
import { toast } from "sonner";
function FormFooterComp() {
  const { formBuilderData, setFormBuilderData } = useUserContext();
  const [draft, setDraft] = useState<boolean>(false);
  const handlePublish = useCallback(async () => {
    const res = await api.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/form/publish${
        formBuilderData.publish ? "?type=un" : ""
      }`,
      {
        credentials: "include",
      }
    );
    if (res.success) {
      setFormBuilderData((prev) => ({
        ...prev,
        publish: (res.data as any).publish,
        _id: (res.data as any)._id,
      }));
      toast.success((res.data as any).message, {
        style: {
          backgroundColor: !(res.data as any).publish ? "#e94625" : "#00AA45",
          color: "#FFFFFF",
        },
      });
    }
  }, [formBuilderData]);
  const [loader, setLoader] = useState<boolean>(false);
  const saveFormController = useRef<AbortController | null>(null);
  const saveForm = async () => {
    const form = validateFormStructure(formBuilderData.questions);
    if (form.errors) {
      console.log(form.errors);
      return;
    }
    setLoader(true);
    if (saveFormController.current) {
      saveFormController.current.abort();
    }

    const controller = new AbortController();
    saveFormController.current = controller;
    await api.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/form/save`,
      formBuilderData,
      {
        signal: controller.signal,
        showErrorToast: false,
        credentials: "include",
      }
    );
    setDraft(true);
    setLoader(false);
  };
  const saveFromRealtime = useDebounce(saveForm);
  useEffect(() => {
    setDraft(false);
    saveFromRealtime();
  }, [formBuilderData]);
  return (
    <div className="bg-peerlistBackground z-10 border-t flex p-4 px-6 max-md:px-2 gap-1.5 items-center justify-between w-full">
      <Button
        onClick={saveForm}
        disabled={loader || formBuilderData.questions.length == 0 || draft}
        size="sm"
        className="gap-0.5"
        variant="outline"
      >
        {loader ? (
          <LoaderCircle className="  size-4 text-peerlistGreen animate-spin" />
        ) : (
          <DraftIcon />
        )}
        Save as Draft
      </Button>
      {formBuilderData.questions.length >= 3 && <AddQuestions />}
      <Button
        onClick={handlePublish}
        disabled={formBuilderData.questions.length == 0}
        size="sm"
        className="gap-0.5"
        variant={!formBuilderData.publish ? "peerlist" : "destructive"}
      >
        {!formBuilderData.publish && <TickIcon />}
        {!formBuilderData.publish ? "Publish" : "Unpublish"}
      </Button>
    </div>
  );
}
const FormFooter = React.memo(FormFooterComp);
export default FormFooter;
