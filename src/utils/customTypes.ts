export interface MovieData {
  code: string;
  cast: string[];
  maleCast: string[];
  title: string;
  release: string;
  runtime: number;
  tags: string[];
  opt: string[];
  series: string;
  overrides: {
    cover: string;
    preview: string;
  };
}

export interface ActorData {
  _id: string;
  name: string;
  dob: string | Date;
  height: number;
  isMale: boolean;
  img500: string;
}
