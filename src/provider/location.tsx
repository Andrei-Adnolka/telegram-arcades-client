import { useEffect, FC, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface LocationProviderProps {
  children: React.ReactNode;
}

export const LocationProvider: FC<LocationProviderProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const redirectToLastPage = useCallback(() => {
    const currentLocation = Cookies.get("location_app");

    if (!currentLocation) return;

    navigate(currentLocation);
  }, [navigate]);

  useEffect(() => {
    Cookies.set("location_app", location.pathname, {
      expires: new Date(new Date().getTime() + 1 * 60 * 1000),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  useEffect(() => {
    if (location.key === "default") redirectToLastPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};
