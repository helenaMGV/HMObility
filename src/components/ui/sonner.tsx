import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background/95 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-primary/20 group-[.toaster]:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-muted-foreground/90",
          actionButton: "group-[.toast]:bg-gradient-to-r group-[.toast]:from-primary group-[.toast]:to-secondary group-[.toast]:text-white group-[.toast]:font-semibold group-[.toast]:hover:opacity-90 group-[.toast]:transition-all group-[.toast]:duration-300 group-[.toast]:shadow-lg",
          cancelButton: "group-[.toast]:bg-muted/80 group-[.toast]:backdrop-blur-sm group-[.toast]:text-muted-foreground group-[.toast]:hover:bg-muted group-[.toast]:transition-all group-[.toast]:duration-300",
        },
      }}
      position="top-right"
      expand={true}
      richColors
      {...props}
    />
  );
};

export { Toaster, toast };
