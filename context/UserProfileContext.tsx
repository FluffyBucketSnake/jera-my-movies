import axios from "axios";
import { ProfileDTO } from "dtos/Profile";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { AddMovieToWatchlistRequest } from "pages/api/user/profiles/[profileId]/watchlist";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { WatchlistMovieStatus } from "types/WatchlistMovieStatus";

const LOCAL_STORAGE_CURRENT_PROFILE_KEY = "mymovies:current_profile";

type LoadingUserProfileContextData = {
  loading: true;
  user?: undefined;
  currentProfile?: undefined;
  changeCurrentProfile?: undefined;
  getWatchlistMovieStatus?: undefined;
  addMovieToWatchlist?: undefined;
};

type LoadedUserProfileContextData = {
  loading: false;
  user: Session["user"];
  currentProfile: ProfileDTO;
  changeCurrentProfile: (id: string) => void;
  getWatchlistMovieStatus: (movieId: number) => Promise<WatchlistMovieStatus>;
  addMovieToWatchlist: (movieId: number) => Promise<void>;
};

export type UserProfileContextData =
  | LoadingUserProfileContextData
  | LoadedUserProfileContextData;

const UserProfileContext = createContext({} as UserProfileContextData);

export type UserProfileProviderProps = PropsWithChildren<{}>;

export const UserProfileProvider: FC<UserProfileProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const { status, data } = useSession({
    required: true,
    onUnauthenticated: () => router.push("/login"),
  });
  const [currentProfileId, setCurrentProfileId] = useState<string>();

  const changeCurrentProfile = (id: string) => {
    localStorage.setItem(LOCAL_STORAGE_CURRENT_PROFILE_KEY, id);
    setCurrentProfileId(id);
  };

  useEffect(() => {
    if (!(status === "authenticated" && data.user.signupComplete)) return;
    const currentProfileId = localStorage.getItem(
      LOCAL_STORAGE_CURRENT_PROFILE_KEY
    );
    setCurrentProfileId(currentProfileId ?? undefined);
  }, [status, data]);

  if (status === "loading") {
    return (
      <UserProfileContext.Provider value={{ loading: true }}>
        {children}
      </UserProfileContext.Provider>
    );
  }

  const { user } = data;
  const currentProfile =
    user.profiles!.find(({ id }) => id === currentProfileId) ??
    user.profiles![0];

  if (!user.signupComplete) {
    throw new Error(
      "This component can only be used with full signed up users"
    );
  }

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
        user,
        currentProfile,
        changeCurrentProfile,
        getWatchlistMovieStatus,
        addMovieToWatchlist,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export function useUserProfile(): UserProfileContextData {
  return useContext(UserProfileContext);
}
