
import { HeaderRowCtrl } from "../../row/headerRowCtrl";
import { IHeaderColumn } from "../../../entities/iHeaderColumn";
import { AbstractHeaderCellCtrl, IAbstractHeaderCellComp } from "../abstractCell/abstractHeaderCellCtrl";
import { Column } from "../../../entities/column";


export interface IHeaderFilterCellComp extends IAbstractHeaderCellComp {
}

export class HeaderFilterCellCtrl extends AbstractHeaderCellCtrl {

    constructor(column: Column, parentRowCtrl: HeaderRowCtrl) {
        super(column, parentRowCtrl);
    }

    public setComp(comp: IHeaderFilterCellComp, eGui: HTMLElement): void {
        super.setAbstractComp(comp, eGui);
    }
}
