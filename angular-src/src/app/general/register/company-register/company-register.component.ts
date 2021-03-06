import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../../services/validate.service';
import {IamService} from '../../../services/iam.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-company-register',
  templateUrl: './company-register.component.html',
  styleUrls: ['./company-register.component.css']
})
export class CompanyRegisterComponent implements OnInit {

  name: string;
  email: string;
  description: string;
  location: string;
  contact: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
  responseBoxError: string;
  errorBox: string;

  constructor(private validateService: ValidateService,
              private IamService: IamService,
              private flashMessage: FlashMessagesService,
              private authService: AuthService,
              private router: Router
              ) {}

  ngOnInit() {
  }

  clicked(event) {
    this.acceptedTerms = true;
  }
  registerCompany() {
    const recruiter = {
      name: this.name,
      email: this.email,
      description: this.description,
      location: this.location,
      contact: this.contact,
      password: this.password,
      confirmPassword: this.confirmPassword
    };

      //Check if all fields are filled
      if (!this.validateService.validateRegisterCompany(recruiter))  {
        this.flashMessage.show("Please fill all the fields", {cssClass: 'alert-danger', timeout: 2000});
        return false;
      }

      if(!this.validateService.samePasswords(recruiter.password,recruiter.confirmPassword)) {
        this.flashMessage.show("Passwords do not match", {cssClass: 'alert-danger', timeout: 2000});
        return false;
      }

      if (!this.acceptedTerms) {
        this.flashMessage.show("Please accept the terms before proceding", {cssClass: 'alert-danger', timeout: 2000});
        return false;
      }

    const formData: FormData = new FormData();
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('description', this.description);
    formData.append('location', this.location);
    formData.append('contact', this.contact);


    this.IamService.registerCompany(formData).subscribe(data => {
      if (data.succeeded) {
        this.flashMessage.show("Successfully registered.", {cssClass: 'alert-success', timeout: 5000});
        this.router.navigate(['/','login']).then(nav => {
        }, err => {
          console.log(err);
          this.flashMessage.show(err, {cssClass: 'alert-danger', timeout: 2000});

        });
      }
      }, error => {
        document.getElementById('responseBoxError').innerText = error;
        console.log(error);
      });


    }
  }
