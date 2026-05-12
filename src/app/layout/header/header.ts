import { Component, inject} from '@angular/core';
import { Router } from '@angular/router';
import { ButtonDirective } from "primeng/button"; 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonDirective],
  templateUrl: './header.html',
  styleUrls : ['./header.scss'],
})
export class Header {

private router = inject(Router);

goToAuditLogs() {
  this.router.navigate(['/audit-logs']);
}

}
