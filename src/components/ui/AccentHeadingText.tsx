interface AccentHeadingTextProps {
  heading: string;
  accent?: string;
}

export function AccentHeadingText({ heading, accent }: AccentHeadingTextProps) {
  if (!accent || !heading.includes(accent)) {
    return <>{heading}</>;
  }

  const parts = heading.split(accent);
  return (
    <>
      {parts[0]}
      <span className="text-periwinkle-dark">{accent}</span>
      {parts[1]}
    </>
  );
}
