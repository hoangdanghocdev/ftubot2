import React from "react";

interface FormFillingProps {
  userId: string;
}

const FormFilling: React.FC<FormFillingProps> = ({ userId }) => {
  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-4">Form Filling Feature</h2>
      <p>User ID: {userId}</p>
      <p>This is where your form filling UI and logic will go.</p>
    </div>
  );
};

export default FormFilling;
