import { cn } from "@/utils";

type Variant = "primary" | "secondary";

const variants: Record<Variant, string> = {
  primary: "bg-slate-900",
  secondary: "bg-red-600",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export const Button = (props: ButtonProps) => (
  <button
    {...props}
    className={cn(
      "flex h-10 px-4 py-2 text-slate-50 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      variants[props.variant ?? "primary"],
      props.className
    )}
  >
    {props.children}
  </button>
);
