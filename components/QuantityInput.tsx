import type { ChangeEvent } from 'react';

type QuantityInputProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  ariaLabel?: string;
  inputId?: string;
};

const clampValue = (value: number, min: number, max?: number) => {
  let next = Math.max(min, value);
  if (typeof max === 'number') {
    next = Math.min(max, next);
  }
  return next;
};

export default function QuantityInput({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
  className = '',
  inputClassName = '',
  ariaLabel = 'Quantity',
  inputId,
}: QuantityInputProps) {
  const decreaseDisabled = disabled || value <= min;
  const increaseDisabled = disabled || (typeof max === 'number' && value >= max);

  const handleDecrease = () => {
    if (decreaseDisabled) return;
    onChange(clampValue(value - 1, min, max));
  };

  const handleIncrease = () => {
    if (increaseDisabled) return;
    onChange(clampValue(value + 1, min, max));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const digitsOnly = event.target.value.replace(/[^0-9]/g, '');
    const parsed = Number.parseInt(digitsOnly, 10);
    if (Number.isNaN(parsed)) {
      onChange(min);
      return;
    }
    onChange(clampValue(parsed, min, max));
  };

  return (
    <div
      className={`flex items-stretch rounded-lg border border-gray-200 dark:border-gray-700 ${
        disabled ? 'opacity-60' : ''
      } ${className}`.trim()}
      aria-disabled={disabled}
    >
      <button
        type="button"
        onClick={handleDecrease}
        disabled={decreaseDisabled}
        className="w-9 shrink-0 text-lg font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:text-gray-400 disabled:hover:bg-transparent transition-colors"
        aria-label={`Decrease ${ariaLabel}`}
      >
        -
      </button>
      <input
        id={inputId}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        className={`text-center text-sm font-medium bg-transparent focus:outline-none focus:ring-1 focus:ring-primary-500 dark:text-white py-1.5 ${inputClassName}`.trim()}
        aria-label={ariaLabel}
      />
      <button
        type="button"
        onClick={handleIncrease}
        disabled={increaseDisabled}
        className="w-9 shrink-0 text-lg font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:text-gray-400 disabled:hover:bg-transparent transition-colors"
        aria-label={`Increase ${ariaLabel}`}
      >
        +
      </button>
    </div>
  );
}
