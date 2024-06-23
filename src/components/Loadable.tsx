import { lazy, Suspense } from "react";

const Loadable = (factory: Parameters<typeof lazy>[0]) => () => {
  const Component = lazy(factory);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Component />
    </Suspense>
  );
};

export default Loadable;
