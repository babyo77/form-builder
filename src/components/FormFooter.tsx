import React, { useCallback } from "react";
import TickIcon from "@/components/icons/TickIcon";
import { Button } from "@/components/ui/button";
import DraftIcon from "@/components/icons/DraftIcon";
import { AddQuestions } from "./AddQuestions";
import { useUserContext } from "@/store/userStore";
function FormFooterComp() {
  const { formBuilderData } = useUserContext();
  const handlePublish = useCallback(() => {
    console.log(formBuilderData);
  }, [formBuilderData]);
  return (
    <div className="bg-peerlistBackground z-10 border-t flex p-4 px-6 max-md:px-2 gap-1.5 items-center justify-between w-full">
      <Button
        disabled={formBuilderData.questions.length == 0}
        size="sm"
        className="gap-0.5"
        variant="outline"
      >
        <DraftIcon />
        Save as Draft
      </Button>
      {formBuilderData.questions.length >= 3 && <AddQuestions />}
      <Button
        onClick={handlePublish}
        disabled={formBuilderData.questions.length == 0}
        size="sm"
        className="gap-0.5"
        variant="peerlist"
      >
        <TickIcon />
        Publish
      </Button>
    </div>
  );
}
const FormFooter = React.memo(FormFooterComp);
export default FormFooter;
