import { Component } from '@angular/core';
import { ImageService, Image } from './synology/synology.image';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ImageService]
})
export class AppComponent {
  images: Image[] = [];
  selectedImage: Image | undefined;

  title = 'photography';

  constructor(private imageService: ImageService, private sanitizer: DomSanitizer) {
    imageService.getImages(0, 100)
      .subscribe(i => {
        this.images = i;
        this.images.forEach(i => i.url = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/*;base64," + i.thumbnail))
      })
  }

  onImageClick(image: Image) {  
    this.selectedImage = image;
  }

  onClose(event: any) {
    this.selectedImage = undefined;
  }
}
