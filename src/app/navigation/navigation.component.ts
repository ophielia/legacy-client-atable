import {Component, OnInit} from '@angular/core';

import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'at-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  private isLoggedIn: Boolean
  private isAdmin: Boolean

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.isLoggedIn = this.authenticationService.isAuthenticated()
    this.isAdmin = this.authenticationService.isAdmin()
  }

}
