import { Component, inject, signal } from '@angular/core';
import { injectParams } from 'ngxtension/inject-params';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReviewService } from '../../user/servises/review-service';

@Component({
  selector: 'app-post-review',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './post-review.html',
  styleUrl: './post-review.css',
})
export class PostReview {
  publicId = injectParams('id');
  private fb = inject(FormBuilder);
  private reviewService = inject(ReviewService);
  public router = inject(Router);

  hoveredStar = signal(0);
  // Store the actual File objects for the upload
  selectedFiles = signal<File[]>([]);
  // Store URLs for the UI preview
  previews = signal<string[]>([]);

  reviewForm = this.fb.group({
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.minLength(5)]]
  });

  setRating(rating: number) {
    this.reviewForm.patchValue({ rating });
  }

  onFileSelected(event: any) {
    const files = Array.from(event.target.files as FileList);
    if (files.length > 0) {
      this.selectedFiles.update(current => [...current, ...files]);
      
      // Generate previews
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previews.update(p => [...p, e.target.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeFile(index: number) {
    this.selectedFiles.update(files => files.filter((_, i) => i !== index));
    this.previews.update(previews => previews.filter((_, i) => i !== index));
  }

  onSubmit() {
    if (this.reviewForm.valid && this.publicId()) {
      const reviewData = {
        productId: this.publicId()!,
        rating: this.reviewForm.value.rating!,
        comment: this.reviewForm.value.comment!
      };

      // Passing the JSON DTO and the Array of Files (Blobs)
      this.reviewService.createReview(reviewData, this.selectedFiles()).subscribe({
        next: () => {
          this.router.navigate(['/products', this.publicId()]);
        },
        error: (err) => console.error('Upload failed', err)
      });
    }
  }
}