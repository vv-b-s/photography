import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

export interface Image {
  id: string,
  thumbnailUnitId: string,
  fileName: string,
  dateTaken: string,
  cacheKey: string,
  thumbnail: string,
  url: SafeUrl,
  address: string,
  description: string,
  availableSizes: string[]
}

export interface LargeImage {
  contentDescription: string,
  contentType: string,
  exif: {
    aperture: string,
    camera: string,
    exposure_time: string,
    focal_length: string,
    iso: string,
    lens: string
  },
  image: string,
  url: SafeResourceUrl
}

@Injectable()
export class ImageService {
  constructor(private http: HttpClient) {
  }

  getImages(start: number, end: number) {
    return this.http.get<Image[]>(`${environment.synology}/images`, {params: {
      start: start,
      end: end,
      order: 'DESCENDING'
    }}).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  getImage(image: Image) {
    let imageRequest = {
      id: image.id,
      thumbnailUnitId: image.thumbnailUnitId,
      fileName: image.fileName,
      cacheKey: image.cacheKey,
      imageSize: "xl"
    };

    return this.http.post<LargeImage>(`${environment.synology}/images`, imageRequest).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
