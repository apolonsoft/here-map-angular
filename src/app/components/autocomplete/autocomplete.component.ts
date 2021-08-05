import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Option} from "../../models/option";

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {
  @Input() label!: string;
  @Input() options!: Option[];
  @Input() name!: string;

  @Output() onChanged: EventEmitter<string> = new EventEmitter<string>()
  @Output() onSelect: EventEmitter<Option> = new EventEmitter<Option>()

  value!: string;
  constructor() { }

  ngOnInit(): void {
  }

  onValueChange() {
    this.onChanged.emit(this.value)
  }

  onSelectOption(option: Option) {
    this.onSelect.emit(option)
    this.value = ''
  }
}
