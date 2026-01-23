import { ReactNode } from "react";

interface StepContainerProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function StepContainer({
  title,
  description,
  children,
}: StepContainerProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
      <div className="min-h-[300px]">{children}</div>
    </div>
  );
}
