import { useUserProfile } from "context/UserProfileContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { WatchlistMovieStatus } from "types/WatchlistMovieStatus";

type LoadingWatchlistStatusQuery = {
  status: "loading";
  movieStatus?: undefined;
  addToWatchlist?: undefined;
};

type NoProfileWatchlistStatusQuery = {
  status: "noprofile";
  movieStatus?: undefined;
  addToWatchlist?: undefined;
};

type LoadedWatchlistStatusQuery = {
  status: "loaded";
  movieStatus: WatchlistMovieStatus;
  addToWatchlist: () => Promise<void>;
};

export type WatchlistStatusQuery =
  | LoadingWatchlistStatusQuery
  | NoProfileWatchlistStatusQuery
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
    { enabled: !!currentProfile }
  );
  const addToWatchlistMutation = useMutation(
    async (movieId: number) => {
      if (profileLoading) return;
      console.log(currentProfile);
      return addMovieToWatchlist(movieId);
    },
    {
      onError: () =>
        alert(
          "For some reason, we couldn't update your watchlist. Try again later."
        ),
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey);
      },
    }
  );
  const addToWatchlist = () => addToWatchlistMutation.mutateAsync(movieId);

  if (profileLoading) return { status: "loading" };
  if (!currentProfile) return { status: "noprofile" };
  if (!loadedData || addToWatchlistMutation.isLoading) {
    return { status: "loading" };
  }
  return { status: "loaded", movieStatus: data, addToWatchlist };
}
