import TooltipJS from 'tooltip.js';
import { Moment } from 'moment';
import { AxiosInstance, AxiosPromise } from 'axios';

declare module "@fustrate/rails" {
    const debugData: any[];

    function addDebugData(data: any): void;

    type Listener = () => void;

    interface ModalSettings {
        size: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge',
        type?: string,
        icon?: string,
        content?: string,
        title?: string,
        buttons: ('spacer' | string | { [s: string]: string | { text?: string, type?: string } })[],
        distanceFromTop: number,
    }

    interface PaginationData {
        currentPage?: number,
        totalPages?: number,
        totalEntries?: number,
        perPage?: number,
    }

    class Listenable {
        listeners: { [s: string]: ((event: CustomEvent) => void)[] };

        addEventListener(type: string, listener: (event: CustomEvent) => void): void;
        removeEventListener(type: string, listener: (event: CustomEvent) => void): void;
        dispatchEvent(event: CustomEvent): boolean;
    }

    class BasicObject extends Listenable {
        constructor(data: number | string | { [s: string]: any });

        extractFromData(data: { [s: string]: any }): { [s: string]: any };

        get isBasicObject(): boolean;

        static build(data: number | string | { [s: string]: any }, attributes: { [s: string]: any }): BasicObject | null;
        static buildList(items: any[], attributes: { [s: string]: any }): [BasicObject];
    }

    class Record extends BasicObject {
        static classname: string;

        id?: number;
        isLoaded: boolean;

        constructor(data: number | string | { [s: string]: any });

        path(options: { format?: string }): string;
        reload(options: { force?: boolean }): Promise<any>;
        update(attributes: { [s: string]: any }, additionalParameters: { [s: string]: any }): Promise<any>;
        delete(params:  { [s: string]: any }): Promise<any>;

        get classname(): string;

        static create(attributes: { [s: string]: any }): Promise<any>;

        static get paramKey(): string;
    }

    class Component extends Listenable {
    }

    class AlertBox extends Component {
        static initialize(): void;
        static closeAlertBox(event: UIEvent): false;
    }

    interface AutocompleteDatum {
    }

    class AutocompleteSuggestion extends String {
        datum: AutocompleteDatum;

        constructor(datum: AutocompleteDatum, displayValue: string);

        highlight(input: string, text: string): string;
        item(text: string): HTMLLIElement;
        highlightedHTML(value: string): string;
    }

    class PlainAutocompleteSuggestion extends AutocompleteSuggestion {
        constructor(datum: AutocompleteDatum);
    }

    class AutocompleteSource {
        matches(datum: AutocompleteDatum): boolean;
        filter(suggestion: AutocompleteSuggestion, userInput: string): boolean;
        suggestion(datum: AutocompleteDatum): AutocompleteSuggestion;
    }

    class PlainAutocompleteSource extends AutocompleteSource {
        list: string[];

        constructor(list: string[]);

        filter(suggestion: AutocompleteSuggestion, userInput: string): boolean;
        suggestion(datum: AutocompleteDatum): PlainAutocompleteSuggestion;
        matchingData(searchTerm: string): string[];
    }

    interface AutocompleteOptions {
        source?: AutocompleteSource,
        sources?: AutocompleteSource[],
        list?: string[],
    }

    class Autocomplete extends Component {
        input: HTMLInputElement;
        awesomplete: Awesomplete;
        sources: AutocompleteSource[];
        value: string;

        constructor(input: HTMLInputElement, options?: AutocompleteOptions);

        extractOptions(options: AutocompleteOptions): void;
        sourceForDatum(datum: AutocompleteDatum): AutocompleteSource;
        suggestionForDatum(datum: AutocompleteDatum): AutocompleteSuggestion;
        blanked(): void;
        onSelect(event: UIEvent): void;
        onFocus(): void;
        onKeyup(event: UIEvent): void;
        highlight(text: string): string;
        replace(suggestion: AutocompleteSuggestion): void;

        static create(input: HTMLInputElement, options?: AutocompleteOptions): Autocomplete;
    }

    class PlainAutocomplete extends Autocomplete {
        static create(input: HTMLInputElement, options?: AutocompleteOptions): PlainAutocomplete;

        onSelect(event: UIEvent): void
    }

    class Disclosure extends Component {
        static initialize(): void;
        static toggleDisclosure(event: UIEvent): false;
    }

    class DropZone extends Component {
        constructor(target: HTMLElement, callback: (files: File[]) => void);

        static create(target: HTMLElement, callback: (files: File[]) => void): void;
    }

    class Dropdown extends Component {
        static initialize(): void;
        static open(event: UIEvent): false;
        static hide(): void;
    }

    class FilePicker extends Component {
        constructor(callback: (files: File[]) => void);
    }

    class Flash extends Component {
        constructor(message: string, options: { type: string, icon?: string });

        static show(message: string, options: { type: string, icon?: string }): Flash;
    }

    class InfoFlash extends Flash {
        constructor(message: string, options: { icon?: string });

        static show(message: string, options: { icon?: string }): InfoFlash;
    }

    class ErrorFlash extends Flash {
        constructor(message: string, options: { icon?: string });

        static show(message: string, options: { icon?: string }): ErrorFlash;
    }

    class SuccessFlash extends Flash {
        constructor(message: string, options: { icon?: string });

        static show(message: string, options: { icon?: string }): SuccessFlash;
    }

    class Modal extends Component {
        buttons: { [s: string]: HTMLButtonElement };
        fields: { [s: string]: HTMLElement };
        modalId: number;
        settings: ModalSettings;
        modal: HTMLDivElement;

        static get settings(): ModalSettings;

        constructor(settings: ModalSettings);

        initialize(): void;
        reloadUIElements(): void;
        setTitle(title: string, options: { icon?: string }): void;
        setContent(content: string, reload?: boolean): void;
        setButtons(buttons, reload?: boolean): void;
        addEventListeners(): void;
        focusFirstInput(): void;
        open(): void;
        close(openPrevious?: boolean): void;
        hide(): void;
        cancel(): void;
        openPreviousModal(): void;
        createModal(): HTMLDivElement;
        defaultClasses(): string[];
        closeButtonClicked(event: UIEvent): false;

        static get closeOnBackgroundClick(): boolean;

        static backgroundClicked(): false;
        static hideAllModals(): void;
        static keyPressed(event: UIEvent): void;
    }

    class Pagination extends Component {
        currentPage: number;
        totalPages: number;
        totalEntries: number;
        perPage: number;
        base: string;

        constructor(options: PaginationData);

        link(text: string, page: number, attributes: { [s: string]: any }): string;
        previousLink(): HTMLLIElement;
        nextLink(): HTMLLIElement;
        generate(): HTMLUListElement;
        windowedPageNumbers(): (string|number)[];

        static getCurrentPage(): number;
    }

    class Tabs extends Component {
        tabs: HTMLUListElement;

        constructor(tabs: HTMLUListElement);

        activateTab(tab: HTMLLIElement, changeHash: boolean): void;

        static initialize(): Tabs;
    }

    class Tooltip extends Component {
        static create(node: HTMLElement, title: string, options: { placement?: string, container?: HTMLElement }): TooltipJS;
    }

    class FormDataBuilder {
        static build(obj: { [s: string]: any }, namespace?: string): FormData;
        static appendObject(data: FormData, key: string, value: any): void;
        static toFormData(data: FormData, obj: { [s: string]: any }, namespace?: string): FormData;
    }

    class GenericPage {
        fields: { [s: string]: HTMLElement };
        buttons: { [s: string]: HTMLElement };
        allMethodNamesList: string[];

        initialize(): Promise<any>;
        addEventListeners(): void;
        reloadUIElements(): void;
        setHeader(text: string): void;
        refresh(): void;
        callAllMethodsBeginningWith(string: string): void;
        getAllMethodNames(): string[];
    }

    class GenericTable extends GenericPage {
        table: HTMLTableElement;
        tbody: HTMLTableSectionElement;

        static noRecordsMessage: string;

        constructor(tableSelector: string);

        initialize(): Promise<any>;
        reloadTable(): void;
        createRow(item: Record | { [s: string]: any }): HTMLTableRowElement;
        reloadRows(trs: HTMLTableRowElement[], options: { sort?: (a: HTMLTableRowElement, b: HTMLTableRowElement) => number }): void;
        addRow(row: HTMLTableRowElement): void;
        removeRow(row: HTMLTableRowElement): void;
        updated(): void;
        getCheckedIds(): string[];
        checkAll(event: UIEvent): void;
        uncheckAll(): void;
        updatePagination(data: PaginationData): void;
      }

    class Fustrate {
        static instance: GenericPage;

        constructor();

        static start(klass: GenericPage): void;
        static initialize(): void;
    }

    export = Fustrate;
}

declare module "@fustrate/rails/ajax" {
    function when(...requests: AxiosPromise[]): Promise<any>;
    function getCurrentPageJson(): AxiosPromise;

    export = AxiosInstance;
}

declare module "@fustrate/rails/array" {
    function toSentence(arr: string[]): string;
}

declare module "@fustrate/rails/number" {
    function accountingFormat(number: number): string;
    function truncate(number: number, digits: number): string;
    function bytesToString(number: number): string;
    function ordinalize(number: number): string;
}

declare module "@fustrate/rails/object" {
    function isPlainObject(object: any): boolean;
    function deepExtend(out: object, ...rest: object[]): object;
}

declare module "@fustrate/rails/show_hide" {
    function isVisible(elem: HTMLElement): boolean;
    function toggle(element: NodeList | HTMLElement, showOrHide?: boolean): void;
    function show(element: NodeList | HTMLElement): void;
    function hide(element: NodeList | HTMLElement): void;
}

declare module "@fustrate/rails/string" {
    function humanize(string?: string): string;
    function isBlank(string?: string): boolean;
    function isPresent(string?: string): boolean;
    function parameterize(string?: string): string;
    function phoneFormat(string?: string): string;
    function pluralize(string?: string): string;
    function presence(string?: string): (string | undefined);
    function underscore(string?: string): string;
}

declare module "@fustrate/rails/utilities" {
    function animate(element: HTMLElement, animation: string, options: { delay?: string, speed?: string }, callback?: () => void): void;
    function elementFromString<T extends HTMLElement>(string: string): T;
    function hms(seconds: number, zero: boolean): string;
    function icon(types: string, style: string): string;
    function label(text: string, type?: string): string;
    function multilineEscapeHTML(string: string): string;
    function linkTo(text: string, href?: string | any, attributes?: { [s: string]: any }): string;
    function redirectTo(href: string | any): void;
    function toHumanDate(momentObject: Moment, time: boolean): string;
}
