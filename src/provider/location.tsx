import { useEffect, FC, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface LocationProviderProps {
  children: React.ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  // @ts-ignore
  if (!window?.Telegram?.WebApp?.initData?.length) {
    return <>{children}</>
  } else {
    return <LocationProviderInner>{children}</LocationProviderInner>
  }
}

const LocationProviderInner: React.FC<LocationProviderProps> = ({
  children,
}) => {
  const location = useLocation()
  const navigate = useNavigate()

  const redirectToLastPage = () => {
    const currentLocation = Cookies.get("location_app")
    if (!currentLocation) return
    navigate(currentLocation)
  }

  React.useEffect(() => {
    if (location.key === "default") redirectToLastPage()

    Cookies.set("location_app", location.pathname, {
      expires: new Date(new Date().getTime() + 10 * 60 * 1000), // 10 min
    })
  }, [location.key])

  return <>{children}</>
}

  return <>{children}</>;
};
