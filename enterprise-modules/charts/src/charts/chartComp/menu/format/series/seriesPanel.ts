import {
    _,
    AgGroupComponent,
    AgGroupComponentParams,
    AgSelect,
    AgSlider,
    AgToggleButton,
    Autowired,
    Component,
    ListOption,
    PostConstruct,
    RefSelector
} from "@ag-grid-community/core";
import { ShadowPanel } from "./shadowPanel";
import { FontPanel } from "../fontPanel";
import { ChartTranslationService } from "../../../services/chartTranslationService";
import { initFontPanelParams } from "./fontPanelParams";
import { ChartOptionsService } from "../../../services/chartOptionsService";
import { getMaxValue } from "../formatPanel";
import { MarkersPanel } from "./markersPanel";
import { ChartController } from "../../../chartController";
import { ChartSeriesType, getSeriesType } from "../../../utils/seriesTypeMapper";
import { CalloutPanel } from "./calloutPanel";

export class SeriesPanel extends Component {

    public static TEMPLATE = /* html */
        `<div>
            <ag-group-component ref="seriesGroup">                
            </ag-group-component>
        </div>`;

    @RefSelector('seriesGroup') private seriesGroup: AgGroupComponent;

    @Autowired('chartTranslationService') private chartTranslationService: ChartTranslationService;

    private activePanels: Component[] = [];
    private seriesType: ChartSeriesType;

    private widgetFuncs: {[name: string]: () => void}= {
        'lineWidth': () => this.initLineWidth(),
        'strokeWidth': () => this.initStrokeWidth(),
        'lineDash': () => this.initLineDash(),
        'lineOpacity': () => this.initLineOpacity(),
        'fillOpacity': () => this.initFillOpacity(),
        'markers': () => this.initMarkers(),
        'labels': () => this.initLabels(),
        'shadow': () => this.initShadow(),
        'tooltips': () => this.initTooltips(),
        'bins': () => this.initBins(),
    };

    private seriesWidgetMappings: {[name: string]: string[]} = {
        'area': ['tooltips', 'lineWidth', 'lineDash', 'lineOpacity', 'fillOpacity', 'markers', 'labels', 'shadow'],
        'bar': ['tooltips', 'strokeWidth', 'lineDash', 'lineOpacity', 'fillOpacity', 'labels', 'shadow'],
        'column': ['tooltips', 'strokeWidth', 'lineDash', 'lineOpacity', 'fillOpacity', 'labels', 'shadow'],
        'line': ['tooltips', 'lineWidth', 'lineDash', 'lineOpacity', 'markers', 'labels'],
        'histogram': ['tooltips', 'bins', 'strokeWidth', 'lineDash', 'lineOpacity', 'fillOpacity', 'labels', 'shadow'],
        'scatter': ['tooltips', 'markers', 'labels'],
        'pie': ['tooltips', 'strokeWidth', 'lineOpacity', 'fillOpacity', 'labels', 'shadow'],
    }

    constructor(private readonly chartController: ChartController, private readonly chartOptionsService: ChartOptionsService,
                seriesType: ChartSeriesType) {

        super();

        this.seriesType = seriesType;
    }

    @PostConstruct
    private init() {
        const groupParams: AgGroupComponentParams = {
            cssIdentifier: 'charts-format-top-level',
            direction: 'vertical'
        };
        this.setTemplate(SeriesPanel.TEMPLATE, {seriesGroup: groupParams});

        this.seriesGroup
            .setTitle(this.translate("series"))
            .toggleGroupExpand(false)
            .hideEnabledCheckbox(true);

        this.refreshWidgets();
    }

    private refreshWidgets(): void {
        this.destroyActivePanels();
        this.seriesWidgetMappings[this.seriesType].forEach(w => this.widgetFuncs[w]());
    }

    private initTooltips(): void {
        const seriesTooltipsToggle = this.createBean(new AgToggleButton());
        seriesTooltipsToggle
            .setLabel(this.translate("tooltips"))
            .setLabelAlignment("left")
            .setLabelWidth("flex")
            .setInputWidth(45)
            .setValue(this.getSeriesOption("tooltip.enabled") || false)
            .onValueChange(newValue => this.setSeriesOption("tooltip.enabled", newValue));

        this.addWidget(seriesTooltipsToggle);
    }

    private initStrokeWidth(): void {
        const currentValue = this.getSeriesOption<number>("strokeWidth");

        const seriesStrokeWidthSlider = this.createBean(new AgSlider());
        seriesStrokeWidthSlider
            .setLabel(this.translate("strokeWidth"))
            .setMaxValue(getMaxValue(currentValue, 10))
            .setTextFieldWidth(45)
            .setValue(`${currentValue}`)
            .onValueChange(newValue => this.setSeriesOption("strokeWidth", newValue));

        this.addWidget(seriesStrokeWidthSlider);
    }

    private initLineWidth() {
        const currentValue = this.getSeriesOption<number>("strokeWidth");

        const seriesLineWidthSlider = this.createBean(new AgSlider());
        seriesLineWidthSlider
            .setLabel(this.translate('lineWidth'))
            .setMaxValue(getMaxValue(currentValue, 10))
            .setTextFieldWidth(45)
            .setValue(`${currentValue}`)
            .onValueChange(newValue => this.setSeriesOption("strokeWidth", newValue));

        this.addWidget(seriesLineWidthSlider);
    }

    private initLineDash(): void {
        const lineDash = this.getSeriesOption<number[]>("lineDash");
        const currentValue = lineDash ? lineDash[0] : 0;

        const seriesLineDashSlider = this.createBean(new AgSlider());
        seriesLineDashSlider
            .setLabel(this.translate('lineDash'))
            .setMaxValue(getMaxValue(currentValue, 30))
            .setTextFieldWidth(45)
            .setValue(`${currentValue}`)
            .onValueChange(newValue => this.setSeriesOption("lineDash", [newValue]));

        this.addWidget(seriesLineDashSlider);
    }

    private initLineOpacity(): void {
        const currentValue = this.getSeriesOption<number>("strokeOpacity");

        const seriesLineOpacitySlider = this.createBean(new AgSlider());
        seriesLineOpacitySlider
            .setLabel(this.translate("strokeOpacity"))
            .setStep(0.05)
            .setMaxValue(getMaxValue(currentValue, 1))
            .setTextFieldWidth(45)
            .setValue(`${currentValue}`)
            .onValueChange(newValue => this.setSeriesOption("strokeOpacity", newValue));

        this.addWidget(seriesLineOpacitySlider);
    }

    private initFillOpacity(): void {
        const currentValue = this.getSeriesOption<number>("fillOpacity");

        const seriesFillOpacitySlider = this.createBean(new AgSlider());
        seriesFillOpacitySlider
            .setLabel(this.translate("fillOpacity"))
            .setStep(0.05)
            .setMaxValue(getMaxValue(currentValue, 1))
            .setTextFieldWidth(45)
            .setValue(`${currentValue}`)
            .onValueChange(newValue => this.setSeriesOption("fillOpacity", newValue));

        this.addWidget(seriesFillOpacitySlider);
    }

    private initLabels() {
        const params = initFontPanelParams(this.chartTranslationService, this.chartOptionsService, () => this.seriesType);
        const labelPanelComp = this.createBean(new FontPanel(params));

        if (this.seriesType === 'pie') {
            const calloutPanelComp = this.createBean(new CalloutPanel(this.chartOptionsService, () => this.seriesType));
            labelPanelComp.addCompToPanel(calloutPanelComp);
            this.activePanels.push(calloutPanelComp);
        }

        this.addWidget(labelPanelComp);
    }

    private initShadow() {
        const shadowPanelComp = this.createBean(new ShadowPanel(this.chartOptionsService, () => this.seriesType));
        this.addWidget(shadowPanelComp);
    }

    private initMarkers() {
        const markersPanelComp = this.createBean(new MarkersPanel(this.chartOptionsService, () => this.seriesType));
        this.addWidget(markersPanelComp);
    }

    private initBins() {
        const currentValue = this.getSeriesOption<number>("binCount");

        const seriesBinCountSlider = this.createBean(new AgSlider());
        seriesBinCountSlider
            .setLabel(this.translate("histogramBinCount"))
            .setMinValue(4)
            .setMaxValue(getMaxValue(currentValue, 100))
            .setTextFieldWidth(45)
            .setValue(`${currentValue}`)
            .onValueChange(newValue => this.setSeriesOption("binCount", newValue));

        this.addWidget(seriesBinCountSlider);
    }

    private addWidget(widget: Component): void {
        this.seriesGroup.addItem(widget);
        this.activePanels.push(widget);
    }

    private getSeriesOption<T = string>(expression: string): T {
        return this.chartOptionsService.getSeriesOption<T>(expression, this.seriesType);
    }

    private setSeriesOption<T = string>(expression: string, newValue: T): void {
        this.chartOptionsService.setSeriesOption(expression, newValue, this.seriesType);
    }

    private translate(key: string, defaultText?: string) {
        return this.chartTranslationService.translate(key, defaultText);
    }

    private destroyActivePanels(): void {
        this.activePanels.forEach(panel => {
            _.removeFromParent(panel.getGui());
            this.destroyBean(panel);
        });
    }

    protected destroy(): void {
        this.destroyActivePanels();
        super.destroy();
    }
}
