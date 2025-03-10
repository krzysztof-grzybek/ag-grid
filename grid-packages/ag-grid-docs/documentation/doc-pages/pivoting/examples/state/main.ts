import { Grid, ColumnState, GridOptions } from '@ag-grid-community/core'

const gridOptions: GridOptions = {
  columnDefs: [
    { field: 'athlete', enableRowGroup: true, enablePivot: true },
    { field: 'age', enableValue: true },
    { field: 'country', enableRowGroup: true, enablePivot: true },
    { field: 'year', enableRowGroup: true, enablePivot: true },
    { field: 'date', enableRowGroup: true, enablePivot: true },
    { field: 'sport', enableRowGroup: true, enablePivot: true, pivot: true },
    { field: 'gold', enableValue: true },
    { field: 'silver', enableValue: true },
    { field: 'bronze', enableValue: true },
    { field: 'total', enableValue: true },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 150,
    filter: true,
    resizable: true,
  },
  autoGroupColumnDef: {
    minWidth: 300,
  },
  sideBar: true,
}

var savedState: ColumnState[];
var savedPivotMode: boolean;

function printState() {
  var state = gridOptions.columnApi!.getColumnState()
  console.log(state)
}

function saveState() {
  savedState = gridOptions.columnApi!.getColumnState()
  savedPivotMode = gridOptions.columnApi!.isPivotMode()
  console.log('column state saved')
}

function restoreState() {
  if (savedState) {
    gridOptions.columnApi!.applyColumnState({ state: savedState })
    gridOptions.columnApi!.setPivotMode(savedPivotMode)
    console.log('column state restored')
  } else {
    console.log('no previous column state to restore!')
  }
}

function togglePivotMode() {
  var pivotMode = gridOptions.columnApi!.isPivotMode()
  gridOptions.columnApi!.setPivotMode(!pivotMode)
}

function resetState() {
  gridOptions.columnApi!.resetColumnState()
  gridOptions.columnApi!.setPivotMode(false)
  console.log('column state reset')
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector<HTMLElement>('#myGrid')!
  new Grid(gridDiv, gridOptions)

  fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then(response => response.json())
    .then(data => gridOptions.api!.setRowData(data))
})
