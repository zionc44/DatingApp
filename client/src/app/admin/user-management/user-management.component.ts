import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';
import { User } from 'src/app/models/user.model';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  public users: Partial<User[]> = []
  public bsModalRef!: BsModalRef;
  constructor(
    private adminService: AdminService,
    private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getUserWithRoles();
  }

  getUserWithRoles() {
    this.adminService.getUserWithRoles().subscribe(users => {
      this.users = users;
    })
  }

  openRolesModal(user: User) {
    const config = {
      class: 'modal-dialog-centerd',
      initialState: {
        user,
        roles: this.getRolesArray(user)
      }
    };

    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    this.bsModalRef.content.updateSelectedRoles.subscribe((values:any) => {
      const rolesToUpdate = {
        roles: [...values.filter((el:any) => el.checked === true).map((el:any) => el.name)]
      }

      if (rolesToUpdate) {
        this.adminService.updateUserRoles(user.username,rolesToUpdate.roles).subscribe(()=>{
          user.roles = [...rolesToUpdate.roles];
        })
      }
    })
  }

  getRolesArray(user: User) {
    const roles: any[] = [];
    const userRoles = user.roles;
    const availableRoles: any[] = [
      { name: 'Admin', value: 'Admin' },
      { name: 'Moderator', value: 'Moderator' },
      { name: 'Member', value: 'Member' }
    ]

    availableRoles.forEach(availableRole => {
      let isMatch = false;
      userRoles?.forEach(userRole => {
        if (availableRole.name === userRole) {
          isMatch = true;
          availableRole.checked = true;
          roles.push(availableRole);
        }
      })
      if (!isMatch) {
        availableRole.checked = false;
        roles.push(availableRole);
      }
    })

    return roles;
  }
}
