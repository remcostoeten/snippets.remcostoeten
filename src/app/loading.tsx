export default function Loading() {
  return (
    <div className="grid w-screen h-screen place-items-center">
      <span className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 animate-pulse" />
    </div>
  );
}