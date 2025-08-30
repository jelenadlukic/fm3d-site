"use client";
import * as React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  message?: string;
};

/** Submit dugme koje pita za potvrdu. Ako korisnik klikne "Cancel", spreči submit. */
export function ConfirmButton({ message = "Obrisati?", ...props }: Props) {
  return (
    <button
      {...props}
      onClick={(e) => {
        if (props.onClick) props.onClick(e);     // zadrži eventualni onClick
        if (e.defaultPrevented) return;
        const ok = typeof window !== "undefined" ? window.confirm(message) : true;
        if (!ok) e.preventDefault();             // spreči submit forme
      }}
    />
  );
}
