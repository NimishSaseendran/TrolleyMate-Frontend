import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product/product.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-bulk-upload',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './product-bulk-upload.component.html',
  styleUrl: './product-bulk-upload.component.scss'
})
export class ProductBulkUploadComponent {

  pageTitle: string = 'Product Bulk Upload'

  selectedFile: File | null = null;
  fileName = '';

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      this.fileName = this.selectedFile.name;
    }
  }

  fnOnSubmit(): void {
    if (!this.selectedFile) {
      this.toastr.warning('❗ Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.productService.productBulkUpload(formData).subscribe({
      next: (res) => {
        this.toastr.success('✅ File uploaded successfully!');
        this.router.navigate(['/products'])
        this.resetForm();
      },
      error: (err) => {
        console.error('[UPLOAD ERROR]', err);
        this.toastr.error('❌ Upload failed. Check console for details.');
      }
    });
  }

  resetForm() {
    this.selectedFile = null;
    this.fileName = '';
  }

}
