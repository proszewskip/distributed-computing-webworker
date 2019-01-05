/**
 * Returns FormData for a specific object.
 *
 * The keys and values are kept unchanged.
 *
 * @param model
 */
export function getFormData(model: object) {
  const formData = new FormData();

  for (const [property, value] of Object.entries(model)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        formData.append(property, item);
      }
      continue;
    }

    formData.append(property, value);
  }

  return formData;
}
