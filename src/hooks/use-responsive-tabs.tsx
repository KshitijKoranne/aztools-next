
import { useState, useEffect } from 'react';

export const useResponsiveTabs = (tabConfig: Record<string, { desktopLabel: string; mobileLabel: string }>) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const getTabLabel = (tabValue: string) => {
    return isMobile ? tabConfig[tabValue].mobileLabel : tabConfig[tabValue].desktopLabel;
  };

  const tabListClasses = isMobile ? "grid w-full grid-cols-5" : "";
  const tabTriggerClasses = isMobile ? "text-xs p-2" : "";

  return { tabListClasses, tabTriggerClasses, getTabLabel, isMobile };
};
