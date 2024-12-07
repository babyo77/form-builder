import { useUserContext } from "@/store/userStore";
import React, { useState, useCallback } from "react";
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
import { iconMapping, inputFieldMapping } from "@/lib/utils";
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

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setHoveredIndex(index);
  }, []);

  const handleDragLeave = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      setHoveredIndex(null);
      if (draggedIndex === null || draggedIndex === index) return;

      const updatedCards = [...formBuilderData.questions];
      const [draggedCard] = updatedCards.splice(draggedIndex, 1);
      updatedCards.splice(index, 0, draggedCard);
      setFormBuilderData((prev) => ({ ...prev, questions: updatedCards }));
    },
    [draggedIndex, setFormBuilderData, formBuilderData.questions]
  );

  const handleDrop = useCallback(() => {
    setDraggedIndex(null);
    setHoveredIndex(null);
  }, []);

  const addOption = useCallback(
    (questionIndex: number) => {
      const updatedQuestions = [...formBuilderData.questions];
      const question = updatedQuestions[questionIndex];
      if (!question.options) return;
      if (question.options.length < 4) {
        question.options.push(undefined); // Add an empty option
        setFormBuilderData((prev) => ({
          ...prev,
          questions: updatedQuestions,
        }));
      }
    },
    [formBuilderData, setFormBuilderData]
  );

  const removeOption = useCallback(
    (questionIndex: number, optionIndex: number) => {
      const updatedQuestions = [...formBuilderData.questions];
      const question = updatedQuestions[questionIndex];
      if (!question.options) return;
      if (question.options.length > 1) {
        question.options.splice(optionIndex, 1);
        setFormBuilderData((prev) => ({
          ...prev,
          questions: updatedQuestions,
        }));
      }
    },
    [formBuilderData, setFormBuilderData]
  );

  const deleteQuestion = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, questionIndex: number) => {
      e.stopPropagation();
      const updatedQuestions = formBuilderData.questions.filter(
        (_, index) => index !== questionIndex
      );
      setFormBuilderData((prev) => ({
        ...prev,
        questions: updatedQuestions,
      }));
    },
    [formBuilderData, setFormBuilderData]
  );

  const toggleRequired = useCallback(
    (questionIndex: number) => {
      const updatedQuestions = [...formBuilderData.questions];
      updatedQuestions[questionIndex].required =
        !updatedQuestions[questionIndex].required;
      setFormBuilderData((prev) => ({
        ...prev,
        questions: updatedQuestions,
      }));
    },
    [formBuilderData, setFormBuilderData]
  );

  const updateQuestionField = useCallback(
    <K extends keyof questionType>(
      questionIndex: number,
      field: K,
      value: questionType[K]
    ) => {
      const updatedQuestions = [...formBuilderData.questions];
      updatedQuestions[questionIndex][field] = value; // Dynamically update the field
      setFormBuilderData((prev) => ({
        ...prev,
        questions: updatedQuestions,
      }));
    },
    [formBuilderData.questions, setFormBuilderData]
  );

  const updateOption = useCallback(
    (questionIndex: number, optionIndex: number, value: string) => {
      const updatedQuestions = [...formBuilderData.questions];
      const question = updatedQuestions[questionIndex];

      if (question.options) {
        question.options[optionIndex] = value; // Update the specific option
      }

      setFormBuilderData((prev) => ({
        ...prev,
        questions: updatedQuestions,
      }));
    },
    [formBuilderData.questions, setFormBuilderData]
  );
  const [draggedOverFormBuilder, setDraggedOverFormBuilder] =
    useState<boolean>(false);
  const handleDragoverFormBuilder = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setHoveredIndex(null);
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
      if (draggedIndex) return;
      const category = e.dataTransfer.getData("text/plain");
      if (category) {
        handleAddQuestion(category as questionType["category"]);
      }
      setDraggedOverFormBuilder(false);
    },
    [handleAddQuestion, draggedIndex]
  );

  return (
    <div
      onDragOver={handleDragoverFormBuilder}
      onDragLeave={handleDragLeaveFormBuilder}
      onDrop={handleDropFormBuilder}
      className={`h-full max-h-[calc(100vh-105px)] overflow-y-auto flex flex-col items-center gap-5 hide-scrollbar ${
        draggedOverFormBuilder && "border border-peerlistGreen"
      } max-md:p-2 p-6 justify-start`}
    >
      {formBuilderData.questions.map((question, questionIndex) => (
        <Card
          draggable
          onDragStart={() => handleDragStart(questionIndex)}
          onDragOver={(e) => handleDragOver(e, questionIndex)}
          onDragLeave={(e) => handleDragLeave(e, questionIndex)}
          onDrop={handleDrop}
          key={question.position}
          className={`w-full transition-all ${
            hoveredIndex === questionIndex
              ? "border-peerlistGreen shadow-lg"
              : "border"
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <CustomInput
                onChanged={(value) =>
                  updateQuestionField(questionIndex, "title", value)
                }
                placeholder={question?.title}
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
                variant={"helpText"}
                onChanged={(value) =>
                  updateQuestionField(questionIndex, "title", value)
                }
                placeholder={
                  question?.helpText ||
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
                    key={optionIndex}
                    className={`${
                      !option && "text-muted-foreground"
                    } flex items-center space-x-2`}
                  >
                    <RadioGroupItem
                      value={option || `Option ${optionIndex + 1}`}
                      id={option || `Option ${optionIndex + 1}`}
                    />
                    <CustomInput
                      onChanged={(value) =>
                        updateOption(questionIndex, optionIndex, value)
                      }
                      placeholder={option || `Option ${optionIndex + 1}`}
                    />
                    {question.options && (
                      <>
                        {optionIndex === 0 ? null : (
                          <MinusIcon
                            onClick={() =>
                              removeOption(questionIndex, optionIndex)
                            }
                          />
                        )}
                        {optionIndex === question.options.length - 1 &&
                          optionIndex !== 3 && (
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
      {formBuilderData.questions.length <= 3 && <AddQuestions />}
      <div className="m-0" ref={scrollRef}></div>
    </div>
  );
}

export default FormBuilder;
