import React, { useCallback } from "react";
import RightArrow from "@/components/icons/RightArrow";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/customInput";
import { useUserContext } from "@/store/userStore";
import Link from "next/link";
function FormHeaderComp() {
  const { formBuilderData, setFormBuilderData } = useUserContext();
  const handleUpdate = useCallback(
    (value: string) => {
      setFormBuilderData((prev) => ({ ...prev, form_title: value }));
    },
    [setFormBuilderData]
  );
  return (
    <div className="border-b border-t-0  max-md:fixed max-md:top-0 backdrop-blur-lg bg-white z-10 flex p-2 max-md:px-2 px-6 gap-4 items-start justify-between w-full">
      <CustomInput
        aria-label="form title"
        value={formBuilderData?.form_title}
        onChanged={handleUpdate}
        variant={"title"}
        placeholder={"Untitled form"}
      />
      <Link href={"/preview"} target="_blank">
        <Button
          disabled={formBuilderData.questions.length == 0}
          size="sm"
          className="shadow-none gap-0.5"
          variant="outline"
        >
          <p>Preview</p>
          <RightArrow />
        </Button>
      </Link>
    </div>
  );
}

const FormHeader = React.memo(FormHeaderComp);

export default FormHeader;
