import { Component, HostListener } from '@angular/core';
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
  loadedImages: number = 0;
  imagesToLoad: number = 20;
  allowFetching: boolean = true;

  title = 'photography';

  constructor(private imageService: ImageService, private sanitizer: DomSanitizer) {
    this.fetchImages();
  }

  onImageClick(image: Image) {  
    this.selectedImage = image;
  }

  onClose(event: any) {
    this.selectedImage = undefined;
  }

  fetchImages() {
    this.allowFetching = false; // stop fetching while waiting for images
    this.imageService.getImages(this.loadedImages, this.imagesToLoad)
    .subscribe(images => {
      if(images.length === 0) {
        this.allowFetching = false;
        return;
      }
      this.allowFetching = true;
      images.forEach(image => this.images.push(image));
      this.images.forEach(i => i.url = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/*;base64," + i.thumbnail))
    })
  }

  @HostListener('window:scroll', [])
  onScroll() {
    if(this.allowFetching) {
      if(window.innerHeight + window.scrollY >= document.body.offsetHeight) { // at bottom of the page
        this.loadedImages += this.imagesToLoad;
        this.fetchImages();
      }
    }
  }
}
