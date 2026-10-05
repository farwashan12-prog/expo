import * as React from 'react';

export function useThenable<T>(create: () => PromiseLike<T>) {
  const [promise] = React.useState(create);

  let initialState: [boolean, T | undefined] = [false, undefined];

  // Check if our thenable is synchronous
  promise.then(
    (result) => {
      initialState = [true, result];
    },
    // The effect below rethrows a rejection during render.
    () => {}
  );

  const [state, setState] = React.useState(initialState);
  const [resolved] = state;

  React.useEffect(() => {
    let cancelled = false;

    const resolve = async () => {
      let result;

      try {
        result = await promise;
      } catch (error) {
        if (!cancelled) {
          // Throw during render so the error reaches an error boundary.
          setState(() => {
            throw error;
          });
        }
        return;
      }
      if (!cancelled) {
        setState([true, result]);
      }
    };

    if (!resolved) {
      resolve();
    }

    return () => {
      cancelled = true;
    };
  }, [promise, resolved]);

  return state;
}
