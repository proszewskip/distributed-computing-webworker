export function getFormData(model: object) {
  const formData = new FormData();

  for (const entry of Object.entries(model)) {
    formData.append(entry[0], entry[1]);
  }

  return formData;
}
