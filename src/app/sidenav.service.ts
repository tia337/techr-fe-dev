import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Injectable()
export class SidenavService {

  sidenav: MatSidenav;

  setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  close() {
    this.sidenav.close();
  }

  open() {
    this.sidenav.open();
  }

}
