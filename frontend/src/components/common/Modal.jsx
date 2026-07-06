function Modal({ children, open = false, className = "" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className={`w-full max-w-lg rounded-xl bg-white p-6 shadow-xl ${className}`}>{children}</div>
    </div>
  );
}

export default Modal;
