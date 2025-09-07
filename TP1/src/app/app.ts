import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

class Album {
  constructor(
    public title: string,
    public artist: string,
    public imageUrl: string,
    public mbid: string | null
  ) {}
}

type LastFmError = { error: number; message: string };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  artistQuery = '';
  artistTitle = '';
  albums: Album[] = [];
  tracks: { name: string; duration: number }[] = [];
  selectedAlbumName: string | null = null;

  loadingAlbums = false;
  loadingTracks = false;
  errorMsg = '';

  constructor(private http: HttpClient) {}

  async searchAlbums() {
    this.errorMsg = '';
    this.tracks = [];
    this.selectedAlbumName = null;
    this.albums = [];

    const artist = this.artistQuery.trim();
    if (!artist) { this.errorMsg = 'Veuillez entrer un nom d’artiste.'; return; }

    this.loadingAlbums = true;
    const url =
      `${environment.LASTFM_BASE}?method=artist.gettopalbums` +
      `&artist=${encodeURIComponent(artist)}` +
      `&api_key=${environment.LASTFM_API_KEY}&format=json&limit=24`;

    try {
      const data: any | LastFmError = await this.http.get(url).toPromise();
      if ((data as LastFmError)?.error) {
        this.errorMsg = (data as LastFmError).message || 'Erreur Last.fm';
        return;
      }
      const items = data?.topalbums?.album ?? [];
      this.albums = items
        .filter((a: any) => !!a?.name)
        .map((a: any) => {
          const img = (a.image || []).find((i: any) => i.size === 'large')?.['#text']
                   || (a.image || [])[0]?.['#text'] || '';
          return new Album(a.name, a.artist?.name ?? artist, img, a.mbid ?? null);
        });

      this.artistTitle = artist;
      if (this.albums.length === 0) this.errorMsg = 'Aucun album trouvé pour cet artiste.';
    } catch {
      this.errorMsg = 'Impossible de récupérer les albums.';
    } finally {
      this.loadingAlbums = false;
    }
  }

  async loadTracksForAlbum(album: Album) {
    this.errorMsg = '';
    this.tracks = [];
    this.selectedAlbumName = album.title;
    this.loadingTracks = true;

    const params = album.mbid
      ? `mbid=${encodeURIComponent(album.mbid)}`
      : `artist=${encodeURIComponent(album.artist)}&album=${encodeURIComponent(album.title)}`;

    const url =
      `${environment.LASTFM_BASE}?method=album.getinfo&${params}` +
      `&api_key=${environment.LASTFM_API_KEY}&format=json`;

    try {
      const data: any | LastFmError = await this.http.get(url).toPromise();
      if ((data as LastFmError)?.error) {
        this.errorMsg = (data as LastFmError).message || 'Erreur Last.fm';
        return;
      }

      const list = data?.album?.tracks?.track ?? [];
      const arr = Array.isArray(list) ? list : (list ? [list] : []);
      this.tracks = arr
        .filter((t: any) => !!t?.name)
        .map((t: any) => ({ name: t.name, duration: Number(t.duration ?? 0) }));

      if (this.tracks.length === 0) this.errorMsg = 'Aucune chanson trouvée pour cet album.';
    } catch {
      this.errorMsg = 'Impossible de récupérer les chansons de cet album.';
    } finally {
      this.loadingTracks = false;
    }
  }

  toMinSec(sec: number) {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${r.toString().padStart(2, '0')}`;
  }
}