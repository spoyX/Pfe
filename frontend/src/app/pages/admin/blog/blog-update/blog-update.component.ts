import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HtmlEditorService, ImageService, LinkService, QuickToolbarService, RichTextEditorModule, ToolbarService, ToolbarSettingsModel } from '@syncfusion/ej2-angular-richtexteditor';
import { BlogService } from '../../../../core/services/blog/blog.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blog-update',
  standalone: true,
  imports: [CommonModule, RichTextEditorModule, ReactiveFormsModule],
  templateUrl: './blog-update.component.html',
  styleUrls: ['./blog-update.component.css'],
  providers: [
    ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,
    QuickToolbarService
  ]
})
export class BlogUpdateComponent {
  blogForm: FormGroup;
  toolbarSettings!: ToolbarSettingsModel;
  imagePreview: string | null = null;
  isSubmitting = false;
  id: any;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private router: Router,
    private _act: ActivatedRoute
  ) {
    // Build form controls
    const controls = {
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      content: new FormControl('', [Validators.required]),
      tags: new FormControl('', []),
      image: new FormControl(null, [])
    };
    this.blogForm = this.fb.group(controls);
  }

  ngOnInit() {
    // Configure rich text editor toolbar
    this.toolbarSettings = {
      items: [
        'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
        'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
        'LowerCase', 'UpperCase', '|',
        'Formats', 'Alignments', '|',
        'OrderedList', 'UnorderedList', '|',
        'Outdent', 'Indent', '|',
        'CreateLink', 'Image', 'CreateTable', '|',
        'ClearFormat', 'Print', 'SourceCode', '|',
        'FullScreen'
      ]
    };

    // Get blog ID from route parameters
    this.id = this._act.snapshot.paramMap.get('id');

    // Fetch the blog details by ID
    this.blogService.getById(this.id).subscribe({
      next: (res: any) => {
        // Use patchValue to update the form with response data
        this.blogForm.patchValue({
          title: res.title,
          content: res.content,
          tags: res.tags
          // Note: For the image, we only display the preview; we don't patch the file input.
        });

        // If the response has an image, build the full URL for the preview
        if (res.image) {
          this.imagePreview = 'http://127.0.0.1:3000/files/' + res.image;
        }
      },
      error: (err: any) => {
        console.error('Error loading blog:', err);
      }
    });
  }

  onSubmit() {
    this.isSubmitting = true;
    // Log the form values for debugging
    console.log('Submitting blog update with values:', this.blogForm.value);

    const formData = new FormData();
    formData.append('title', this.blogForm.value.title);
    formData.append('content', this.blogForm.value.content);
    formData.append('tags', this.blogForm.value.tags);

    // Add image if one is selected
    if (this.blogForm.value.image) {
      formData.append('image', this.blogForm.value.image);
    }

    // Call the update blog API
    this.blogService.updateBlog(this.id, formData).subscribe({
      next: (res: any) => {
       Swal.fire({
                 icon: 'success',
                 title: 'Blog successfully created!',
                 showConfirmButton: false,
                 timer: 1500
               });
           
               // Navigate after a short delay to let user see the message
               setTimeout(() => {
                 this.router.navigate(['admin/blog']);
               }, 1600);
      },
      error: (err: any) => {
         Swal.fire({
                  icon: 'error',
                  title: 'Erreur!',
                  text: 'An error occurred while creating the blog.',
                });
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Update form control with the file
      this.blogForm.patchValue({ image: file });

      // Generate a preview using FileReader
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imagePreview = null;
    this.blogForm.patchValue({ image: null });
    // Reset the file input element
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
