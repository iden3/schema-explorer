import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { of, take } from 'rxjs';
import { LoadingService } from '../../services/loading.service';
import { catchError } from 'rxjs/operators';
import { IPFSService } from '../../services/ipfs.service';

@Component({
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  public files: NgxFileDropEntry[] = [];
  public d = null;

  constructor(private ipfsService: IPFSService, private snackBar: ToastrService, private loadService: LoadingService) {}

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        this.loadService.setLoading(true);

        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file(async (file: File) => {
          const formData = new FormData();
          const relativePath = droppedFile.relativePath;
          formData.append('json', file, relativePath);
          this.ipfsService
            .uploadSchema(file, relativePath)
            .pipe(
              take(1),
              catchError(err => {
                this.openSnack('Error occurred, try again later');
                console.log(err);
                return of(err);
              })
            )
            .subscribe(d => {
              if (!!d) {
                this.openSnack(`Schema uploaded successfully tx_id: ${JSON.stringify(d)}`);
              }
              this.d = d;
              this.loadService.setLoading(false);
            });
        });
      } else {
        this.openSnack(`Please provide valid json-ld file`);
      }
    }
  }

  public fileOver(event: Event) {
    console.log(event);
  }

  public fileLeave(event: Event) {
    console.log(event);
  }

  openSnack(msg: string) {
    this.snackBar.info(msg);
  }

  copy(): void {
    const data = [new ClipboardItem({ 'text/plain': new Blob([JSON.stringify(this.d)], { type: 'text/plain' }) })];
    navigator.clipboard.write(data).then(
      () => this.openSnack('Copied to clipboard'),
      () => this.openSnack('Unable to write to clipboard.')
    );
  }
}
