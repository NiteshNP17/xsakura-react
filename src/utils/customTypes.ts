export interface MovieData {
  _id: string;
  code: string;
  cast: ActorData[];
  maleCast: string[];
  title: string;
  release: string;
  runtime: number;
  came: number;
  tags: string[];
  tag2: Tag[];
  opt: string[];
  series: SeriesItem;
  overrides: {
    cover: string;
    preview: string;
  };
}

export interface Tag {
  _id: string;
  name: string;
}

export interface ActorData {
  _id: string;
  name: string;
  jpName: string;
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
  order: number;
  latestMovieDate: string;
  cup: string;
  rebdSrc: string;
  ageAtLatestRel: number;
  came: number;
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
  label: string;
  prefix: string;
  imgPre: string;
  name: string;
  isDmb: boolean;
  isHq: boolean;
  isVr: boolean;
  is3digits: boolean;
  studio: {
    _id: string;
    name: string;
    slug: string;
  };
  maxNum: number;
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
