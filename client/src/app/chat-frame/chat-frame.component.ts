import { Component, OnInit } from '@angular/core';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { ToastrService } from 'ngx-toastr';


export class MessagePack {
  constructor(
    private type: string,
    private sender: string,
    private cc: Array<string>,
    private content: string,
    private dateTime: number
  ) { }

  getType(): string {
    return this.type;
  }

  getSender(): string {
    return this.sender;
  }

  getCc(): Array<string> {
    return this.cc;
  }

  getContent(): string {
    return this.content;
  }

  getDateTime(): number {
    return this.dateTime;
  }
}

@Component({
  selector: 'app-chat-frame',
  templateUrl: './chat-frame.component.html',
  styleUrls: ['./chat-frame.component.scss']
})



export class ChatFrameComponent implements OnInit {

  private webSocket$: WebSocketSubject<string>;
  private gnrlMsgWd: Element;
  private tgtMsgWd: Element;
  private newLine: Element;
  private name: string;
  public message: string;
  private messageQueue: Array<object>;
  private enableSend: boolean;
  private enableShow: boolean;
  private enableNotify: boolean;

  constructor(private toastr: ToastrService) { }

  ngOnInit() {
    this.enableSend = false;
    this.enableShow = false;
    this.enableNotify = false;
    this.messageQueue = new Array<object>();
    this.webSocket$ = WebSocketSubject.create('wss://treehollow.app:8998');
    this.webSocket$.subscribe(
      (message) => {
        for (let i = 0; i < message.length; i++) {
          const raw = JSON.parse(JSON.stringify(message[i]));
          if (!this.enableSend) {
            this.messageQueue.push(raw);
          } else {
            this.gnrlShow(new MessagePack(raw.type, raw.sender, raw.cc, raw.content, raw.dateTime));
          }
        }
        this.enableShow = true;
      },
      (err) => console.error(err),
      () => console.warn('Completed!')
    );
    this.gnrlMsgWd = document.getElementById('gnrlMsgWd');
    this.tgtMsgWd = document.getElementById('tgtMsgWd');
    const tx = document.getElementById('msgInptWd');
    const bt = document.getElementById('smtBt');
    tx.addEventListener('input', OnInput, true);
    function OnInput() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
      bt.scrollIntoView();
    }
    tx.addEventListener('keyup', function (event) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13 && (event.ctrlKey || event.metaKey)) {
        // Trigger the button element with a click
        bt.click();
      }
    });
    bt.addEventListener('click', function () {
      tx.style.height = 'initial';
    });
  }

  send() {
    this.message = this.message.split('\n').join('<br>');
    const cc = [];
    let message = this.message;
    while (message.indexOf('@') !== -1) {
      message = message.substring(message.indexOf('@') + 1);
      cc.push(message.split(' ')[0]);
    }
    const messagePack = new MessagePack('regular', this.name, cc, this.message, Date.now());
    this.gnrlShow(messagePack);
    this.webSocket$.next(JSON.stringify(messagePack));
    document.getElementById('msgInptWd').focus();
  }

  gnrlShow(messagePack: MessagePack) {
    if (messagePack.getType() !== undefined && (messagePack.getType() === 'online' || messagePack.getType() === 'offline')) {
      this.toastr.show('<div class="text-dark">' + messagePack.getSender() + ' is ' + messagePack.getType() + '!</div>',
        '', { enableHtml: true });
      this.newLine = document.createElement('h6');
      this.newLine.className = 'row justify-content-center animated zoomIn';
      this.newLine.innerHTML = messagePack.getType() === 'online' ?
        ('<span class="badge badge-pill" style="background-color: rgba(158,158,158,0.5)"><small><small><small><small><small>'
          + new Date(messagePack.getDateTime()).toLocaleString() + ' ' + messagePack.getSender() + ' is online'
          + '</small></small></small></small></small></span>') : ('<span class="badge badge-pill"' +
            'style="background-color: rgba(158,158,158,0.5"><small><small><small><small><small>'
            + new Date(messagePack.getDateTime()).toLocaleString() + ' ' + messagePack.getSender() + ' is offline'
            + '</small></small></small></small></small></span>');
      this.gnrlMsgWd.appendChild(this.newLine);
      this.newLine.scrollIntoView();
    } else {
      if (this.enableNotify) {
        if (messagePack.getCc().includes(this.name)) {
          this.toastr.show('<div class="text-dark">Yor were mentioned!</div>', '', { enableHtml: true });
        } else if (messagePack.getSender() !== this.name) {
          this.toastr.show('<div class="text-dark">New Post!</div>', '', { enableHtml: true });
        }
      }
      this.newLine = document.createElement('div');
      this.newLine.className = messagePack.getSender() === this.name ? 'row justify-content-end animated fadeInRight'
        : 'row justify-content-start animated fadeInLeft';
      this.newLine.innerHTML = '<span class="card border-dark mb-2" style="max-width: 80%; background-color: rgba(255,255,255,0.85)">'
        + '<span class="card-header font-weight-bold text-left p-2">'
        + messagePack.getSender() + '</span>' + '<span class="card-body text-dark p-3">' + '<p class="card-text text-left">'
        + messagePack.getContent() + '</p>' + '</span>' + '<div class="card-footer text-muted text-right p-2" style="font-size: small">'
        + new Date(messagePack.getDateTime()).toLocaleString() + '</div>' + '</span>';

      if ((messagePack.getSender() === this.name && messagePack.getCc().length > 0) || messagePack.getCc().includes(this.name)) {
        this.tgtMsgWd.appendChild(this.newLine.cloneNode(true));
        this.tgtMsgWd.scrollTop = this.tgtMsgWd.scrollHeight;
      }
      this.gnrlMsgWd.appendChild(this.newLine);
      this.gnrlMsgWd.scrollTop = this.gnrlMsgWd.scrollHeight;
    }

    // if (this.printTime === undefined || messagePack.getDateTime() - this.printTime > 1000 * 60 * 5) {
    //   this.printTime = messagePack.getDateTime();
    //   this.newLine = document.createElement('h6');
    //   this.newLine.className = 'row justify-content-center animated zoomIn';
    //   this.newLine.innerHTML = '<span class="badge badge-pill grey"><small><small><small><small><small>'
    //     + new Date(this.printTime).toLocaleString() + '</small></small></small></small></small></span>';
    //   if ((messagePack.getSender().match(this.name) && messagePack.getCc().length > 0) || messagePack.getCc().match(this.name)){
    //     this.tgtMsgWd.appendChild(this.newLine.cloneNode(true));
    //   }
    //   this.gnrlMsgWd.appendChild(this.newLine);
    // }

    // if (this.preSender === undefined || !this.preSender.match(messagePack.getSender())) {
    //   this.preSender = messagePack.getSender();
    //   this.newLine = document.createElement('h5');
    //   this.newLine.className = messagePack.getSender().match(this.name) ? 'row justify-content-end' : 'row justify-content-start';
    //   this.newLine.innerHTML = messagePack.getSender().match(this.name) ? ('<span class="badge grey animated fadeInRight">'
    //     + this.preSender + '</span>') : ('<span class="badge grey animated fadeInLeft">'
    //     + this.preSender + '</span>');
    //   if ((messagePack.getSender().match(this.name) && messagePack.getCc().length > 0) || messagePack.getCc().match(this.name)){
    //     this.tgtMsgWd.appendChild(this.newLine.cloneNode(true));
    //   }
    //   this.gnrlMsgWd.appendChild(this.newLine);
    // }
    // this.newLine = document.createElement('h6');
    // this.newLine.className = messagePack.getSender().match(this.name) ? 'row justify-content-end' : 'row justify-content-start';
    // this.newLine.innerHTML = messagePack.getSender().match(this.name) ? ('<span class="card card-text animated fadeInRight' +
    //   'font-weight-normal" style="max-width: 80%; padding: 5px;">' + messagePack.getContent() + '</span>') : ('<span class="card' +
    //   'card-text animated fadeInLeft font-weight-normal" style="max-width: 80%; padding: 5px">' + messagePack.getContent() + '</span>');
  }

  setName(name: string) {
    this.name = name;
    this.webSocket$.next(JSON.stringify(new MessagePack('online', this.name, [], 'online', Date.now())));
    while (!this.enableShow) { }
    if (this.messageQueue !== undefined && this.messageQueue.length > 0) {
      for (let i = 0; i < this.messageQueue.length; i++) {
        const raw = JSON.parse(JSON.stringify(this.messageQueue[i]));
        this.gnrlShow(new MessagePack(raw.type, raw.sender, raw.cc, raw.content, raw.dateTime));
      }
    }
    document.getElementById('smtBt').innerHTML = this.name + ' <i class="fa fa-rocket" aria-hidden="true" id="btName"></i>';
    this.enableSend = true;
    this.enableNotify = true;
  }

  enableSendValidate() {
    return !this.enableSend || this.message === undefined || this.message.length < 1;
  }

}
