import { MatSnackBar } from '@angular/material/snack-bar';
import { Component } from '@angular/core';
import { NgxFileDropEntry } from "ngx-file-drop";
import { HttpClient } from "@angular/common/http";

@Component({
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {


  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
  }
  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          const formData = new FormData();
          formData.append('json', file, droppedFile.relativePath);

          this.http.post<any>('/api/schema/save', formData)
            .subscribe(d => {
              if (!!d) {
                this.snackBar.open(`Schema uploaded successfully tx_id: ${d?.txHex}`, '', { duration: 2000 })
              }
              console.log(d)
            });

        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event: Event) {
    console.log(event);
  }

  public fileLeave(event: Event) {
    console.log(event);
  }

}
