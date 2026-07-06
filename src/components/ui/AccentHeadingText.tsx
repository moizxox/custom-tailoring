interface AccentHeadingTextProps {
  heading: string;
  accent?: string;
  /** Override accent text color (CSS color string). Defaults to periwinkle-dark. */
  accentColor?: string;
}

export function AccentHeadingText({ heading, accent, accentColor }: AccentHeadingTextProps) {
  if (!accent || !heading.includes(accent)) {
    return <>{heading}</>;
  }

  const parts = heading.split(accent);
  return (
    <>
      {parts[0]}
      <span
        className={accentColor ? undefined : "text-periwinkle-dark"}
        style={accentColor ? { color: accentColor } : undefined}
      >
        {accent}
      </span>
      {parts[1]}
    </>
  );
}
