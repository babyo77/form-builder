import { useUserContext } from "@/store/userStore";
import { questionType } from "@/types/types";
import { useCallback } from "react";

function useAddQuestion() {
  const { setFormBuilderData, scrollRef } = useUserContext();
  const handleAddQuestion = useCallback(
    (category: questionType["category"]) => {
      setFormBuilderData((prev) => {
        const newQuestion = {
          position: prev.questions.length + 1,
          category,
          title: undefined,
          helpText: undefined,
          required: false,
        };

        if (category === "single_select") {
          return {
            ...prev,
            questions: [
              ...prev.questions,
              {
                ...newQuestion,
                options: [undefined, undefined], // Add an options field for single_select
              },
            ],
          };
        }

        // For other categories, just add the question without 'options'
        return {
          ...prev,
          questions: [...prev.questions, newQuestion],
        };
      });
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    },
    [setFormBuilderData, scrollRef]
  );
  return { handleAddQuestion };
}

export default useAddQuestion;
