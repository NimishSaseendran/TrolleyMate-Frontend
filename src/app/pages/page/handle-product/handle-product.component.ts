import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-handle-product',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './handle-product.component.html',
  styleUrl: './handle-product.component.scss'
})
export class HandleProductComponent implements OnInit {

  productForm!: FormGroup;
  pageTitle: string = 'Add Product';
  selectedImageFile: File | null = null;
  id: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.pageTitle = this.id ? 'Edit Product' : 'Add Product';

    this.productForm = this.fb.group({
      strName: ['', Validators.required],
      intSellingPrice: [null, Validators.required],
      intActualPrice: [null, Validators.required],
      strCategory: ['', Validators.required],
      strBrand: [''],
      strUnit: [''],
      strImage: [''],
      strDescription: ['', Validators.required],
      strWeight: [''],
      intDiscountPercentage: [0],
      arrTags: this.fb.array([
        this.fb.control('', Validators.required)
      ]),
      blnIsAvailable: [true],
      intStockQuantity: [0, Validators.required],
      dateAddedDate: [new Date(), Validators.required],
      dateExpiryDate: [null, Validators.required],
      strRfid: [''],
      intLimitPerUser: [1]
    });

    if (this.id) {
      this.fnGetProduct(this.id);
    }
  }

  fnGetProduct(id: string) {
    const obj = {
      pkProductId: id
    }
    this.productService.getAllProducts(obj).subscribe((res) => {
      if (res && res.success) {
        const product = Array.isArray(res.data) ? res.data[0] : res.data;
        console.log('producttt', product);

        // Patch all simple fields directly
        this.productForm.patchValue({
          strName: product?.strName || '',
          intSellingPrice: product?.intSellingPrice || null,
          intActualPrice: product?.intActualPrice || null,
          strCategory: product?.strCategory || '',
          strBrand: product?.strBrand || '',
          strUnit: product?.strUnit || '',
          strImage: product?.strImage || '',
          strDescription: product?.strDescription || '',
          strWeight: product?.strWeight || '',
          intDiscountPercentage: product?.intDiscountPercentage || 0,
          blnIsAvailable: product?.blnIsAvailable ?? true,
          intStockQuantity: product?.intStockQuantity || 0,
          dateAddedDate: product?.dateAddedDate ? new Date(product.dateAddedDate) : new Date(),
          dateExpiryDate: product?.dateExpiryDate ? new Date(product.dateExpiryDate) : null,
          strRfid: product?.strRfid || '',
          intLimitPerUser: product?.intLimitPerUser || 1
        });

        // 🔁 Now set arrTags (FormArray)
        const tagsArray = this.productForm.get('arrTags') as FormArray;
        tagsArray.clear(); // Clear any existing controls

        if (product?.arrTags && Array.isArray(product.arrTags)) {
          product.arrTags.forEach(tag => {
            tagsArray.push(this.fb.control(tag, Validators.required));
          });
        } else {
          tagsArray.push(this.fb.control('', Validators.required)); // at least one empty
        }
      }

    })
  }

  get arrTags() {
    return this.productForm.get('arrTags') as FormArray;
  }

  addTag(tag: string = '') {
    this.arrTags.push(this.fb.control(tag));
  }

  removeTag(index: number) {
    this.arrTags.removeAt(index);
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput?.files && fileInput.files.length > 0) {
      this.selectedImageFile = fileInput.files[0];

      // Optional: Show preview or use file name (but don't store file name in form)
      // You can patch 'strImage' only if needed for preview or display
      this.productForm.patchValue({
        strImage: this.selectedImageFile.name
      });

      // Also mark field as touched/dirty if needed
      this.productForm.get('strImage')?.markAsDirty();
    }
  }


  submitProduct() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const product = this.productForm.value;

    // ✅ Create FormData and append all fields
    const formData = new FormData();

    formData.append('strName', product.strName);
    formData.append('intSellingPrice', product.intSellingPrice);
    formData.append('intActualPrice', product.intActualPrice);
    formData.append('strCategory', product.strCategory);
    formData.append('strBrand', product.strBrand);
    formData.append('strUnit', product.strUnit);
    formData.append('strDescription', product.strDescription);
    formData.append('strWeight', product.strWeight);
    formData.append('intDiscountPercentage', product.intDiscountPercentage);
    formData.append('blnIsAvailable', product.blnIsAvailable);
    formData.append('intStockQuantity', product.intStockQuantity);
    formData.append('dateAddedDate', new Date(product.dateAddedDate).toISOString());
    formData.append('dateExpiryDate', new Date(product.dateExpiryDate).toISOString());
    formData.append('strRfid', product.strRfid);
    formData.append('floatRatings', product.floatRatings || 0);
    formData.append('intLimitPerUser', product.intLimitPerUser || 1);

    // ✅ Append tags array
    if (Array.isArray(product.arrTags)) {
      product.arrTags.forEach((tag: string, index: number) => {
        formData.append(`arrTags[${index}]`, tag);
      });
    }

    // ✅ Append image if it's a File (from file input)
    if (this.selectedImageFile instanceof File) {
      formData.append('strImage', this.selectedImageFile);
    } else {
      // If it's just a string (URL), pass as string
      formData.append('strImage', product.strImage);
    }

    // 🔄 Submit FormData based on Add or Edit
    if (this.pageTitle === 'Add Product') {
      this.productService.addProduct(formData).subscribe({
        next: (res) => {
          this.toastr.success(res.message);
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.toastr.error(err.error.message);
        }
      });
    } else {
      this.productService.updateProduct(formData, this.id).subscribe({
        next: (res) => {
          this.toastr.success(res.message);
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.toastr.error(err.error.message);
        }
      });
    }
  }

}
