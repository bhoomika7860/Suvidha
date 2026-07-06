export default function SectionHeader({ title, sub }) {
  return (
    <div className="mb-4">
      <h2 className="text-[28px] font-bold leading-none"
style={{ color: TEXT }} style={{ color: "#111827" }}>
        {title}
      </h2>

      {sub && (
        <p
className="text-[15px] mt-2"
style={{ color: MUTED }}
>
          {sub}
        </p>
      )}
    </div>
  );
}