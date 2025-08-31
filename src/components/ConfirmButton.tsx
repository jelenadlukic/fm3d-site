"use client";

type Props = {
  children: React.ReactNode;
  className?: string;
  message?: string; // tekst za confirm
  type?: "button" | "submit";
};

export function ConfirmButton({ children, className, message, type = "button" }: Props) {
  return (
    <button
      type={type}
      className={className}
      onClick={(e) => {
        if (message && !window.confirm(message)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
