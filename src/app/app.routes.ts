import { Routes } from '@angular/router';
import { LoginComponent } from './pages/page/login/login.component';
import { DashboardComponent } from './pages/page/dashboard/dashboard.component';
import { PaymentComponent } from './pages/page/payment/payment.component';
import { ProductsComponent } from './pages/page/products/products.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { HandleProductComponent } from './pages/page/handle-product/handle-product.component';
import { ProductBulkUploadComponent } from './pages/page/product-bulk-upload/product-bulk-upload.component';
import { PurchaseComponent } from './pages/page/purchase/purchase.component';
import { CategoryComponent } from './pages/page/category/category.component';
import { OrdersComponent } from './pages/page/orders/orders.component';
import { CustomersComponent } from './pages/page/customers/customers.component';
import { BillingComponent } from './pages/page/billing/billing.component';
import { ReportsComponent } from './pages/page/reports/reports.component';
import { SupportComponent } from './pages/page/support/support.component';
import { SettingsComponent } from './pages/page/settings/settings.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'payments',
                component: PaymentComponent
            },
            {
                path: 'products',
                component: ProductsComponent
            },
            {
                path: 'products/add',
                component: HandleProductComponent
            },
            {
                path: 'products/edit/:id',
                component: HandleProductComponent
            },
            {
                path: 'products-bulk-upload',
                component: ProductBulkUploadComponent
            },
            {
                path: 'purchase-products',
                component: PurchaseComponent
            },
            {
                path: 'categories',
                component: CategoryComponent
            },
            {
                path: 'orders',
                component: OrdersComponent
            },
            {
                path: 'customers',
                component: CustomersComponent
            },
            {
                path: 'billing',
                component: BillingComponent
            },
            {
                path: 'reports',
                component: ReportsComponent
            },
            {
                path: 'support',
                component: SupportComponent
            },
            {
                path: 'settings',
                component: SettingsComponent
            },
        ]
    }
];
