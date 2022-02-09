import {MatSnackBar} from '@angular/material/snack-bar';
import {Component, Inject} from '@angular/core';
import {NgxFileDropEntry} from "ngx-file-drop";
import {SCHEMA_SERVICE} from "../../app.module";
import {AbstractSchemaService} from "../../services/abstract-schema.service";


@Component({
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {


  constructor(@Inject(SCHEMA_SERVICE) private schemaService: AbstractSchemaService,
              private snackBar: MatSnackBar) {
  }

  public files: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file(async (file: File) => {
          const formData = new FormData();
          formData.append('json', file, droppedFile.relativePath);

          this.schemaService.uploadSchema(file, droppedFile.relativePath)
            .subscribe(d => {
              if (!!d) {
                this.snackBar.open(`Schema uploaded successfully tx_id: ${d?.txHex}`, '', {duration: 2000})
              }
              console.log(d)
            });
        });
      } else {
        // const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        // console.log(droppedFile.relativePath, fileEntry);
        this.snackBar.open(`Please provide valid json-ld file`, '', {duration: 2000})
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
