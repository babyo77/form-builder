// import { useUserContext } from "@/store/userStore";
// import React, { useState } from "react";
// import DragIcon from "@/components/icons/DragIcon";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import PlusIcon from "@/components/icons/PlusIcon";
// import { iconMapping, inputFieldMapping } from "@/lib/utils";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import MinusIcon from "@/components/icons/MinusIcon";
// import CustomInput from "@/components/customInput";
// import { AddQuestions } from "@/components/AddQuestions";
// import { questionType } from "@/types/types";

// function FormBuilderQuestionsComp({
//   question,
//   index,
// }: {
//   question: questionType;
//   index: number;
// }) {
//   const { formBuilderData, setFormBuilderData } = useUserContext();
//   const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
//   const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

//   // Drag start handler
//   const handleDragStart = (index: number) => {
//     setDraggedIndex(index);
//   };

//   // Drag over handler
//   const handleDragOver = (e: React.DragEvent, index: number) => {
//     e.preventDefault();
//     setHoveredIndex(index);
//   };

//   // Drag leave handler to reset hover
//   const handleDragLeave = (e: React.DragEvent, index: number) => {
//     e.preventDefault();
//     setHoveredIndex(null);
//     if (draggedIndex === null || draggedIndex === index) return;

//     const updatedCards = [...formBuilderData.questions];
//     const [draggedCard] = updatedCards.splice(draggedIndex, 1); // Remove dragged card
//     updatedCards.splice(index, 0, draggedCard); // Insert it at the hovered index
//     console.log(updatedCards);

//     // Update the state after drag operation
//     setFormBuilderData((prev) => ({ ...prev, questions: updatedCards }));
//   };

//   // Drop handler to reset dragging states
//   const handleDrop = () => {
//     setDraggedIndex(null);
//     setHoveredIndex(null);
//   };

//   return (
//     <Card
//       draggable
//       onDragStart={() => handleDragStart(index)}
//       onDragOver={(e) => handleDragOver(e, index)}
//       onDragLeave={(e) => handleDragLeave(e, index)}
//       onDrop={handleDrop}
//       key={question.position}
//       className={`w-full transition-all ${
//         hoveredIndex === index ? "border-peerlistGreen shadow-lg" : "border"
//       }`}
//     >
//       <CardHeader>
//         <CardTitle className="flex items-center gap-4">
//           <CustomInput placeholder={question?.title} variant={"title"} />
//           <div className=" flex gap-1">
//             <div className=" flex  items-center">
//               {iconMapping[question?.category]}
//               <AddQuestions isInputField />
//             </div>
//             <DragIcon />
//           </div>
//         </CardTitle>
//         <CardDescription>
//           <CustomInput
//             variant={"helpText"}
//             placeholder={
//               question?.helpText ||
//               "Write a help text or caption (leave empty if not needed)."
//             }
//           />
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         {question.category === "single_select" ? (
//           <RadioGroup>
//             {question?.options?.map((option, index) => (
//               <div
//                 key={index}
//                 className={`${
//                   !option && "text-muted-foreground"
//                 } flex items-center space-x-2`}
//               >
//                 <RadioGroupItem
//                   value={option || `Option ${index + 1}`}
//                   id={option || `Option ${index + 1}`}
//                 />
//                 <CustomInput placeholder={option || `Option ${index + 1}`} />

//                 {question.options && (
//                   <>
//                     {index === 0 ? null : question.options?.length === 4 &&
//                       index >= 1 &&
//                       index <= 3 ? (
//                       <MinusIcon />
//                     ) : question.options.length < 4 ? (
//                       <PlusIcon />
//                     ) : (
//                       index === 2 &&
//                       question.options.length === 2 && <PlusIcon />
//                     )}
//                   </>
//                 )}
//               </div>
//             ))}
//           </RadioGroup>
//         ) : (
//           <>{inputFieldMapping[question?.category]}</>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

// const FormBuilderQuestions = React.memo(FormBuilderQuestionsComp);
// export default FormBuilderQuestions;
