// blog-create.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HtmlEditorService, ImageService, LinkService, QuickToolbarService, RichTextEditorModule, ToolbarService, ToolbarSettingsModel } from '@syncfusion/ej2-angular-richtexteditor';
import { BlogService } from '../../../../core/services/blog/blog.service';

@Component({
  selector: 'app-blog-create',
  standalone: true,
  imports: [CommonModule, RichTextEditorModule, ReactiveFormsModule],
  templateUrl: './blog-create.component.html',
  styleUrls: ['./blog-create.component.css'],
  providers: [
    ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,
    QuickToolbarService
  ]
})
export class BlogCreateComponent {
  blogForm: FormGroup;
  toolbarSettings!: ToolbarSettingsModel;
  imagePreview: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private router: Router
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
  }

  onSubmit() {
    this.isSubmitting = true;
    const formData = new FormData();
    formData.append('title', this.blogForm.value.title);
    formData.append('content', this.blogForm.value.content);
    formData.append('tags', this.blogForm.value.tags);


  

    // Add image if selected
    if (this.blogForm.value.image) {
      formData.append('image', this.blogForm.value.image);
    }

    // Create the blog post
    this.blogService.create(formData).subscribe({
      next: (res) => {
        // Show success notification
        console.log('Blog created successfully', res);
        // Navigate to the blog list or the created blog
        this.router.navigate(['/blogs']);
      },
      error: (err) => {
        console.error('Error creating blog', err);
        // Show error notification
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Update form control
      this.blogForm.patchValue({ image: file });

      // Generate preview
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
    // Reset file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}