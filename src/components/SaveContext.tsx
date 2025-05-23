/* eslint-disable @typescript-eslint/no-explicit-any */
// SaveContext.tsx
import React, { createContext, useContext, useRef, useState } from "react";
import type { FormInstance } from "antd";

interface SaveContextType {
  triggerSave: () => void;
  registerForm: (key: string, form: FormInstance) => void;
  sharedData: Record<string, any>;
  setSharedData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  updateSharedField: (key: string, value: any) => void;
}

const SaveContext = createContext<SaveContextType | null>(null);

export const SaveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const formsRef = useRef<{ [key: string]: FormInstance }>({});
  const [sharedData, setSharedData] = useState<Record<string, any>>({});
  const updateSharedField = (key: string, value: any) => {
    setSharedData((prev) => ({ ...prev, [key]: value }));
  };

  const registerForm = (key: string, form: FormInstance) => {
    formsRef.current[key] = form;
  };

  const triggerSave = async () => {
    const formEntries = Object.entries(formsRef.current);
    try {
      const allValues = await Promise.all(
        formEntries.map(([key, form]) =>
          form.validateFields().then((values) => ({ key, values }))
        )
      );
      console.log("✅ Dữ liệu hợp lệ:", allValues);
    } catch (err) {
      console.warn("❌ Lỗi validate:", err);
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
