import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VideoGame } from './video-game.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('labo2');

  loveList : string[] = ["jeux vidéo", "muscu", "speedrun"];

  userAge : number = 19;

  clicksLeft: number = 10;
  countdown() {
    if (this.clicksLeft > 0) {
      this.clicksLeft--;
    }
  }
  get isExploded(): boolean {
    return this.clicksLeft <= 0;
  }

  theme: 'light' | 'dark' = 'light';
  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }

  userName = '';
  sayHello() {
    alert(`Salut ${this.userName.trim() || 'mystérieux inconnu'} !`);
  }

  bgColor: 'lightcyan' | 'mistyrose' | 'lightyellow' = 'lightcyan';


  videoGames: VideoGame[] = [
    new VideoGame('Celeste', 2018, false, 'console', ['platformer', 'solo']),
  ];

  f_title = '';
  f_year: number | null = null;
  f_isMultiplayer = false;
  f_platform: 'pc' | 'console' | 'mobile' = 'pc';
  f_genresCSV = 'action,rpg,solo';

  addGame() {
    const title = this.f_title.trim();
    const year = Number(this.f_year ?? 0);

    const genres = (this.f_genresCSV ?? '')
      .split(',')
      .map(g => g.trim())
      .filter(Boolean);

    if (!title || !year) {
      alert('Titre et année sont requis.');
      return;
    }

    this.videoGames.push(
      new VideoGame(title, year, this.f_isMultiplayer, this.f_platform, genres)
    );

    this.f_title = '';
    this.f_year = null;
    this.f_isMultiplayer = false;
    this.f_platform = 'pc';
    this.f_genresCSV = '';
  }

  clearGames() {
    this.videoGames = [];
  }
  
  seedGames() {
    this.videoGames = [
      new VideoGame('Celeste', 2018, false, 'console', ['platformer','solo']),
      new VideoGame('Hades', 2020, false, 'pc', ['roguelite','action']),
    ];
  }
}
