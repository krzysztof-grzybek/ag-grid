import { AfterViewInit, Component, ViewChild, ViewContainerRef } from "@angular/core";
import { ICellEditorParams } from "ag-grid-community";
import { ICellEditorAngularComp } from "ag-grid-angular";

const KEY_BACKSPACE = 'Backspace';
const KEY_DELETE = 'Delete';

@Component({
    selector: 'editor-cell',
    template: `<input class="my-simple-editor" [value]="value" #input /> `
})
export class MySimpleEditor implements ICellEditorAngularComp, AfterViewInit {
    private params!: ICellEditorParams;
    public value: any;

    @ViewChild('input', { read: ViewContainerRef }) public input!: ViewContainerRef;

    agInit(params: ICellEditorParams): void {
        this.params = params;

        this.value = this.getInitialValue(params);
    }

    getValue(): any {
        return this.value;
    }

    getInitialValue(params: ICellEditorParams): any {
        let startValue = params.value;

        const isBackspaceOrDelete = params.key === KEY_BACKSPACE || params.key === KEY_DELETE;
        if (isBackspaceOrDelete) {
            startValue = '';
        } else if (params.charPress) {
            startValue = params.charPress;
        }

        if (startValue !== null && startValue !== undefined) {
            return startValue;
        }

        return '';
    }

    myCustomFunction() {
        return {
            rowIndex: this.params.rowIndex,
            colId: this.params.column.getId()
        };
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.input.element.nativeElement.focus();
        });
    }
}
