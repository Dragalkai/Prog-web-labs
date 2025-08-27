import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Towel } from './models/towel';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('labo1');

  myWisdom : string = "Great power comes with great responsibilities."
  n = 8

  bruh () : string{
    return "Bruh.";
  }

  equalToN (n : number) : string{
    if (n == this.n)
    {
      return "Identique"
    }
    else
    {
      return "Différent"
    }
  }

  towel : Towel = new Towel("indigo", 1.8, "/assets/images/towel.webp")

  hateList : string[] = ["cornichons", "olives", "pizza aux ananas"]
}
