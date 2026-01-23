import { ReactNode } from "react";

interface StepContainerProps {
  title: string;
  description: string;
  children: ReactNode;
}

const FIXED_HEIGHT = "min-h-[562px]";

export function StepContainer({
  title,
  description,
  children,
}: StepContainerProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col ${FIXED_HEIGHT}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
