import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-asigurare',
  templateUrl: './asigurare.component.html',
  styleUrls: ['./asigurare.component.scss']
})
export class AsigurareComponent implements OnInit {
  private baseUrl = `${environment.baseUrl}`;
 ngOnInit(): void {
   
 }
  ocrForm: FormGroup;
  extractedText: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.ocrForm = this.fb.group({
      file: [null],
      nume: [''],
      prenume: [''],
      actIdentitate: [''],
      cnp: [''],
      judet: [''],
      localitate: [''],
      strada: [''],
      numar: [''],
      bloc: [''],
      scara: [''],
      etaj: [''],
      apartament: [''],
      codPostal: [''],
      anObtinerePermis: [''],
      email: [''],
      telefon: ['']
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.http.post<{ extractedText: string }>('https://localhost:7201/api/Asigurare/extract', formData)
        .subscribe(response => {
          this.extractedText = response.extractedText;
          this.mapExtractedText(response.extractedText);
        });
    }
  }

  captureImage() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        setTimeout(() => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(blob => {
            if (blob) {
              const file = new File([blob], 'captured.png', { type: 'image/png' });
              this.onFileChange({ target: { files: [file] } });
            }
          });
        }, 2000);
      });
  }

  mapExtractedText(text: string) {
    const lines = text.split('\n');
    this.ocrForm.patchValue({
      nume: lines[0] || '',
      prenume: lines[1] || '',
      actIdentitate: lines[2] || '',
      cnp: lines[3] || '',
      email: lines.find(line => line.includes('@')) || '',
      telefon: lines.find(line => line.match(/\d{10}/)) || ''
    });
  }
}

