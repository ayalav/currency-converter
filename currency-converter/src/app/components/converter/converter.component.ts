import { Component, signal, Signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss'
})
export class ConverterComponent {
  form = new FormGroup({
    amount: new FormControl(0),
    from: new FormControl('USD'),
    to: new FormControl('EUR'),
  });

  result: Signal<number | null> = signal(null);
  history = signal<Array<{ from: string; to: string; amount: number; result: number }>>([]);

  constructor() {}

  convert() {}
  
   
}
