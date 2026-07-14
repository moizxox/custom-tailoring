import Link from "next/link";
import Image from "next/image";
import { LogoutButton } from "./LogoutButton";

interface PortalHeaderProps {
  customerName?: string;
  showLogout?: boolean;
  unreadCount?: number;
}

export function PortalHeader({ customerName, showLogout = true, unreadCount }: PortalHeaderProps) {
  return (
    <header className="border-b border-stone-light/80 bg-offwhite-pure/90 backdrop-blur-md">
      <div className="container-site flex items-center justify-between h-14">
        <Link href="/kundenbereich" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-periwinkle-lighter flex items-center justify-center">
            <Image
              src="/icons/sewing/tape-measure-sewing-tailoring-size.svg"
              alt=""
              width={16}
              height={16}
              className="icon-periwinkle"
            />
          </div>
          <div className="leading-tight">
            <span className="font-serif text-sm text-charcoal block">Kundenbereich</span>
            {customerName && (
              <span className="font-sans text-[10px] text-charcoal-lighter">{customerName}</span>
            )}
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/kundenbereich/nachrichten"
            className="relative text-xs font-sans text-charcoal-lighter hover:text-charcoal transition-colors hidden sm:inline"
          >
            Nachrichten
            {unreadCount && unreadCount > 0 ? (
              <span className="ml-1 inline-flex items-center justify-center w-4 h-4 bg-periwinkle-dark text-white text-[9px] font-sans font-bold rounded-full">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : null}
          </Link>
          <Link
            href="/"
            className="text-xs font-sans text-charcoal-lighter hover:text-charcoal transition-colors hidden sm:inline"
          >
            Zur Website
          </Link>
          {showLogout && <LogoutButton />}
        </div>
      </div>
    </header>
  );
}
