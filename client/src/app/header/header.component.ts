import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  addContent() {
    const lki = document.getElementById('Lki');
    const ins = document.getElementById('Ins');
    const git = document.getElementById('Git');
    const fb = document.getElementById('Fb');
    if (lki.style.display === 'none') {
      lki.style.display = 'inline';
      ins.style.display = 'inline';
      git.style.display = 'inline';
      fb.style.display = 'inline';
    } else {
      lki.style.display = 'none';
      ins.style.display = 'none';
      git.style.display = 'none';
      fb.style.display = 'none';
    }
  }

}
