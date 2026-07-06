function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
