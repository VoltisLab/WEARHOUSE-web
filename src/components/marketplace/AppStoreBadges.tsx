import {
  ANDROID_PLAY_STORE_URL,
  APP_STORE_BADGE_IMG,
  GOOGLE_PLAY_BADGE_IMG,
  IOS_APP_STORE_URL,
} from "@/lib/constants";

type Props = {
  className?: string;
};

export function AppStoreBadges({ className = "" }: Props) {
  const ios = IOS_APP_STORE_URL;
  const android = ANDROID_PLAY_STORE_URL;

  if (!ios && !android) return null;

  return (
    <div
      className={`flex flex-wrap items-center gap-4 ${className}`.trim()}
      aria-label="Download our mobile apps"
    >
      {ios ? (
        <a
          href={ios}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-block shrink-0 transition-opacity hover:opacity-90"
        >
          <img
            src={APP_STORE_BADGE_IMG}
            alt="Download on the App Store"
            className="h-10 w-auto md:h-11"
            width={120}
            height={40}
            loading="lazy"
          />
        </a>
      ) : null}
      {android ? (
        <a
          href={android}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-block shrink-0 transition-opacity hover:opacity-90"
        >
          <img
            src={GOOGLE_PLAY_BADGE_IMG}
            alt="Get it on Google Play"
            className="h-10 w-auto md:h-11"
            width={135}
            height={40}
            loading="lazy"
          />
        </a>
      ) : null}
    </div>
  );
}
