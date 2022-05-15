import { useUserProfile } from "context/UserProfileContext";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";

export type WatchlistQuery = {
  loading: boolean;
  watchlist?: number[];
};

export function useWatchlist(): WatchlistQuery {
  const { status: sessionStatus, data: session } = useSession();
  const {
    loading: loadingProfiles,
    currentProfile,
    profiles,
    getWatchlistMovies,
  } = useUserProfile();
  const { isLoading, data: watchlist } = useQuery(
    ["users", session?.user.id, "profiles", currentProfile?.id, "watchlist"],
    () => getWatchlistMovies!(),
    { enabled: !!(session && currentProfile) }
  );
  const loading =
    sessionStatus !== "authenticated" || loadingProfiles || isLoading;
  if (loading) return { loading: true };
  if (profiles!.length === 0) return { loading: false, watchlist: undefined };
  return { loading: false, watchlist };
}
