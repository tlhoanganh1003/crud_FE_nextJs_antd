/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useRef, useState } from "react";
import type { FormInstance } from "antd";

interface FormHandlers {
  form: FormInstance;
  validateOnly: () => Promise<boolean>;
  submitFinal: () => Promise<void>;
}

interface SaveContextType {
  triggerSave: () => void;
  registerForm: (
    key: string,
    form: FormInstance,
    validateOnly: () => Promise<boolean>,
    submitFinal: () => Promise<void>
  ) => void;
  sharedData: Record<string, any>;
  setSharedData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  updateSharedField: (key: string, value: any) => void;
}

const SaveContext = createContext<SaveContextType | null>(null);

export const SaveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const formsRef = useRef<{ [key: string]: FormHandlers }>({});
  const [sharedData, setSharedData] = useState<Record<string, any>>({});

  const updateSharedField = (key: string, value: any) => {
    setSharedData((prev) => ({ ...prev, [key]: value }));
  };

  const registerForm = (
    key: string,
    form: FormInstance,
    validateOnly: () => Promise<boolean>,
    submitFinal: () => Promise<void>
  ) => {
    formsRef.current[key] = { form, validateOnly, submitFinal };
  };

  const triggerSave = async () => {
    try {
      //gọi Validate tất cả form
      for (const [key, handlers] of Object.entries(formsRef.current)) {
        const isValid = await handlers.validateOnly();
        if (!isValid) {
          console.warn(`Validate thất bại ở form ${key}`);
          return;
        }
      }

      // Submit tất cả form
      for (const [key, handlers] of Object.entries(formsRef.current)) {
        await handlers.submitFinal();
      }

      console.log("Tất cả form validate và submit thành công");
    } catch (err) {
      console.error("Có lỗi trong quá trình validate hoặc submit:", err);
    }
  };

  return (
    <SaveContext.Provider
      value={{
        triggerSave,
        registerForm,
        sharedData,
        setSharedData,
        updateSharedField
      }}
    >
      {children}
    </SaveContext.Provider>
  );
};

export const useSaveContext = () => {
  const context = useContext(SaveContext);
  if (!context) throw new Error("useSaveContext phải dùng trong SaveProvider");
  return context;
};
