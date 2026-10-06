interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  return (
    <div className={`toast ${type}`} role="alert">
      <span>{message}</span>
      <button onClick={onClose} aria-label="Close notification">×</button>
    </div>
  );
}