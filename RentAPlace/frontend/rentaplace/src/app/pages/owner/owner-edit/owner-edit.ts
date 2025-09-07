import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PropertyService } from '../../../core/services/property.service';
import { PropertyFull } from '../../../models/property.models';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-owner-edit',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './owner-edit.html',
  styleUrls: ['./owner-edit.scss']
})
export class OwnerEdit implements OnInit {
  propertyId!: number;
  form!: FormGroup;
  property!: PropertyFull;

  amenities: any[] = [];
  existingPhotos: { id: number; url: string }[] = [];
  newFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private api: PropertyService,
    private propertyService: PropertyService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.propertyId = Number(this.route.snapshot.paramMap.get('id'));
    this.form = this.fb.group({
      title: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      pricePerNight: [0, Validators.required],
      propertyType: ['', Validators.required],
      maxGuests: [1, Validators.required],
      bedrooms: [1, Validators.required],
      bathrooms: [1, Validators.required]
    });
    this.loadProperty();


  }
  loadProperty() {
    this.propertyService.getById(this.propertyId).subscribe((p: any) => {
      this.form.patchValue(p);

      this.amenities = (p.propertyAmenities || []).map((a: { propertyId: number; amenityId: number; amenity: { id: number; name: string } }) => ({
        id: a.amenity.id,
        name: a.amenity.name,
        selected: true
      }));

      const baseUrl = 'http://localhost:5264'; // optional, if your URLs are relative
      this.existingPhotos = (p.images || []).map((img: { id: number; imageUrl: string }) => ({
        id: img.id,
        url: img.imageUrl // or baseUrl + img.imageUrl if needed
      }));
    });
  }

  toggleAmenity(amenity: any, checked: boolean) {
    amenity.selected = checked;
  }

  onFilesSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      for (let file of event.target.files) {
        this.newFiles.push(file);
      }
    }
  }
  removeExistingPhoto(photo: { id: number; url: string }) {
    if (!confirm('Are you sure you want to delete this image?')) return;
    this.propertyService.deleteImage(this.propertyId, photo.id).subscribe({
      next: () => {
        this.existingPhotos = this.existingPhotos.filter(p => p.id !== photo.id); // 🔥 remove from array
      },
      error: err => console.error('Failed to delete image', err)
    });
  }

  removeNewFile(index: number) {
    this.newFiles.splice(index, 1);
  }




  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const updatedProperty = {
      ...formValue,
      amenityIds: this.amenities.filter(a => a.selected).map(a => a.id),
      photos: this.existingPhotos
    };

    this.propertyService.update(this.propertyId, updatedProperty).subscribe(() => {
      if (this.newFiles.length > 0) {
        const fd = new FormData();
        this.newFiles.forEach(f => fd.append('files', f));
        this.propertyService.uploadImages(this.propertyId, fd).subscribe(() => {
          this.router.navigate(['/owner']);
        });
      } else {
        this.router.navigate(['/owner']);
      }
    });
  }
}