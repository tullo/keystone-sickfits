import { useEffect, useState } from 'react';

export default function useForm(initial = {}) {
  // create a state object for inputs
  const [inputs, setInputs] = useState(initial);

  // needed to prevent React from looping infintly => useEffect.
  const initialValues = Object.values(initial).join('');

  useEffect(() => {
    // triggered when watched state changes => initialValues.
    setInputs(initial);
  }, [initial, initialValues]);

  function handleChange(e) {
    let { name, value, type } = e.target;
    if (type === 'number') {
      value = parseInt(value);
    }
    if (type === 'file') {
      [value] = e.target.files;
    }
    setInputs({
      // ... => copy the existing state.
      ...inputs,
      [name]: value,
    });
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key]) => [key, ''])
    );
    setInputs(blankState);
  }

  // return the things we want to surface from this custom hook.
  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
