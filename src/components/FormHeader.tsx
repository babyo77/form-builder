import React, { useCallback } from "react";
import RightArrow from "@/components/icons/RightArrow";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/customInput";
import { useUserContext } from "@/store/userStore";
function FormHeaderComp() {
  const { formBuilderData, setFormBuilderData } = useUserContext();
  const handleUpdate = useCallback(
    (value: string) => {
      setFormBuilderData((prev) => ({ ...prev, form_title: value }));
    },
    [setFormBuilderData]
  );
  return (
    <div className="border-b flex p-2 max-md:px-2 px-6 gap-4 items-center justify-between w-full">
      <CustomInput
        onChanged={handleUpdate}
        variant={"title"}
        placeholder={formBuilderData.form_title}
      />
      <Button size="sm" className="shadow-none gap-0.5" variant="outline">
        <p>Preview</p>
        <RightArrow />
      </Button>
    </div>
  );
}

const FormHeader = React.memo(FormHeaderComp);

export default FormHeader;
