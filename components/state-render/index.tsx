import React from "react";

interface Props {
  children: any;
  data: any;
  isLoading: any;
  isError?: any;
  isEmpty?: any;
}

const StateRenderContext = React.createContext<Partial<Props>>({});
StateRenderContext.displayName = "StateRenderContext";

const useStateRender = () => {
  const context = React.useContext(StateRenderContext);
  return context;
};

function Empty({ children }: { children: any }) {
  const { isEmpty } = useStateRender();
  if (isEmpty) return children;
  return null;
}

function Loading({ children }: { children: any }) {
  const { isLoading } = useStateRender();
  if (isLoading) return children;
  return null;
}

function Error({ children }: { children: any }) {
  const { isError } = useStateRender();
  if (isError) return children;
  return null;
}

function Data({ children }: { children: any }) {
  const { data } = useStateRender();
  if (data) return children;
  return null;
}

function StateRender({ children, data, isLoading, isError, isEmpty }: Props) {
  const value = React.useMemo(
    () => ({ data, isLoading, isError, isEmpty }),
    [data, isLoading, isError, isEmpty]
  );
  return (
    <StateRenderContext.Provider value={value}>
      {children}
    </StateRenderContext.Provider>
  );
}

StateRender.Loading = Loading;
StateRender.Error = Error;
StateRender.Data = Data;
StateRender.Empty = Empty;

export default StateRender;
