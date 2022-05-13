export type MovieImage = {
  src: string;
  width: number;
  height: number;
};

export type MovieDTO = {
  id: number;
  title: string;
  poster: MovieImage;
};
