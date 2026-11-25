import type { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  htmlFor: string;
  label: string;
}

const AccountFormField = ({ children, htmlFor, label }: IProps) => (
  <div className="space-y-1.5">
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-ink">
      {label}
    </label>
    {children}
  </div>
);

export default AccountFormField;
