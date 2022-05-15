import { useUserProfile } from "context/UserProfileContext";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";

export type SuggestedMoviesQuery = {
  loading: boolean;
  movies?: number[];
};

export function useSuggestedMovies(): SuggestedMoviesQuery {
  const { status: sessionStatus, data: session } = useSession();
  const {
    loading: loadingProfiles,
    currentProfile,
    profiles,
    getSuggestedMovies,
  } = useUserProfile();
  const { isLoading, data: movies } = useQuery(
    ["users", session?.user.id, "profiles", currentProfile?.id, "suggested"],
    () => getSuggestedMovies!(),
    { enabled: !!(session && currentProfile) }
  );
  const loading =
    sessionStatus !== "authenticated" || loadingProfiles || isLoading;
  if (loading) return { loading: false };
  if (profiles!.length === 0) return { loading: true, movies: undefined };
  return { loading: true, movies };
}
