import { twMerge } from 'tailwind-merge';

type ButtonProps = {
  type?: HTMLButtonElement['type'];
  label: string;
  onClick?: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
  tone?: 'default' | 'critical';
};

export function Button({
  type = 'button',
  label,
  onClick,
  fullWidth = false,
  disabled = false,
  tone = 'default',
}: ButtonProps) {
  const styles = twMerge(
    'flex justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    tone === 'default' &&
      'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600',
    tone === 'critical' &&
      'bg-red-600 hover:bg-red-500 focus-visible:outline-red-600',
    fullWidth && 'w-full',
    disabled && 'bg-gray-300 hover:bg-gray-300',
  );

  return (
    <button
      type={type}
      onClick={onClick}
      className={styles}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
