export function useLocalStorage(name: string) {
  const getItem = () => {
    const value = window.localStorage.getItem(name);
    if (value === null) {
      return value;
    }

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  };

  const setItem = (value: Record<string, any>) => {
    let valueToSet: string;

    if (typeof value !== "string") {
      valueToSet = JSON.stringify(value);
    } else {
      valueToSet = value;
    }

    window.localStorage.setItem(name, valueToSet);
  };

  const removeItem = () => {
    window.localStorage.removeItem(name);
  };
  return { setItem, getItem, removeItem };
}
