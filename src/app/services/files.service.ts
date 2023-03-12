import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as saveAs from 'file-saver';
import { map, tap } from 'rxjs';

interface File {
  originalname: string;
  filename: string;
  locationL: string;
}

@Injectable({
  providedIn: 'root'
})


export class FilesService {

  private apiurl = 'http://localhost';

  constructor(
    private httpClient: HttpClient,
  ) { }

  getFile(name: string, url: string, type: string) {
    return this.httpClient.get(url, {responseType: 'blob'})
    .pipe(
      tap(content => {
        const blob = new Blob([content], {type});
        saveAs(blob, name);
      }),
      map(() => true)
    )
  }

  uploadFile(file: Blob) {
    const dto = new FormData();
    dto.append('file', file);
    return this.httpClient.post<File>(`${this.apiurl}/uploead`, dto,
    {
      headers: {
          'Content-Type': "multipart/form-data"
      }
    })
  }
}
