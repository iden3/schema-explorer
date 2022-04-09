import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Schema } from '../../models/schema';
import { urlValidator } from '../../validators/url.validator';

@Component({
  selector: 'app-register-schema',
  templateUrl: './register-schema.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./register-schema.component.scss'],
})
export class RegisterSchemaComponent {
  form: FormGroup;
  @Output() RegisterEvt = new EventEmitter<Schema>();

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      url: ['', [Validators.required, urlValidator()]],
      credentialType: ['', [Validators.required]],
      desc: ['', [Validators.required]],
    });
  }

  get url() {
    return this.form.get('url');
  }

  get credentialType() {
    return this.form.get('credentialType');
  }

  get desc() {
    return this.form.get('desc');
  }

  register() {
    this.RegisterEvt.emit(this.form.value);
  }
}
