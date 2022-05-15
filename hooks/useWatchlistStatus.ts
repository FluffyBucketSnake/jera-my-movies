import { useUserProfile } from "context/UserProfileContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { WatchlistMovieStatus } from "types/WatchlistMovieStatus";

type LoadingWatchlistStatusQuery = {
  status: "loading";
  addToWatchlist?: undefined;
  markAsWatched?: undefined;
};

type NoProfileWatchlistStatusQuery = {
  status: "noprofile";
  addToWatchlist?: undefined;
  markAsWatched?: undefined;
};

type NotAddedWatchlistStatusQuery = {
  status: "notadded";
  addToWatchlist: () => Promise<void>;
  markAsWatched?: undefined;
};

type UnwatchedWatchlistStatusQuery = {
  status: "unwatched";
  addToWatchlist?: undefined;
  markAsWatched: () => Promise<void>;
};

type WatchedWatchlistStatusQuery = {
  status: "watched";
  addToWatchlist?: undefined;
  markAsWatched?: undefined;
};

export type WatchlistStatusQuery =
  | LoadingWatchlistStatusQuery
  | NoProfileWatchlistStatusQuery
  | NotAddedWatchlistStatusQuery
  | UnwatchedWatchlistStatusQuery
  | WatchedWatchlistStatusQuery;

export function useWatchlistStatus(movieId: number): WatchlistStatusQuery {
  const {
    loading: profileLoading,
    currentProfile,
    addMovieToWatchlist,
    markMovieAsWatched,
    getWatchlistMovieStatus,
  } = useUserProfile();
  const queryClient = useQueryClient();

  const queryKey = ["profiles", currentProfile?.id, "watchlist", movieId];
  const { isSuccess: loadedData, data: movieStatus } = useQuery(
    queryKey,
    () => getWatchlistMovieStatus!(movieId),
    { enabled: !!currentProfile }
  );
  const addToWatchlistMutation = useMutation(
    async (movieId: number) => {
      if (profileLoading) return;
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
  const markAsWatchedMutation = useMutation(
    async (movieId: number) => {
      if (profileLoading) return;
      return markMovieAsWatched(movieId);
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
  const markAsWatched = () => markAsWatchedMutation.mutateAsync(movieId);

  if (profileLoading) return { status: "loading" };
  if (!currentProfile) return { status: "noprofile" };
  if (
    !loadedData ||
    addToWatchlistMutation.isLoading ||
    markAsWatchedMutation.isLoading
  ) {
    return { status: "loading" };
  }
  switch (movieStatus) {
    case "unwatched":
      return { status: "unwatched", markAsWatched };
    case "watched":
      return { status: "watched" };
    case "notadded":
    default:
      return { status: "notadded", addToWatchlist };
  }
}
