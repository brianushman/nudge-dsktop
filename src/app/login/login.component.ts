import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Input() SubmitText:string = 'Login';
  @Input() Cancelable:boolean = false;
  @Output() closed = new EventEmitter<void>();

  registerForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private cookieService: CookieService
    ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      key: ['', Validators.required],
      token: ['', Validators.required]
    });    
  }

  onSubmit() {
    this.submitted = true;
     
    // stop the process here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    if(!environment.production) {
      this.cookieService.set('nudge-api-key', this.registerForm.controls.key.value, 100000, "/", 'localhost', false, "Lax");
      this.cookieService.set('nudge-api-token', this.registerForm.controls.token.value, 100000, "/", 'localhost', false, "Lax");
    }
    else {
      this.cookieService.set(
        'nudge-api-key', 
        this.registerForm.controls.key.value, 
        100000,
        '/nudge-dsktop',
        'brianushman.github.io',
        true,
        'Strict');
      this.cookieService.set(
        'nudge-api-token',
        this.registerForm.controls.token.value,
        100000,
        '/nudge-dsktop',
        'brianushman.github.io',
        true,
        'Strict');
    }
 
    if(this.Cancelable)
      this.closed.emit();

    // always refresh the page, makes no sense not to since api tokens are being updated.
    location.reload();
  }

  onClose() {
    if(this.Cancelable) this.closed.emit();
  }
}
