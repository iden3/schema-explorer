import { Component, OnInit } from '@angular/core';
import {NgxFileDropEntry} from "ngx-file-drop";
import {HttpClient} from "@angular/common/http";

@Component({
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {


  constructor(private http: HttpClient) {
  }
  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);


           // You could upload it like this:
           const formData = new FormData();
           formData.append('json', file, droppedFile.relativePath);

           // Headers
          //  const headers = new HttpHeaders({
          //   'security-token': 'mytoken'
          // })

           this.http.post<any>('/api/schema/save', formData).subscribe()


        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event: Event){
    console.log(event);
  }

  public fileLeave(event: Event){
    console.log(event);
  }

}
