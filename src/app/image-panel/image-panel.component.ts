import { Component, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitter } from '@angular/core';
import { Image, ImageService, LargeImage } from '../synology/synology.image';
import { MDCSnackbar } from '@material/snackbar';


@Component({
  selector: 'image-panel',
  templateUrl: './image-panel.component.html',
  styleUrls: ['./image-panel.component.css', './snackbar.scss']
})
export class ImagePanelComponent implements OnInit {
  @Input() selectedImage: Image | undefined;
  @Output() close: EventEmitter<any> = new EventEmitter();
  largeImage: LargeImage | undefined;
  exifOpen: boolean = false;

  constructor(private imageService: ImageService, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    if (this.imageService && this.selectedImage) {
      this.imageService.getImage(this.selectedImage)
        .subscribe(response => {
          this.largeImage = response;
          this.largeImage.url = this.sanitizer.bypassSecurityTrustResourceUrl("data:image/*;base64," + this.largeImage.image);
        })
    }
  }

  onClose() {
    this.close.emit();
  }

  toggleExif() {
    let exifSelector = document.querySelector('.mdc-snackbar');
    if (exifSelector) {
      console.log(exifSelector);
      let snackbar = new MDCSnackbar(exifSelector);
      if(this.exifOpen) {
        exifSelector.classList.remove("mdc-snackbar--open");
      } else {
        exifSelector.classList.add("mdc-snackbar--open");
      }
      this.exifOpen = !this.exifOpen;
    }
  }

}
