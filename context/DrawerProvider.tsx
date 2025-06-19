import React, { createContext, useContext, useState, useCallback } from "react";
import DrawerExample from "@/components/Drawer/Drawer";

type DrawerContextType = {
  openDrawer: () => void;
  closeDrawer: () => void;
  isOpen: boolean;
};

const DrawerContext = createContext<DrawerContextType>({
  openDrawer: () => {},
  closeDrawer: () => {},
  isOpen: false,
});

export function useDrawer() {
  return useContext(DrawerContext);
}

function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = useCallback(() => setIsOpen(true), []);
  const closeDrawer = useCallback(() => setIsOpen(false), []);

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer, isOpen }}>
      {children}
      <DrawerExample open={isOpen} onClose={closeDrawer} />
    </DrawerContext.Provider>
  );
}

export default DrawerProvider;
