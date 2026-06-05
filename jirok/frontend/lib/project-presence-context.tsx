"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type ProjectPresenceContextValue =
  | [number[], Dispatch<SetStateAction<number[]>>]
  | null;

const ProjectPresenceContext = createContext<ProjectPresenceContextValue>(null);

export function ProjectPresenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useState<number[]>([]);

  return (
    <ProjectPresenceContext.Provider value={value}>
      {children}
    </ProjectPresenceContext.Provider>
  );
}

export function useProjectPresence() {
  const context = useContext(ProjectPresenceContext);

  if (!context) {
    throw new Error(
      "useProjectPresence must be used within a ProjectPresenceProvider",
    );
  }

  return context;
}
