import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Song } from './models/song';

const lastFmKey = '9a8a3facebbccaf363bb9fd68fa37abf';
const baseUrl   = 'https://ws.audioscrobbler.com/2.0/';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  inputArtist: string = '';
  inputAlbum: string  = '';

  artistName: string = '';
  albumName:  string = '';
  imageUrl:   string = '';
  songs:      Song[] = [];

  errorMessage: string = '';
  loadingAlbum = false;

  artistInput: string = '';
  similarArtists: string[] = [];
  errorSimilar: string = '';
  loadingSimilar = false;

  tagInput: string = '';
  topSongs: { title: string; artist: string; url: string }[] = [];
  errorTop: string = '';
  loadingTop = false;

  constructor(public http: HttpClient) {}

  async ngOnInit() {
    this.inputArtist = 'Cher';
    this.inputAlbum = 'Believe';
    await this.getAlbumInfo();
  }

  async getAlbumInfo(): Promise<void> {
    this.errorMessage = '';
    this.artistName = '';
    this.albumName  = '';
    this.imageUrl   = '';
    this.songs      = [];
    this.loadingAlbum = true;

    try {
      const url = `${baseUrl}?method=album.getinfo&api_key=${lastFmKey}&artist=${encodeURIComponent(this.inputArtist)}&album=${encodeURIComponent(this.inputAlbum)}&format=json`;

      const x: any = await lastValueFrom(this.http.get<any>(url));
      console.log('album.getInfo', x);

      this.artistName = x.album.artist;
      this.albumName  = x.album.name;

      this.imageUrl   = x.album.image?.[1]?.['#text'] ?? '';

      for (let s of x.album.tracks.track) {
        this.songs.push(new Song(s.name, Number(s.duration ?? 0)));
      }

      this.errorMessage = '';
    } catch (err) {
      this.errorMessage = "Aucun album n'a été trouvé.";
      this.artistName = '';
      this.albumName  = '';
      this.imageUrl   = '';
      this.songs      = [];
    } finally {
      this.loadingAlbum = false;
    }
  }

  async searchSimilarArtists(): Promise<void> {
    this.errorSimilar = '';
    this.similarArtists = [];
    this.loadingSimilar = true;

    try {
      const url = `${baseUrl}?method=artist.getsimilar&api_key=${lastFmKey}&artist=${encodeURIComponent(this.artistInput)}&format=json&limit=20`;
      const x: any = await lastValueFrom(this.http.get<any>(url));
      console.log('artist.getSimilar', x);

      if (x?.error) {
        this.errorSimilar = x.message ?? 'Erreur inconnue.';
        return;
      }

      const list = x?.similarartists?.artist ?? [];
      this.similarArtists = list
        .map((a: any) => (a?.name ?? '').toString().trim())
        .filter((n: string) => n.length > 0);

      if (this.similarArtists.length === 0) {
        this.errorSimilar = 'Aucun artiste similaire trouvé.';
      }
    } catch (err) {
      this.errorSimilar = 'Erreur réseau. Réessaie plus tard.';
    } finally {
      this.loadingSimilar = false;
    }
  }

  async searchTopTracks(): Promise<void> {
    this.errorTop = '';
    this.topSongs = [];
    this.loadingTop = true;

    try {
      const url = `${baseUrl}?method=tag.gettoptracks&api_key=${lastFmKey}&tag=${encodeURIComponent(this.tagInput)}&format=json&limit=20`;
      const x: any = await lastValueFrom(this.http.get<any>(url));
      console.log('tag.getTopTracks', x);

      const list = x?.tracks?.track ?? [];
      this.topSongs = list.map((t: any) => ({
        title:  t?.name ?? '(inconnu)',
        artist: t?.artist?.name ?? '(artiste inconnu)',
        url:    t?.url ?? '#'
      }));

      if (this.topSongs.length === 0) {
        this.errorTop = 'Aucune chanson trouvée pour ce genre.';
      }
    } catch (err) {
      this.errorTop = 'Erreur réseau. Réessaie plus tard.';
      this.topSongs = [];
    } finally {
      this.loadingTop = false;
    }
  }
}