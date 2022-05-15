import axios from "axios";
import { ProfileDTO } from "dtos/Profile";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetProfilesResponse } from "pages/api/user/profiles";
import { AddMovieToWatchlistRequest } from "pages/api/user/profiles/[profileId]/watchlist";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQuery, useQueryClient } from "react-query";
import { WatchlistMovieStatus } from "types/WatchlistMovieStatus";

const LOCAL_STORAGE_CURRENT_PROFILE_KEY = "mymovies:current_profile";

type LoadingUserProfileContextData = {
  loading: true;
  user?: undefined;
  profiles?: undefined;
  currentProfile?: undefined;
  canUserCreateNewProfile?: undefined;
  changeCurrentProfile?: undefined;
  getWatchlistMovieStatus?: undefined;
  addMovieToWatchlist?: undefined;
  invalidateProfiles: () => void;
};

type LoadedUserProfileContextData = {
  loading: false;
  profiles: ProfileDTO[];
  currentProfile: ProfileDTO;
  canUserCreateNewProfile: boolean;
  changeCurrentProfile: (id: string) => void;
  getWatchlistMovieStatus: (movieId: number) => Promise<WatchlistMovieStatus>;
  addMovieToWatchlist: (movieId: number) => Promise<void>;
  invalidateProfiles: () => void;
};

export type UserProfileContextData =
  | LoadingUserProfileContextData
  | LoadedUserProfileContextData;

const UserProfileContext = createContext({} as UserProfileContextData);

export type UserProfileProviderProps = PropsWithChildren<{}>;

export const UserProfileProvider: FC<UserProfileProviderProps> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { status: userStatus, data: session } = useSession({
    required: true,
    onUnauthenticated: () => router.push("/login"),
  });
  const user = session?.user;

  const [currentProfileId, setCurrentProfileId] = useState<string>();

  const profilesQueryKey = ["users", user?.id, "profiles"];
  const { isSuccess: profilesLoaded, data: profiles } = useQuery(
    profilesQueryKey,
    () =>
      axios
        .get<GetProfilesResponse>("/api/user/profiles")
        .then(({ data: { profiles } }) => profiles),
    { enabled: userStatus === "authenticated" }
  );

  const changeCurrentProfile = (id: string) => {
    localStorage.setItem(LOCAL_STORAGE_CURRENT_PROFILE_KEY, id);
    setCurrentProfileId(id);
  };
  const invalidateProfiles = () =>
    queryClient.invalidateQueries(profilesQueryKey);

  useEffect(() => {
    if (!(userStatus === "authenticated" && session.user.signupComplete))
      return;
    const currentProfileId = localStorage.getItem(
      LOCAL_STORAGE_CURRENT_PROFILE_KEY
    );
    setCurrentProfileId(currentProfileId ?? undefined);
  }, [userStatus, session]);

  if (userStatus === "loading" || !profilesLoaded) {
    return (
      <UserProfileContext.Provider
        value={{ loading: true, invalidateProfiles }}
      >
        {children}
      </UserProfileContext.Provider>
    );
  }

  if (!session.user.signupComplete) {
    throw new Error(
      "This component can only be used with full signed up users"
    );
  }

  const currentProfile =
    profiles.find(({ id }) => id === currentProfileId) ?? profiles[0];

  const getWatchlistMovieStatus = async (movieId: number) => {
    const entry = currentProfile.movieWatchlist.find(
      (entry) => entry.movieId === movieId
    );
    if (!entry) return "notadded";
    return entry.watched ? "watched" : "unwatched";
  };

  const addMovieToWatchlist = async (movieId: number) => {
    await axios.post<any, any, AddMovieToWatchlistRequest>(
      `/api/user/profiles/${currentProfileId}/watchlist`,
      { movieId }
    );
  };

  return (
    <UserProfileContext.Provider
      value={{
        loading: false,
        profiles,
        currentProfile,
        changeCurrentProfile,
        getWatchlistMovieStatus,
        addMovieToWatchlist,
        canUserCreateNewProfile: user!.canCreateNewProfile!,
        invalidateProfiles,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export function useUserProfile(): UserProfileContextData {
  return useContext(UserProfileContext);
}
