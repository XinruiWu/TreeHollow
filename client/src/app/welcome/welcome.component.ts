import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  @Input() name: string;

  @Output() nameSetter = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {
    const tx = document.getElementById('name');
    const bt = document.getElementById('nameBt');
    tx.addEventListener('keyup', function(event) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        // Trigger the button element with a click
        bt.click();
      }
    });
    this.changeName();
    setInterval(this.changeName, 13000);
  }

  changeName() {
    const example = document.getElementById('name');
    example.setAttribute('placeholder', '二狗');
    setTimeout(function () {
      example.setAttribute('placeholder', '翠花');
    }, 1000);
    setTimeout(function () {
      example.setAttribute('placeholder', '铁蛋');
    }, 2000);
    setTimeout(function () {
      example.setAttribute('placeholder', '栓子');
    }, 3000);
    setTimeout(function () {
      example.setAttribute('placeholder', '狗剩');
    }, 4000);
    setTimeout(function () {
      example.setAttribute('placeholder', '小芳');
    }, 5000);
    setTimeout(function () {
      example.setAttribute('placeholder', '守财');
    }, 6000);
    setTimeout(function () {
      example.setAttribute('placeholder', '傻根');
    }, 7000);
    setTimeout(function () {
      example.setAttribute('placeholder', '托尼');
    }, 8000);
    setTimeout(function () {
      example.setAttribute('placeholder', '玛丽');
    }, 9000);
    setTimeout(function () {
      example.setAttribute('placeholder', '凯文');
    }, 10000);
    setTimeout(function () {
      example.setAttribute('placeholder', '露西');
    }, 11000);
    setTimeout(function () {
      example.setAttribute('placeholder', '杰克');
    }, 12000);
  }

  nameValidate() {
    return this.name === undefined || this.name.length < 1 || this.name.includes(' ') || this.name.includes('  ');
  }

  setName() {
    this.nameSetter.next(this.name);
  }

}
