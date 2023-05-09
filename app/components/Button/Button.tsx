interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({ label, disabled = false, ...props }: ButtonProps) => {
  return (
    <button
      type="button"
      disabled={!!disabled}
      className="border rounded-sm border-gray-800 px-2.5 py-2 text-sm text-gray-800 shadow-md transition-all focus:ring focus:ring-gray-300 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300"
      {...props}
    >
      {label}
    </button>
  );
};
