interface Props {
  label: string;
  title: string;
  subtitle: string;
}

export default function SectionTitle({
  label,
  title,
  subtitle,
}: Props) {
  return (
    <div className="mb-20 text-center">

      <p className="text-sm uppercase tracking-[8px] text-amber-400">
        {label}
      </p>

      <h2 className="mt-4 text-5xl md:text-6xl font-black text-white">
        {title}
      </h2>

      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-400">
        {subtitle}
      </p>

    </div>
  );
}