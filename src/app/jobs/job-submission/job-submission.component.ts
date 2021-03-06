import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { JobSubmissionService } from './job-submission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-job-submission',
  templateUrl: './job-submission.component.html',
  styleUrls: ['./job-submission.component.css'],
  providers: [JobSubmissionService]
})
export class JobSubmissionComponent implements OnInit {
  jobSubmissionForm: FormGroup;
  uploadFileForm: FormGroup;
  
  jobId: string;
  candidate: {firstName: string, lastName: string, phone: string, email: string, fileUploaded: {id: number}};
  fileUploadedId: number;

  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private jobSubmissionService: JobSubmissionService) { 
    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.jobId = params.get("id")
    });
    
    this.jobSubmissionForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('' , Validators.required)//, Validators.pattern(/^[0-9A-Fa-f][0-9A-Fa-f](:[0-9A-Fa-f][0-9A-Fa-f]){5}$/)]),
    });

    this.uploadFileForm = new FormGroup({
      fileUploaded: new FormControl('', Validators.required)
    });
  }

  submitJob() {
    console.log(this.jobSubmissionForm.value);
    this.candidate = {
      firstName: this.jobSubmissionForm.value.firstName, 
      lastName: this.jobSubmissionForm.value.lastName, 
      phone: this.jobSubmissionForm.value.phone, 
      email: this.jobSubmissionForm.value.email, 
      fileUploaded: {id: this.fileUploadedId}};

      this.jobSubmissionService.submitJob(this.jobId, this.candidate).subscribe(JobSubmission =>{
        console.log(JobSubmission);
        this.router.navigate(['/job', this.jobId]);
    });
  }

  uploadFile(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      this.jobSubmissionService.uploadFile(file).subscribe( response =>{
        this.fileUploadedId = response["id"];
      });
    }
    
  }
}
