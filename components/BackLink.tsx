import Link from "next/link";

type BackLinkProps = {
  href: string;
  ariaLabel: string;
  className?: string;
};

export default function BackLink({
  href,
  ariaLabel,
  className,
}: BackLinkProps) {
  const classes = [
    "inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={href} aria-label={ariaLabel} className={classes}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </svg>
    </Link>
  );
}
