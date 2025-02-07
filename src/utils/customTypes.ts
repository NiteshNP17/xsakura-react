export interface MovieData {
  code: string;
  cast: ActorData[];
  maleCast: string[];
  title: string;
  release: string;
  runtime: number;
  tags: string[];
  opt: string[];
  series: SeriesItem;
  overrides: {
    cover: string;
    preview: string;
  };
}

export interface ActorData {
  _id: string;
  name: string;
  dob: string | Date;
  height?: number;
  img500: string;
  sizes: {
    bust: number;
    waist: number;
    hips: number;
  };
  numMovies: number;
  yearsActive: number;
  ageAtLatestRelease: number;
}

export interface SeriesItem {
  _id: string;
  slug: string;
  name: string;
  studio: string;
  movieCount: number;
  thumbs: string;
  movieCodes: string[];
}

export interface LabelData {
  prefix: string;
  imgPre: string;
  name: string;
  isDmb: boolean;
  isHq: boolean;
  isVr: boolean;
  is3digits: boolean;
}

export interface AlbumData {
  models: ActorData[];
  name: string;
  cover: string;
  domain: string;
  studio: string;
  galleryCode: string;
  date: Date;
  images: [{ imgCode: string; fileName: string }];
  isNonNude: boolean;
  imageCount: number;
  slug: string;
}

export interface StudioItem {
  slug: string;
  name: string;
  logo: string;
  labels: string[];
  movieCount: number;
  web: string;
}
