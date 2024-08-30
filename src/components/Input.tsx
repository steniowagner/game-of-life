import { cn } from "@/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  label?: string;
};

export const Input = (props: InputProps) => (
  <div>
    {props.label && (
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-accent-foreground">
        {props.label}
      </label>
    )}
    <input
      {...props}
      className={cn(
        "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-accent-foreground",
        "h-8 mt-1 focus-visible:ring-transparent focus:border-slate-500 focus:ring-1 focus:ring-slate-500",
        props.className
      )}
    />
  </div>
);
