interface EmptyStateProps {
  title: string;
  description: string;
  buttonText?: string;
  onClick?: () => void;
}

export const EmptyState = ({title, description, buttonText, onClick}: EmptyStateProps) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center bg-white rounded-lg border border-dashed border-gray-300 p-10 text-center">
        <div className="w-20 h-20">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Empty folder">
                {/* Основное тело */}
                <rect x="6" y="18" width="52" height="34" rx="4" fill="#E5E7EB"/>
                
                {/* Верхняя линия папки */}
                <path
                d="M6 22h20l4-6h28v6"
                stroke="#9CA3AF"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                />

                {/* Разделительная линия */}
                <path
                d="M10 26h44"
                stroke="#9CA3AF"
                strokeWidth="1.4"
                strokeLinecap="round"
                />

                {/* Контент внутри */}
                <path
                d="M18 34h28"
                stroke="#6B7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                />
            </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
        </h3>
        <p className="text-sm text-gray-500 mb-4 max-w-sm">
            {description}
        </p>

        {buttonText && onClick && (
            <button
            onClick={onClick}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
            {buttonText}
            </button>
        )}
    </div>
  );
}