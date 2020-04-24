import { Component, AfterViewInit } from '@angular/core';

import { ProcessImageService } from '../process-image.service';
import { EditImageService } from '../edit-image.service';

@Component({
  selector: 'app-input-image',
  templateUrl: './input-image.component.html',
  styleUrls: ['./input-image.component.css']
})
export class InputImageComponent implements AfterViewInit {

  constructor(
    private imageProcessingService: ProcessImageService,
    private editImageService: EditImageService
  ) { }

  public resultImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAIXSURBVHhe7dOxDcAwEAOxT/bf2U6R0r4JSEDQBPfMzPoGHLz/AwcCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgELia2emKAo8Yjjp5AAAAAElFTkSuQmCC";
  public hasImage = false;
  public imageError = "";
  public cardImageBase64:string;
  public needToClearImage = false;
  ngAfterViewInit(): void {

  }

  public onSelectFile(fileInput: any){
    if (fileInput.target.files && fileInput.target.files[0]) {
      const max_width = 256;
      const max_height = 256;
      const reader = new FileReader();
      const file = fileInput.target.files[0];
      const fb = reader.readAsDataURL(file);
      if(!this.hasImage && this.needToClearImage){
        this.needToClearImage = false;
      }

      reader.onload = (e: any) => {
        if(this.needToClearImage){
          this.hasImage = false;
          return false;
        }
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];
          if (img_height > max_height && img_width > max_width) {
            
            this.imageError =
                'Maximum dimentions allowed ' +
                max_height +
                '*' +
                max_width +
                'px';
            return false;
          } else {
              const imgBase64Path = e.target.result;
              this.cardImageBase64 = imgBase64Path;
              this.hasImage = true;
          }

          reader.readAsDataURL(fileInput.target.files[0]);
        }
      } 
    }
  }

  public processImage(){
    if(this.hasImage){
      var inputImage = this.cardImageBase64.split(',')[1];
      this.imageProcessingService.processImage(inputImage).subscribe(data => {
        this.resultImage = this.safeToUnsafeB64(data['imageOutput'])
      })
    }
  }

  private safeToUnsafeB64(input: string){
    var result = input.replace(/\-/gi,'+');
    result = result.replace(/\_/gi,'/');
    return "data:image/png;base64," + result;
  }

  public clearImage(){
    this.imageError = "";
    this.cardImageBase64 = "";
    this.needToClearImage = true;
  }

  public editImageAsCanvas(){
    this.editImageService.updateImage(this.cardImageBase64);
  }

}
