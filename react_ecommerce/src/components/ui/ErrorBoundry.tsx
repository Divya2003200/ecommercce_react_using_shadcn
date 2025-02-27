import { ErrorBoundary } from "react-error-boundary";

export function ErrorFallback({ error }: { error: Error }) {
  return <div>Something went wrong: {error.message}</div>;
}


