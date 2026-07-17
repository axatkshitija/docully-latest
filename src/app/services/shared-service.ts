import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
declare var myTest: any;
declare var myTest1: any;

@Injectable()
export class SharedService {
  private subject = new Subject<any>();

  sendMessage(message: string, id: number) {
    this.subject.next({ text: message, id: id });
  }



  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  stopLoader() {
    this.subject.next({ text: "Stop" });
    myTest1();
  }
  startLoader() {
    this.subject.next({ text: "Start" });
    myTest();
  }
  stopLoader1() {
    this.subject.next({ text: "Stop" });
  }
  startLoader1() {
    this.subject.next({ text: "Start" });
  }

  failedFile() {
    myTest1();
  }
}
