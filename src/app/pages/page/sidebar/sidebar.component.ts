import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true, // ✅ required when using 'imports' array
  imports: [
    CommonModule,
    RouterLink,
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'] // ✅ fix: should be styleUrls (plural)
})
export class SidebarComponent {

  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  @HostBinding('class.collapsed') get isCollapsed() {
    return this.collapsed;
  }

  arrSidebar = [
    { label: 'Dashboard', icon: 'fa-solid fa-chart-line', link: '/dashboard' },
    { label: 'Category', icon: 'fa-solid fa-layer-group', link: '/categories' },
    { label: 'Products', icon: 'fa-solid fa-box-open', link: '/products' },
    { label: 'Bulk Upload', icon: 'fa-solid fa-file-arrow-up', link: '/products-bulk-upload' },
    { label: 'Purchase', icon: 'fa-solid fa-cart-shopping', link: '/purchase-products' },
    { label: 'Payments', icon: 'fa-solid fa-money-check-dollar', link: '/payments' },

    // 👇 Newly Added
    { label: 'Orders', icon: 'fa-solid fa-receipt', link: '/orders' },
    { label: 'Customers', icon: 'fa-solid fa-users', link: '/customers' },
    { label: 'Live Cart / Billing', icon: 'fa-solid fa-basket-shopping', link: '/billing' },
    { label: 'Reports', icon: 'fa-solid fa-chart-pie', link: '/reports' },
    { label: 'Support / Help', icon: 'fa-solid fa-circle-question', link: '/support' },
    { label: 'Settings', icon: 'fa-solid fa-gears', link: '/settings' },
    { label: 'Logout', icon: 'fa-solid fa-right-from-bracket', link: '/logout' }
  ];


  ngOnInit() {
    if (window.innerWidth < 768) {
      this.collapsed = true;
    }
  }


  onToggle() {
    this.toggleCollapse.emit();
  }
}
