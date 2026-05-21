import type { ReactElement } from "react";

type AmountInputProps = {
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
};

export function AmountInput({ value, onChange, errorMessage }: AmountInputProps): ReactElement {
  return (
    <div className="space-y-2">
      <label htmlFor="expense-amount" className="text-sm font-semibold text-text">
        ยอดเสียหายเท่าไหร่?
      </label>
      <div className="rounded-card border border-borderSoft bg-track/70 px-4 py-3">
        <div className="font-display text-sm text-muted">THB</div>
        <input
          id="expense-amount"
          inputMode="numeric"
          autoComplete="off"
          placeholder="0"
          value={value}
          onChange={(event) => {
            const sanitized = event.target.value.replace(/[^0-9]/g, "");
            onChange(sanitized);
          }}
          className="mt-1 w-full bg-transparent font-display text-4xl font-bold leading-none text-text outline-none placeholder:text-muted/60 [font-size:16px] sm:[font-size:2.25rem]"
        />
      </div>
      {errorMessage ? <p className="text-xs text-danger">{errorMessage}</p> : null}
    </div>
  );
}
