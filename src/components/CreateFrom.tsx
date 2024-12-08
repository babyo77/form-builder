"use client";
import FormFooter from "@/components/FormFooter";
import FormHeader from "@/components/FormHeader";
import FromBuilder from "@/components/FormBuilder";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "./RightSidebar";

function CreateFrom() {
  return (
    <main className="w-full h-screen overflow-hidden max-sm:px-0 max-lg:px-0  max-md:px-0 border max-xs:px-0 max-xl:px-0 max-2xl:px-24 grid-cols-1 grid md:grid-cols-4 items-center justify-center">
      <LeftSidebar />
      <div className="col-span-2 flex flex-col justify-between border h-full">
        {/* Header */}
        <FormHeader />

        {/* form builder */}
        <FromBuilder />

        {/* Footer */}
        <FormFooter />
      </div>
      <RightSidebar />
    </main>
  );
}

export default CreateFrom;
