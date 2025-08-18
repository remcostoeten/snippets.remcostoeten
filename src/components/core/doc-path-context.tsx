"use client";

import { createContext, useContext } from "react";

type TDocPathContext = {
  mdxPath: string | null;
};

const Ctx = createContext<TDocPathContext>({ mdxPath: null });

type TProps = {
  mdxPath: string | null;
  children: React.ReactNode;
};

export function DocPathProvider(props: TProps) {
  return (
    <Ctx.Provider value={{ mdxPath: props.mdxPath }}>
      {props.children}
    </Ctx.Provider>
  );
}

export function useDocPath(): TDocPathContext {
  return useContext(Ctx);
}
