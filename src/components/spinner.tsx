export const Spinner = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      className={`h-6 w-6 animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_57_4735)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.1231 20.9254C4.5041 35.6915 27.5077 35.6915 18.877 20.9254C32.0195 35.6915 35.6918 32.0257 20.9246 18.8777C35.6918 27.4969 35.6918 4.49241 20.9246 13.1236C35.6918 -0.0245627 32.0245 -3.69196 18.877 11.0758C27.4958 -3.69196 4.49226 -3.69196 13.1231 11.0758C-0.0245337 -3.69196 -3.69179 -0.0245627 11.0754 13.1236C-3.69179 4.50425 -3.69179 27.5088 11.0754 18.8777C-3.69179 32.0257 -0.0245337 35.6915 13.1231 20.9254ZM16 20C18.2091 20 20 18.2091 20 16C20 13.7908 18.2091 12 16 12C13.7909 12 12 13.7908 12 16C12 18.2091 13.7909 20 16 20Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_57_4735">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
