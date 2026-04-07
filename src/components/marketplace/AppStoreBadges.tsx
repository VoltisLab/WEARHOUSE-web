import {
  ANDROID_PLAY_STORE_URL,
  APP_STORE_BADGE_IMG,
  GOOGLE_PLAY_BADGE_IMG,
  IOS_APP_STORE_URL,
} from "@/lib/constants";

type Props = {
  className?: string;
};

function StoreLink({
  href,
  external,
  children,
}: {
  href: string;
  external: boolean;
  children: React.ReactNode;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-block shrink-0 transition-opacity hover:opacity-90"
      >
        {children}
      </a>
    );
  }
  return (
    <a href={href} className="inline-block shrink-0 transition-opacity hover:opacity-90">
      {children}
    </a>
  );
}

export function AppStoreBadges({ className = "" }: Props) {
  const iosHref = IOS_APP_STORE_URL || "/app";
  const androidHref = ANDROID_PLAY_STORE_URL || "/app";

  return (
    <div
      className={`flex flex-wrap items-center gap-3 sm:gap-4 ${className}`.trim()}
      aria-label="Download our mobile apps"
    >
      <StoreLink href={iosHref} external={!!IOS_APP_STORE_URL}>
        <img
          src={APP_STORE_BADGE_IMG}
          alt="Download on the App Store"
          className="h-10 w-auto md:h-11"
          width={120}
          height={40}
          loading="lazy"
        />
      </StoreLink>
      <StoreLink href={androidHref} external={!!ANDROID_PLAY_STORE_URL}>
        <img
          src={GOOGLE_PLAY_BADGE_IMG}
          alt="Get it on Google Play"
          className="h-10 w-auto md:h-11"
          width={135}
          height={40}
          loading="lazy"
        />
      </StoreLink>
    </div>
  );
}
