export class Album {
  constructor(
    public title: string,
    public artist: string,
    public imageUrl: string,
    public mbid: string | null
  ) {}
}