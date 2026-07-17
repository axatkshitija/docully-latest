import { AfterViewInit, Component, ElementRef, Injectable, NgZone, ViewChild } from '@angular/core';
import * as PDFJS from './pdf.js';
import { jsPDF } from 'jspdf';
import { DataRoomService } from 'src/app/services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { BaseUrlClass } from 'src/app/common/index';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-redactor',
  templateUrl: './redactor.component.html',
  styleUrls: ['./redactor.component.css']
})
@Injectable()
export class RedactorComponent implements AfterViewInit {

  @ViewChild('myCanvas') __CANVAS: ElementRef;
  @ViewChild('saveModel') saveModel: any; // Reference to the modal

  public __CANVAS_CTX: CanvasRenderingContext2D;

  public __PDF_DOC;
  public __CURRENT_PAGE;

  public __TOTAL_PAGES;

  public __PAGE_RENDERING_IN_PROGRESS = 0;
  public curPage;
  public img = new Image;
  public buff = [];
  public storedRects = [];
  public allPages = [];
  public rectT;
  public show = false;
  public refresh = true;
  public fillColor = "#000000";
  public fillOpacity = 1;
  public mouse = {
    button: false,
    x: 0,
    y: 0,
    down: false,
    up: false,
    that: this,
    event(e) {
      const rectCanv = this.that.__CANVAS.nativeElement.getBoundingClientRect();
      const m = this.that.mouse;
      m.x = (e.clientX - rectCanv.left) / (rectCanv.right - rectCanv.left) * this.that.__CANVAS.nativeElement.width;
      m.y = (e.clientY - rectCanv.top) / (rectCanv.bottom - rectCanv.top) * this.that.__CANVAS.nativeElement.height;
      const prevButton = m.button;
      m.button = e.type === 'mousedown' ? true : e.type === 'mouseup' ? false : this.that.mouse.button;
      if (!prevButton && m.button) {
        m.down = true;
      }
      if (prevButton && !m.button) {
        m.up = true;
      }
    }
  };
  dataroomId: any;
  folderId: any;
  fileId: any;
  baseUrl: string;
  folder_id: string;
  token: string;
  notes: any;
  isChecked: boolean = false;
  msg: string;
  redact: boolean = false;
  redactversion: boolean = false;
  pdfFile: any;

  constructor(public ngZone: NgZone, private dataRoomService: DataRoomService, private route: ActivatedRoute, private http: HttpClient, private baseUrlClass: BaseUrlClass, private spinner: SpinnerVisibilityService, private toastr: ToastrService, private router: Router) {
    this.baseUrl = this.baseUrlClass.baseUrl;
    this.token = "token " + localStorage.getItem("token");
    const that = this;
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(mainLoop);
      function mainLoop() {
        that.refresh = true;
        if (that.refresh || that.mouse.down || that.mouse.up || that.mouse.button) {
          that.refresh = false;
          if (that.mouse.down) {
            that.mouse.down = false;
            that.rectT.restart(that.mouse);
          } else if (that.mouse.button) {
            that.rectT.update(that.mouse);
          } else if (that.mouse.up) {
            that.mouse.up = false;
            that.rectT.update(that.mouse);
            const tempRect = that.rectT.toRect();
            const m = that.mouse;
            if (isFinite(tempRect.x) && isFinite(tempRect.y) && isFinite(tempRect.w) && isFinite(tempRect.h)
              && tempRect.w !== 0 && tempRect.h !== 0 // only if the mouse land in the canvas,ok
              && m.x > 0 && m.x < that.__CANVAS.nativeElement.width && m.y > 0 && m.y < that.__CANVAS.nativeElement.height) {
              that.__CANVAS_CTX.fillStyle = that.hexToRgba(that.fillColor, that.fillOpacity);
              tempRect.draw(that.__CANVAS_CTX);
              that.storedRects.push(tempRect);
              that.buff = []; // once the editor start to edit, the editor commits to the change so far, so redo is emptied out
              const canv = document.createElement('canvas');
              const canv_con = canv.getContext('2d');
              canv.width = that.__CANVAS_CTX.canvas.width;
              canv.height = that.__CANVAS_CTX.canvas.height;
              console.log(canv.width, canv.height)
              canv_con.drawImage(that.__CANVAS.nativeElement, 0, 0, that.__CANVAS_CTX.canvas.width, that.__CANVAS_CTX.canvas.height);
              that.allPages[that.__CURRENT_PAGE - 1] = canv;
            }
          }
          that.draw();
        }
        requestAnimationFrame(mainLoop);
      }
    });
    this.route.params.subscribe(params => {
      console.log(params);
      this.dataroomId = params.dataroomId;
      this.folderId = params.folderId;
      this.fileId = params.fileId;
      this.redactversion = params.redact;
      if (params.redact) {
        this.dataRoomService.getRedactFilelink(params.redactid).subscribe((res) => {
          console.log(res)
          this.pdfFile= res[0].file;
          this.captureFile(res[0].file)
          this.notes = res[0].notes
        });
      } else {
        this.dataRoomService.getFilelink(this.fileId).subscribe((res) => {
          console.log(res)
          this.pdfFile= res;
          this.captureFile(res)
        });
      }
    });
  }
  scale = 1;

  zoomIn() {
    this.scale += 0.1;
  }

  zoomOut() {
    this.scale -= 0.1;
  }

  ngOnInit() { }

  // Convert hex color to RGBA format with opacity
  hexToRgba(hex: string, opacity: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  rect(): object {
    let x1, y1, x2, y2;
    let show = false;
    const rectT = { x: 0, y: 0, w: 0, h: 0, draw };
    function fix() {
      rectT.x = Math.min(x1, x2);
      rectT.y = Math.min(y1, y2);
      rectT.w = Math.max(x1, x2) - Math.min(x1, x2);
      rectT.h = Math.max(y1, y2) - Math.min(y1, y2);
    }

    function draw(ctx) {
      ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    const API = {
      restart(point) {
        x2 = x1 = point.x;
        y2 = y1 = point.y;
        fix();
        show = true;
      },
      update(point) {
        x2 = point.x;
        y2 = point.y;
        fix();
        show = true;
      },
      toRect() {
        show = false;
        return Object.assign({}, rectT);
      },
      draw(ctx) {
        if (show) {
          rectT.draw(ctx);
        }
      },
      show: false,
    };
    return API;
  }
  ngAfterViewInit(): void {
    this.show = false;
    this.__CANVAS_CTX = (<HTMLCanvasElement>this.__CANVAS.nativeElement).getContext('2d');
    this.rectT = this.rect();
  }



  // Previous action on the PDF
  undoAction(): void {
    if (this.storedRects.length > 0) {
      this.buff.push(this.storedRects.pop());
    }
  }

  // Next action on the PDF
  redoAction(): void {
    if (this.buff.length > 0) {
      this.storedRects.push(this.buff.pop());
    }
  }
  
  // Previous page of the PDF
  prevPage(): void {
    if (this.__CURRENT_PAGE !== 1) {
      this.cleanCanvas();
      this.showPage(--this.__CURRENT_PAGE, true);
    }
  }

  // Next page of the PDF
  nextPage(): void {
    if (this.__CURRENT_PAGE !== this.__TOTAL_PAGES) {
      this.cleanCanvas();
      this.showPage(++this.__CURRENT_PAGE, true);
    }
  }


  showSuccess() {
    this.toastr.success(this.msg);
  }

  showError() {
    this.toastr.error(this.msg);
  }

  goBack() {
    if(this.redactversion){
      this.router.navigate(["/version-history", this.dataroomId, this.folderId, this.fileId]);
    }else{
      this.router.navigate(["/folder_detail", this.folderId]);
    }
   
  }
  // Download button
  UploadRedactFile(): void {
    this.saveModel.nativeElement.style.display = 'none'; // Hide the modal

    this.spinner.show();
    let width = (<HTMLCanvasElement>this.__CANVAS.nativeElement).width;
    let height = (<HTMLCanvasElement>this.__CANVAS.nativeElement).height;
    let pdf = null;
    // set the height and width for the output pdf file
    if (width > height) {
      pdf = new jsPDF('l', 'px', [width, height]);
    } else {
      pdf = new jsPDF('p', 'px', [height, width]);
    }
    width = pdf.internal.pageSize.getWidth();
    height = pdf.internal.pageSize.getHeight();

    // Create new pages with redactions rendered as fully opaque black
    const finalPages = [];
    for (let i = 0; i < this.allPages.length; i++) {
      const origCanvas = this.allPages[i];
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = origCanvas.width;
      finalCanvas.height = origCanvas.height;
      const finalCtx = finalCanvas.getContext('2d');
      
      // Draw the base image first
      finalCtx.drawImage(origCanvas, 0, 0);
      
      // Now overlay all redaction boxes with solid black (full opacity)
      finalCtx.fillStyle = 'rgba(0, 0, 0, 1)';
      this.storedRects.forEach(rect => {
        finalCtx.fillRect(rect.x, rect.y, rect.w, rect.h);
      });
      
      finalPages.push(finalCanvas);
    }

    for (let i = 0; i < finalPages.length; i++) {
      pdf.addImage(finalPages[i], 'PNG', 0, 0, width, height, "", "FAST");
      if (i < (finalPages.length - 1)) {
        pdf.addPage();  // this adds a new page
      }
    }

    // var blob = pdf.output('blob');
    // console.log(blob)

    var blobPDF = new Blob([pdf.output('blob')], { type: 'application/pdf' });
    const formData = new FormData();
    console.log(this.notes)
    formData.append("file", blobPDF);
    formData.append("notes", this.notes);
    formData.append("current_version", this.isChecked ? 'true' : 'false');

    this.http
      .post(
        this.baseUrl +
        '/redacte_pdf/' +
        this.fileId + '/',
        formData,
        {
          headers: new HttpHeaders().set("Authorization", this.token),
          responseType: "blob",
          reportProgress: true,
          observe: "events",
        }
      )
      .subscribe(
        (events: HttpEvent<any>) => {
          switch (events.type) {
            case HttpEventType.Sent:
              console.log("Start");
              break;
            case HttpEventType.Response:
              console.log("Success");
              this.msg =
                "Your files have been successfully uploaded";
              this.showSuccess();
              this.spinner.hide();
              this.goBack();
              break;
            case HttpEventType.UploadProgress:
              break;
          }
        },
        (error) => {
          this.spinner.hide();
          this.msg =
            "Something wents wrong!";
          this.showError();
          //  this.uploadError(error)
        }
      )

    // var blobUrl = URL.createObjectURL(blobPDF);  //<--- THE ERROR APPEARS HERE

    // window.open(blobUrl)

    // var link = document.createElement("a"); // Or maybe get it from the current document
    // link.href = blob;
    // link.download = "aDefaultFileName.pdf";
    // link.innerHTML = "Click here to download the file";
    // document.body.appendChild(link); // 

    //pdf.save('download.pdf');
  }

  showPDF(pdf_url): void {
    const that = this;
    PDFJS.getDocument(pdf_url).promise.then(function (pdf_doc) {
      that.__PDF_DOC = pdf_doc;
      that.__TOTAL_PAGES = that.__PDF_DOC.numPages;
      that.showPage(1, false);
      that.preloadAllPages();
    }).catch(function (error) {
      alert(error.message);
    });
  }

  showPage(page_no, prev) {
    this.storedRects = [];
    this.buff = [];
    this.__PAGE_RENDERING_IN_PROGRESS = 1;
    this.__CURRENT_PAGE = page_no;
    // Fetch the page
    const that = this;
    this.__PDF_DOC.getPage(page_no).then(function (page) {
      const width = window.screen.availWidth - 50;
      // As the canvas is of a fixed width we need to set the scale of the viewport accordingly
      const scale_required = width / page.getViewport(1).width;
      // Get viewport of the page at required scale //the scale is the % in the pdf file
      const viewport = page.getViewport(scale_required);

      // Set canvas width
      // Set canvas height
      that.__CANVAS.nativeElement.width = width;
      that.__CANVAS.nativeElement.height = viewport.height;

      const renderContext = {
        canvasContext: that.__CANVAS_CTX,
        viewport: viewport
      };
      // Render the page contents in the canvas
      page.render(renderContext).then(function () {
        that.__PAGE_RENDERING_IN_PROGRESS = 0;
        if (prev) {
          console.log(page_no);
          that.img.src = that.allPages[page_no - 1].toDataURL();
        } else {
          that.img.src = that.__CANVAS.nativeElement.toDataURL();
        }
      });
    });
  }

  draw() {
    this.__CANVAS_CTX.drawImage(this.img, 0, 0, this.__CANVAS_CTX.canvas.width, this.__CANVAS_CTX.canvas.height);
    this.__CANVAS_CTX.lineWidth = 1;
    this.__CANVAS_CTX.strokeStyle = 'black';
    this.__CANVAS_CTX.fillStyle = this.hexToRgba(this.fillColor, this.fillOpacity);
    this.storedRects.forEach(rect2 => rect2.draw(this.__CANVAS_CTX));
    this.__CANVAS_CTX.fillStyle = this.hexToRgba(this.fillColor, this.fillOpacity * 0.5);
    this.__CANVAS_CTX.strokeStyle = 'red';
    this.rectT.draw(this.__CANVAS_CTX);
  }
  cleanCanvas(): void {
    this.__CANVAS_CTX.clearRect(0, 0, this.__CANVAS_CTX.canvas.width, this.__CANVAS_CTX.canvas.height);
    this.fillColor = "#000000";
    this.img.src = this.__CANVAS.nativeElement.toDataURL();
  }


  captureFile(event) {
    this.cleanCanvas();
    this.showPDF(event);
    this.show = true;
  }

  removeFile($event) {
    this.show = false;
  }

  preloadAllPages() {
    this.allPages = [];
    const that = this;
    for (let i = 1; i <= this.__TOTAL_PAGES; i++) {
      this.__PDF_DOC.getPage(i).then(function (page) {
        const width = window.screen.availWidth - 50;
        // As the canvas is of a fixed width we need to set the scale of the viewport accordingly
        const scale_required = width / page.getViewport(1).width;
        // Get viewport of the page at required scale //the scale is the % in the pdf file
        const viewport = page.getViewport(scale_required);
        const canv = document.createElement('canvas');
        const canv_con = canv.getContext('2d');
        // Set canvas width
        // Set canvas height
        canv.width = width;
        canv.height = viewport.height;

        const renderContext = {
          canvasContext: canv_con,
          viewport: viewport
        };
        // Render the page contents in the canvas
        page.render(renderContext).then(function () {
          that.allPages.push(canv);
        });
      });
    }
  }
}
 