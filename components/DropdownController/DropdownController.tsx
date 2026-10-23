import { Control, Controller } from 'react-hook-form';
import { Select } from '@/components/Select/Select';

interface DropdownFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  options: string[];
  placeholder: string;
  disabled?: boolean;
  rules?: any;
  error?: string;
  required?: boolean;
  search?: boolean;
  defaultValue?: string;
  onSelect?: (value: string) => void;
}

// react-hook-form wrapper around the bottom-sheet Select
export function DropdownField({
  control,
  name,
  label,
  options,
  placeholder,
  disabled,
  rules,
  error,
  required,
  search,
  defaultValue,
  onSelect,
}: DropdownFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field: { onChange, value } }) => (
        <Select
          label={label}
          required={required}
          placeholder={placeholder}
          options={options}
          // Older listings stored the literal string "undefined" for empty optional fields
          value={value === 'undefined' ? null : value}
          onChange={(next) => {
            onChange(next ?? '');
            if (next) onSelect?.(next);
          }}
          searchable={search}
          disabled={disabled}
          error={disabled ? undefined : error}
        />
      )}
    />
  );
}
