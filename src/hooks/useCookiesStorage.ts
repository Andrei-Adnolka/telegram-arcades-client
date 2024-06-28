import Cookies from "js-cookie";

export function useCookiesStorage(name: string) {
  const getItem = () => {
    const value = Cookies.get(name);
    if (!value) {
      return {};
    }
    return JSON.parse(value);
  };

  const setItem = (value: Record<string, any>) => {
    Cookies.set(name, JSON.stringify(value), { expires: 30 });
  };

  const removeItem = () => {
    Cookies.remove(name);
  };

  return { setItem, getItem, removeItem };
}
