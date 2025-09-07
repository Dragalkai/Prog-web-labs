export class VideoGame {
  constructor(
    public title: string,
    public year: number,
    public isMultiplayer: boolean,
    public platform: 'pc' | 'console' | 'mobile',
    public genres: string[],
  ) {}
}