import {MatSnackBar} from '@angular/material/snack-bar';
import {Component, Inject, OnDestroy} from '@angular/core';
import {NgxFileDropEntry} from "ngx-file-drop";
import {SCHEMA_SERVICE} from "../../app.module";
import {AbstractSchemaService} from "../../services/abstract-schema.service";
import {of, take, tap} from "rxjs";
import {LoadingService} from "../../services/loading.service";
import {catchError} from "rxjs/operators";
import {EventBusService, EventType} from "../../services/event-bus.service";
import {CONSTANTS} from "../../utils/constants";


@Component({
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnDestroy {
  source: string = CONSTANTS.DEFAULT_SOURCE;
  public files: NgxFileDropEntry[] = [];
  private sourceChangesSub = this.eventBusService.on(EventType.SourceChanges, (source: string) => this.source = source)

  constructor(@Inject(SCHEMA_SERVICE) private schemaService: AbstractSchemaService,
              private snackBar: MatSnackBar,
              private loadService: LoadingService,
              private eventBusService: EventBusService) {
  }


  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      if (droppedFile.fileEntry.isFile) {
        this.loadService.setLoading(true)

        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file(async (file: File) => {
          const formData = new FormData();
          const relativePath = droppedFile.relativePath;
          formData.append('json', file, relativePath);
          const path = `${relativePath}?type=${this.source}`;
          this.schemaService.uploadSchema(file, path).pipe(
            take(1),
            tap(_ => this.disableLoading()),
            catchError((err) => {
              this.openSnack('Error occurred, try again later')
              console.log(err)
              this.disableLoading()
              return of(err);
            })
          )
            .subscribe(d => {
              if (!!d) {
                this.openSnack(`Schema uploaded successfully tx_id: ${JSON.stringify(d)}`)
              }
              console.log(d)
            });
        });
      } else {
        // const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        // console.log(droppedFile.relativePath, fileEntry);
        this.openSnack(`Please provide valid json-ld file`)
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
    this.snackBar.open(msg, '', {duration: 2000})
  }

  disableLoading() {
    setTimeout(() => this.loadService.setLoading(false), 500)
  }

  ngOnDestroy(): void {
    this.sourceChangesSub.unsubscribe();
  }

}
