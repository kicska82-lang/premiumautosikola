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

      <p className="text-xl font-semibold uppercase tracking-[0.25em] text-amber-400 md:text-2xl">
        {label}
      </p>

      <h2 className="mt-4 text-3xl font-black text-white md:text-4xl">
        {title}
      </h2>

      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-400">
        {subtitle}
      </p>

    </div>
  );
}
