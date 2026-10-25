import { cn } from '@/utils/cn';

/** Label + control wrapper. */
export function Field({ label, hint, className, children }) {
  return (
    <div className={className}>
      {label && <label className="field-label">{label}</label>}
      {children}
      {hint && <span className="text-[10px] text-faint mt-1 block">{hint}</span>}
    </div>
  );
}

export function TextInput({ label, hint, className, wrapperClassName, ...props }) {
  return (
    <Field label={label} hint={hint} className={wrapperClassName}>
      <input className={cn('input', className)} {...props} />
    </Field>
  );
}

export function TextArea({ label, hint, className, wrapperClassName, rows = 4, ...props }) {
  return (
    <Field label={label} hint={hint} className={wrapperClassName}>
      <textarea rows={rows} className={cn('input', className)} {...props} />
    </Field>
  );
}

/** `options` can be strings or { value, label } objects. */
export function Select({ label, hint, options, className, wrapperClassName, ...props }) {
  return (
    <Field label={label} hint={hint} className={wrapperClassName}>
      <select className={cn('input', className)} {...props}>
        {options.map((o) => {
          const { value, label: text } = typeof o === 'string' ? { value: o, label: o } : o;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
    </Field>
  );
}
