import { useUserContext } from "@/store/userStore";
import React, { useState, useCallback, useRef } from "react";
import DragIcon from "@/components/icons/DragIcon";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PlusIcon from "@/components/icons/PlusIcon";
import { iconMapping, inputFieldMapping, OPTION_LIMIT } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MinusIcon from "@/components/icons/MinusIcon";
import CustomInput from "@/components/customInput";
import { AddQuestions } from "@/components/AddQuestions";
import DeleteIcon from "./icons/DeleteIcon";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { questionType } from "@/types/types";
import useAddQuestion from "@/app/hooks/useAddQuestion";

function FormBuilder() {
  const { formBuilderData, setFormBuilderData, scrollRef } = useUserContext();
  const draggedIndex = useRef<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [draggedOverFormBuilder, setDraggedOverFormBuilder] =
    useState<boolean>(false);

  // drag-drop to reorder

  const handleDragStart = useCallback((index: number) => {
    draggedIndex.current = index;
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (hoveredIndex !== index) {
        setHoveredIndex(index);
      }
    },
    [hoveredIndex]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setHoveredIndex(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();

      if (draggedIndex.current === null || draggedIndex.current === index) {
        draggedIndex.current = null;
        setHoveredIndex(null);
        return;
      }

      const updatedQuestions = [...formBuilderData.questions];
      const [draggedQuestion] = updatedQuestions.splice(
        draggedIndex.current,
        1
      );
      updatedQuestions.splice(index, 0, draggedQuestion);

      setFormBuilderData((prev) => ({ ...prev, questions: updatedQuestions }));
      draggedIndex.current = null;
      setHoveredIndex(null);
    },
    [draggedIndex, formBuilderData.questions, setFormBuilderData]
  );

  // update form data

  const {
    addOption,
    deleteQuestion,
    toggleRequired,
    removeOption,
    updateOption,
    updateQuestionField,
  } = useAddQuestion();

  // drag-drp form inner

  const handleDragoverFormBuilder = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex) return;

    setDraggedOverFormBuilder(true);
  }, []);
  const { handleAddQuestion } = useAddQuestion();

  const handleDragLeaveFormBuilder = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    setDraggedOverFormBuilder(false);
  }, []);
  const handleDropFormBuilder = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      const category = e.dataTransfer.getData("text/plain");
      if (category) {
        handleAddQuestion(category as questionType["category"]);
      }
      setDraggedOverFormBuilder(false);
    },
    [handleAddQuestion]
  );

  return (
    <div
      onDragOver={handleDragoverFormBuilder}
      onDragLeave={handleDragLeaveFormBuilder}
      onDrop={handleDropFormBuilder}
      className={`h-full  max-h-[calc(100vh-106px)] overflow-y-auto flex flex-col items-center gap-5 hide-scrollbar ${
        draggedOverFormBuilder && "border border-peerlistGreen"
      } max-md:p-2 max-md:py-5  p-6 justify-start`}
    >
      {formBuilderData.questions.map((question, questionIndex) => (
        <Card
          // ref={
          //   questionIndex == formBuilderData.questions.length - 1
          //     ? scrollRef
          //     : null
          // }
          draggable
          onDragStart={() => handleDragStart(questionIndex)}
          onDragOver={(e) => handleDragOver(e, questionIndex)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, questionIndex)}
          key={question.id + Math.random()}
          className={`w-full ${
            hoveredIndex === questionIndex
              ? "border-peerlistGreen border-spacing-0.5"
              : "border-spacing-0.5"
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-start gap-4">
              <CustomInput
                aria-label="question title"
                value={question.title}
                onChanged={(value) =>
                  updateQuestionField(questionIndex, "title", value)
                }
                placeholder={"Write a question"}
                variant={"title"}
              />
              <div className="flex gap-1">
                <div className="flex items-center">
                  {iconMapping[question?.category]}
                  <AddQuestions
                    currentQuestionIndex={questionIndex}
                    isInputField
                  />
                </div>
                <DragIcon />
              </div>
            </CardTitle>
            <CardDescription>
              <CustomInput
                aria-label="question helpText"
                value={question.helpText}
                variant={"helpText"}
                onChanged={(value) =>
                  updateQuestionField(questionIndex, "helpText", value)
                }
                placeholder={
                  "Write a help text or caption (leave empty if not needed)."
                }
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {question.category === "single_select" ? (
              <RadioGroup>
                {question.options?.map((option, optionIndex) => (
                  <div
                    key={optionIndex + Math.random()}
                    className={`${
                      !option && "text-muted-foreground"
                    } flex items-center space-x-2`}
                  >
                    <RadioGroupItem
                      value={option || `Option ${optionIndex + 1}`}
                      id={option || `Option ${optionIndex + 1}`}
                    />
                    <CustomInput
                      aria-label="options"
                      className="after:left-1.5 md:text-sm"
                      value={option || undefined}
                      onChanged={(value) =>
                        updateOption(questionIndex, optionIndex, value)
                      }
                      placeholder={`Option ${optionIndex + 1}`}
                    />
                    {question.options && (
                      <>
                        {optionIndex === 0 ? null : (
                          <>
                            {optionIndex === OPTION_LIMIT - 1 ? (
                              <MinusIcon
                                onClick={() =>
                                  removeOption(questionIndex, optionIndex)
                                }
                              />
                            ) : (
                              <>
                                {optionIndex < question.options.length - 1 && (
                                  <MinusIcon
                                    onClick={() =>
                                      removeOption(questionIndex, optionIndex)
                                    }
                                  />
                                )}
                              </>
                            )}
                          </>
                        )}
                        {optionIndex === question.options.length - 1 &&
                          optionIndex !== OPTION_LIMIT - 1 && (
                            <PlusIcon
                              onClick={() => addOption(questionIndex)}
                            />
                          )}
                      </>
                    )}
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <>{inputFieldMapping[question?.category]}</>
            )}
            <CardFooter className="flex justify-between items-center pt-3">
              <div onClick={(e: any) => deleteQuestion(e, questionIndex)}>
                <DeleteIcon className="text-red-500 cursor-pointer" />
              </div>
              <div className="flex items-center space-x-2">
                <Label
                  htmlFor={`required-${questionIndex}`}
                  className="font-normal text-xs"
                >
                  Required
                </Label>
                <Switch
                  checked={question?.required}
                  id={`required-${questionIndex}`}
                  onCheckedChange={() => toggleRequired(questionIndex)}
                />
              </div>
            </CardFooter>
          </CardContent>
        </Card>
      ))}
      {formBuilderData.questions.length <= 2 && <AddQuestions />}
      <div ref={scrollRef} />
    </div>
  );
}

export default FormBuilder;
