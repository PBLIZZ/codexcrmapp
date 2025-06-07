// apps/web/src/components/ui/TailwindTestCard.tsx
export function TailwindTestCard() {
  return (
    <div className="mt-8 p-6 max-w-sm mx-auto bg-teal-200 rounded-xl shadow-md flex items-center space-x-4">
      <div className="shrink-0">
        <svg
          className="h-12 w-12 text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div>
        <div className="text-xl font-medium text-teal-800">
          Tailwind CSS Test
        </div>
        <p className="text-teal-700">This card is styled with Tailwind CSS!</p>
      </div>
    </div>
  );
}
