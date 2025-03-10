import Vue from 'vue';
import { AgGridVue } from '@ag-grid-community/vue';

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';

import 'styles.css';

let rowIdSequence = 100;

function createDataItem(color) {
    const obj = {
        id: rowIdSequence++,
        color: color,
        value1: Math.floor(Math.random() * 100),
        value2: Math.floor(Math.random() * 100)
    };

    return obj;
}

function createLeftRowData() {
    return ['Red', 'Green', 'Blue'].map((color) => createDataItem(color));
}

const VueExample = {
    template: /* html */
        `<div class="example-wrapper ag-theme-alpine">

            <div class="inner-col">
                <div class="toolbar">
                    <button class="factory factory-red" data-color="Red" data-side="left" @click="onFactoryButtonClick($event)">
                        <i class="far fa-plus-square"></i>Add Red
                    </button>
                    <button class="factory factory-green" data-color="Green" data-side="left" @click="onFactoryButtonClick($event)">
                        <i class="far fa-plus-square"></i>Add Green
                    </button>
                    <button class="factory factory-blue" data-color="Blue" data-side="left" @click="onFactoryButtonClick($event)">
                        <i class="far fa-plus-square"></i>Add Blue
                    </button>
                </div>
                <div style="height: 100%;" class="inner-col" ref="eLeftGrid">
                    <ag-grid-vue
                        style="height: 100%;"
                        :defaultColDef="defaultColDef"
                        :getRowNodeId="getRowNodeId"
                        :rowClassRules="rowClassRules"
                        :rowDragManaged="true"
                        :suppressMoveWhenRowDragging="true"
                        :animateRows="true"
                        :rowData="leftRowData"
                        :columnDefs="columns"
                        @grid-ready="onGridReady($event, 'Left')"
                        :modules="modules">
                    </ag-grid-vue>
                </div>
            </div>

            <div class="inner-col vertical-toolbar">
                <span class="bin" ref="eBin">
                    <i class="far fa-trash-alt fa-3x" ref="eBinIcon"></i>
                </span>
            </div>

            <div class="inner-col">
                <div class="toolbar">
                    <button class="factory factory-red" data-color="Red" data-side="right" @click="onFactoryButtonClick($event)">
                        <i class="far fa-plus-square"></i>Add Red
                    </button>
                    <button class="factory factory-green" data-color="Green" data-side="right" @click="onFactoryButtonClick($event)">
                        <i class="far fa-plus-square"></i>Add Green
                    </button>
                    <button class="factory factory-blue" data-color="Blue" data-side="right" @click="onFactoryButtonClick($event)">
                        <i class="far fa-plus-square"></i>Add Blue
                    </button>
                </div>
                <div style="height: 100%;" class="inner-col" ref="eRightGrid">
                    <ag-grid-vue
                        style="height: 100%;"
                        :defaultColDef="defaultColDef"
                        :getRowNodeId="getRowNodeId"
                        :rowClassRules="rowClassRules"
                        :rowDragManaged="true"
                        :suppressMoveWhenRowDragging="true"
                        :animateRows="true"
                        :rowData="rightRowData"
                        :columnDefs="columns"
                        @grid-ready="onGridReady($event, 'Right')"
                        :modules="modules">
                    </ag-grid-vue>
                </div>
            </div>
    `,
    components: {
        'ag-grid-vue': AgGridVue
    },
    data: function () {
        return {
            modules: [ClientSideRowModelModule],
            leftRowData: [],
            rightRowData: [],
            leftApi: null,
            rightApi: null,
            rowClassRules: {
                "red-row": 'data.color == "Red"',
                "green-row": 'data.color == "Green"',
                "blue-row": 'data.color == "Blue"'
            },
            defaultColDef: {
                flex: 1,
                minWidth: 100,
                sortable: true,
                filter: true,
                resizable: true
            },
            columns: [
                { field: "id", rowDrag: true },
                { field: "color" },
                { field: "value1" },
                { field: "value2" }
            ]
        };
    },
    beforeMount() {
        this.leftRowData = createLeftRowData();
    },
    methods: {
        getRowNodeId(data) {
            return data.id;
        },

        onGridReady(params, side) {
            const api = params.api;
            if (side === 'Left') {
                this.leftApi = api;
            } else {
                this.rightApi = api;
            }

            this.addBinZone(api);
            this.addGridDropZone(side, api);
        },

        addRecordToGrid(side, data) {
            // if data missing or data has no it, do nothing
            if (!data || data.id == null) { return; }

            const api = side === 'left' ? this.leftApi : this.rightApi;
            // do nothing if row is already in the grid, otherwise we would have duplicates
            const rowAlreadyInGrid = !!api.getRowNode(data.id);
            let transaction;

            if (rowAlreadyInGrid) {
                console.log('not adding row to avoid duplicates in the grid');
                return;
            }

            transaction = {
                add: [data]
            };

            api.applyTransaction(transaction);
        },

        onFactoryButtonClick(e) {
            var button = e.currentTarget,
                buttonColor = button.getAttribute('data-color'),
                side = button.getAttribute('data-side'),
                data = createDataItem(buttonColor);

            this.addRecordToGrid(side, data);
        },

        binDrop(data) {
            // if data missing or data has no id, do nothing
            if (!data || data.id == null) { return; }

            var transaction = {
                remove: [data]
            };

            [this.leftApi, this.rightApi].forEach((api) => {
                var rowsInGrid = !!api.getRowNode(data.id);

                if (rowsInGrid) {
                    api.applyTransaction(transaction);
                }
            });
        },

        addBinZone(api) {
            const dropZone = {
                getContainer: () => this.$refs.eBinIcon,
                onDragEnter: () => {
                    this.$refs.eBin.style.color = 'blue';
                    this.$refs.eBinIcon.style.transform = 'scale(1.5)';
                },
                onDragLeave: () => {
                    this.$refs.eBin.style.color = 'black';
                    this.$refs.eBinIcon.style.transform = 'scale(1)';
                },
                onDragStop: (params) => {
                    this.binDrop(params.node.data);
                    this.$refs.eBin.style.color = 'black';
                    this.$refs.eBinIcon.style.transform = 'scale(1)';
                }
            };

            api.addRowDropZone(dropZone);
        },

        addGridDropZone(side, api) {
            const dropSide = side === 'Left' ? 'Right' : 'Left';
            const dropZone = {
                getContainer: () => dropSide === 'Left' ? this.$refs.eLeftGrid : this.$refs.eRightGrid,
                onDragStop: (dragParams) => this.addRecordToGrid(dropSide.toLowerCase(), dragParams.node.data)
            };

            api.addRowDropZone(dropZone);
        }
    }
};

new Vue({
    el: '#app',
    components: {
        'my-component': VueExample
    }
});