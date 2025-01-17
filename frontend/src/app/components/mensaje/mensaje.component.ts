import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  AnimationTriggerMetadata,
} from '@angular/animations';

const toastAnimation: AnimationTriggerMetadata = trigger('toast', [
  state(
    'show',
    style({
      opacity: '1',
      zIndex: '101',
    })
  ),
  state(
    'hide',
    style({
      opacity: '0',
      zIndex: '-100',
    })
  ),
  transition('hide => show', animate('2s ease')),
  transition('show => hide', animate('2s ease')),
]);
@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.css'],
})
export class MensajeComponent {
  @Input() contenido!: string;
  @Input() tipo!: string;
  showsToast: boolean = false;
  @Output() visible = new EventEmitter<boolean>();

  ngOnInit() {
    setTimeout(() => {
      this.showsToast = true;
    }, 200);
    this.hideToast();
  }

  hideToast() {
    setTimeout(() => {
      this.showsToast = false;
    }, 3000);
    setTimeout(() => {
      this.visible.emit(false);
    }, 3300);
  }

  closeToast() {
    this.showsToast = false;
    setTimeout(() => {
      this.visible.emit(false);
    }, 300);
  }
}
