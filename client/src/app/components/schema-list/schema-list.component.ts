import { Schema } from '../../models/schema';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-schema-list',
  templateUrl: './schema-list.component.html',
  styleUrls: ['./schema-list.component.scss'],
})
export class SchemaListComponent {
  constructor(private readonly router: Router, private readonly dataService: DataService) {}

  @Input() schemas: readonly Schema[] | null = [];

  navigate(id: string | undefined) {
    // @ts-ignore
    const schema: Schema = this.schemas?.find(s => s.id === id);
    this.dataService.nextSchema(schema);
    this.router.navigate(['dashboard', id]);
  }
}
