import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';
import { ProcessImageService } from '../process-image.service';
import { EditImageService } from '../edit-image.service';

@Component({
  selector: 'app-draw-canvas',
  templateUrl: './draw-canvas.component.html',
  styleUrls: ['./draw-canvas.component.css']
})
export class DrawCanvasComponent implements AfterViewInit {

  @ViewChild('canvas') public canvas: ElementRef;

  constructor(
    private imageProcessingService: ProcessImageService,
    private editImageService: EditImageService
  ) { }

  private cx: CanvasRenderingContext2D;
  public width = 256;
  public height = 256;
  public processing = false;
  public resultImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAIXSURBVHhe7dOxDcAwEAOxT/bf2U6R0r4JSEDQBPfMzPoGHLz/AwcCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgELia2emKAo8Yjjp5AAAAAElFTkSuQmCC"
  private imageToEdit: string;
  private imageToEditReadStatus: boolean;

  ngAfterViewInit(){
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    canvasEl.width = this.width;
    canvasEl.height = this.height;
    this.cx = this.canvas.nativeElement.getContext('2d');

    this.setLineAsPencil();
    this.clearCanvas();
    this.captureEvents(canvasEl);

    this.checkAndUpdateImageToEdit();
  }

  private checkAndUpdateImageToEdit(){
    const root = this;
    setInterval( function run(){
      if(root.isCanvasBlank()){
        root.getImageToEdit();
        root.getImageToEditReadStatus();
        if(root.imageToEdit && root.imageToEdit != '' && !root.imageToEditReadStatus){
          root.drawImageToEdit();
          root.updateImageToEditReadStatusAsRead();
        }
      }
    }, 1000)
  }

  public isCanvasBlank(){
    const pixelBuffer = new Uint32Array(
      this.cx.getImageData(0, 0, this.width, this.height).data.buffer
    )
    return !pixelBuffer.some(color => color !== 4294967295) //white
  }

  public setLineAsEraser(){
    this.cx.lineWidth = 4;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#fff';
  }

  public setLineAsPencil(){
    this.cx.lineWidth = 2;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';
  }

  public clearCanvas(){
    this.cx.fillStyle = '#fff';
    this.cx.fillRect(0,0, this.width, this.height);
  }
  
  private captureEvents(canvasEl: HTMLCanvasElement) {
    fromEvent(canvasEl, 'mousedown')
    .pipe(
      switchMap(() => {
        return fromEvent(canvasEl, 'mousemove')
          .pipe(
            takeUntil(fromEvent(canvasEl, 'mouseup')),
            takeUntil(fromEvent(canvasEl, 'mouseleave')),
            pairwise()
          )
      })
    ).subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();
  
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };
  
        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };
  
        this.drawOnCanvas(prevPos, currentPos);
      });

    fromEvent(canvasEl, 'touchstart')
    .pipe(
      switchMap(() => {
        return fromEvent(canvasEl, 'touchmove')
          .pipe(
            takeUntil(fromEvent(canvasEl, 'touchend')),
            takeUntil(fromEvent(canvasEl, 'touchleave')),
            pairwise()
          )
      })
    ).subscribe((res: [TouchEvent, TouchEvent]) => {
        const rect = canvasEl.getBoundingClientRect();
        const prevPos = {
          x: res[0].touches[0].clientX - rect.left,
          y: res[0].touches[0].clientY - rect.top
        };
  
        const currentPos = {
          x: res[1].touches[0].clientX - rect.left,
          y: res[1].touches[0].clientY - rect.top
        };
  
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) { return; }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y);
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }


  public processImage(){
    var inputImage = this.canvas.nativeElement.toDataURL('image/jpeg', 1.0).substring(23);
    this.imageProcessingService.processImage(inputImage).subscribe(data => {
      this.resultImage = this.safeToUnsafeB64(data['imageOutput'])
    })
  }

  private safeToUnsafeB64(input: string){
    var result = input.replace(/\-/gi,'+');
    result = result.replace(/\_/gi,'/');
    return "data:image/png;base64," + result;
  }

  private getImageToEdit(){
    this.editImageService.getImageB64().subscribe(image => this.imageToEdit = image);
  }

  private getImageToEditReadStatus(){
    this.editImageService.getReadStatus().subscribe(readStatus => this.imageToEditReadStatus = readStatus);
  }

  private updateImageToEditReadStatusAsRead(){
    this.editImageService.setAsRead();
  }

  private drawImageToEdit(){
    if(this.imageToEdit && this.imageToEdit != '' ){
      const image = new Image();
      image.onload = () => {
        this.cx.drawImage(image,0,0);
      }
      image.src = this.imageToEdit;
    }
  }

}
