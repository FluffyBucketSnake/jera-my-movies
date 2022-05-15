import { useUserProfile } from "context/UserProfileContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { WatchlistMovieStatus } from "types/WatchlistMovieStatus";

type LoadingWatchlistStatusQuery = {
  loading: true;
  watchlistStatus?: undefined;
  addToWatchlist?: undefined;
};

type LoadedWatchlistStatusQuery = {
  loading: false;
  watchlistStatus: WatchlistMovieStatus;
  addToWatchlist: () => Promise<void>;
};

export type WatchlistStatusQuery =
  | LoadingWatchlistStatusQuery
  | LoadedWatchlistStatusQuery;

export function useWatchlistStatus(movieId: number): WatchlistStatusQuery {
  const {
    loading: profileLoading,
    currentProfile,
    addMovieToWatchlist,
    getWatchlistMovieStatus,
  } = useUserProfile();
  const queryClient = useQueryClient();

  const queryKey = ["profiles", currentProfile?.id, "watchlist", movieId];
  const { isSuccess: loadedData, data } = useQuery(
    queryKey,
    () => getWatchlistMovieStatus!(movieId),
    { enabled: !profileLoading }
  );
  const addToWatchlistMutation = useMutation(
    async (movieId: number) => {
      if (profileLoading) return;
      return addMovieToWatchlist(movieId);
    },
    {
      onError: (err) =>
        alert(
          "For some reason, we couldn't update your watchlist. Try again later."
        ),
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey);
      },
    }
  );
  const addToWatchlist = () => addToWatchlistMutation.mutateAsync(movieId);

  if (profileLoading || !loadedData || addToWatchlistMutation.isLoading) {
    return { loading: true };
  }
  return { loading: false, watchlistStatus: data, addToWatchlist };
}
