import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  public model: any = {};
  constructor(
    private router: Router,
    private toastr: ToastrService,
    public accountService: AccountService,
  ) { }

  ngOnInit(): void {
  }

  login() {
    console.log(this.model);
    this.accountService.login(this.model).subscribe(response => {
      console.log(response);
      this.router.navigateByUrl("/members");
    }, error => {
      console.log(error);
      this.toastr.error(error.error);
    })
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl("/");
  }
}