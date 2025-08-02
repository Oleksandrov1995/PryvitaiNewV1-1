import { useState } from 'react';

export const useFormData = (initialData = {}) => {
  const [formData, setFormData] = useState(initialData);

  const updateField = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData(initialData);
  };

  const getFormData = () => {
    return formData;
  };

  return {
    formData,
    updateField,
    resetForm,
    getFormData
  };
};