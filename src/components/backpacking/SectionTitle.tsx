export default function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 font-[family-name:var(--font-cormorant-garamond)] text-3xl font-semibold">
      {children}
    </h2>
  );
}
