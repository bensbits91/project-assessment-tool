import * as React from 'react';
// import { Announced } from 'office-ui-fabric-react/lib/Announced';
import { TextField, ITextFieldStyles } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { DetailsList, DetailsListLayoutMode, Selection, IColumn, IDetailsListStyles } from 'office-ui-fabric-react/lib/DetailsList';
// import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { Shimmer/* , ShimmerElementsGroup, ShimmerElementType */ } from 'office-ui-fabric-react/lib/Shimmer';
import Loading from './Loading';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts';
import { colors, sigs_needed } from './definitions';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

// const mcc = 'color:black;background-color:white;';

const style_checkboxIcon = {
    root: {
        color: colors.status.green.bg,
        fontSize: 18,
        marginRight: 6
    }
};
const CheckboxDoneIcon = () => <Icon
    iconName='CheckboxCompositeReversed'
    className='ms-IconExample'
    styles={style_checkboxIcon}
/>;
const CheckboxIcon = () => <Icon
    iconName='Checkbox'
    className='ms-IconExample'
    styles={style_checkboxIcon}
/>;

const style_detailsList: Partial<IDetailsListStyles> = {
    root: {
        marginTop: 30
    }
};

const exampleChildClass = mergeStyles({
    display: 'block',
    marginBottom: '10px',
});

const textFieldStyles: Partial<ITextFieldStyles> = { root: { maxWidth: '300px' } };

export interface IListItem {
    key: number;
    id: number;
    title: string;
    status: string;
    pctReady: string;
    pct: number;
    sigs: any;
    view: number;
    edit: number;
}

export interface IListProps {
    items: any;
    results: any;
    handler: any;
}

export interface IListState {
    items: IListItem[];
}

export default class List extends React.Component<IListProps, IListState> {
    private _selection: Selection;
    private _allItems: IListItem[];
    private _columns: IColumn[];

    constructor(props: IListProps) {
        super(props);

        // this._selection = new Selection({
        //     onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() }),
        // });

        // this._allItems = [];
        // // for (let i = 0; i < 200; i++) {
        // //   this._allItems.push({
        // //     key: i,
        // //     name: 'Item ' + i,
        // //     value: i,
        // //   });
        // // }
        // this.props.items.map(i => {
        //     this._allItems.push({
        //         key: i.Id,
        //         title: i.Title,
        //         id: i.Id
        //     });
        // });

        this._columns = [
            { key: 'column1', name: 'ID', fieldName: 'id', minWidth: 50, maxWidth: 50, isResizable: false },
            { key: 'column2', name: 'Title', fieldName: 'title', minWidth: 50, maxWidth: 200, isResizable: true },
            { key: 'column3', name: 'Status', fieldName: 'status', minWidth: 100, maxWidth: 100, isResizable: true },
            { key: 'column4', name: '% Ready', fieldName: 'pctReady', minWidth: 50, maxWidth: 250, isResizable: true },
            { key: 'column6', name: 'Signatures', fieldName: 'sigs', minWidth: 50, maxWidth: 125, isResizable: true },
            { key: 'column7', name: '', fieldName: 'view', minWidth: 100, maxWidth: 100, isResizable: false },
            { key: 'column8', name: '', fieldName: 'edit', minWidth: 100, maxWidth: 100, isResizable: false },
        ];

        this.state = {
            items: this._allItems,
            // selectionDetails: this._getSelectionDetails(),
        };

        this._onRenderItemColumn = this._onRenderItemColumn.bind(this);
        this.onclick_listButton = this.onclick_listButton.bind(this);
    }

    public componentDidMount() {
        this._allItems = [];
        if (this.props.items) {
            this.props.items.map(i => {
                const pct = i.ResultData ? JSON.parse(i.ResultData).pct_total : 0;
                const pctReady = pct + '%';
                const status = pct < 39 ? 'Not Ready' : pct < 69 ? 'Ready' : 'Very Ready';

                const sigs_obj = i.Signatures ? JSON.parse(i.Signatures) : sigs_needed;
                const sigs = this.show_sigs(sigs_obj);

                this._allItems.push({
                    key: i.Id,
                    title: i.Title,
                    id: i.Id,
                    status: status,
                    pctReady: pctReady,
                    pct: pct,
                    sigs: sigs,
                    view: null,
                    edit: null
                });
            });
            this.setState({ items: this._allItems });
        }
    }

    private _getCustomShimmer = (): JSX.Element => {
        return (
            <Loading />
            // <div style={{ display: 'flex' }}>
            //     <ShimmerElementsGroup
            //         flexWrap={true}
            //         width="100%"
            //         shimmerElements={[
            //             { type: ShimmerElementType.line, width: '100%', height: 20, verticalAlign: 'bottom' },

            //             { type: ShimmerElementType.gap, width: '100%', height: 10 },

            //             { type: ShimmerElementType.line, width: '75%', height: 20 },
            //             { type: ShimmerElementType.gap, width: '25%', height: 20 },

            //             { type: ShimmerElementType.gap, width: '100%', height: 10 },

            //             { type: ShimmerElementType.line, width: '50%', height: 20 },
            //             { type: ShimmerElementType.gap, width: '50%', height: 20 },
            //         ]}
            //     />
            // </div>
        );
    }

    public show_sigs(sigs) {
        const checkboxes = sigs.map(s => {
            if (s.signedBy) return <CheckboxDoneIcon />;
            return <CheckboxIcon />;
        });
        return checkboxes;
    }

    public onclick_listButton(button, iid) {
        this.props.handler(button, iid);
    }

    public _onRenderItemColumn(item: IListItem, index: number, column: IColumn) {
        const fieldContent = item[column.fieldName as keyof IListItem] as string;
        const { pct } = item;
        const bgColor = pct <= 39 ? colors.status.red.bg
            : pct <= 69 ? colors.status.yellow.bg
                : colors.status.green.bg;

        switch (column.fieldName) {
            case 'pctReady':
                return (
                    <span style={{ lineHeight: '40px' }}>
                        <BarChart
                            width={250}
                            height={20}
                            data={[{ pct: item.pct }]}
                            barSize={20}
                            layout='vertical'
                        >
                            <YAxis
                                dataKey='pct'
                                type='number'
                                hide
                            />
                            <XAxis
                                type='number'
                                domain={[0, 100]}
                                hide
                            />
                            {/* <Tooltip unit='%' /> */}

                            <Bar
                                dataKey='pct'
                                fill={bgColor}
                                // animationBegin={1500}
                                // animationDuration={2500}
                                label={{ position: 'right' }}
                            />
                        </BarChart>
                    </span>
                );

            case 'view':
                return <DefaultButton
                    text='View'
                    onClick={(e) => this.onclick_listButton(column.fieldName, item.id)}
                />;

            case 'edit':
                return <DefaultButton
                    text='Edit'
                    onClick={(e) => this.onclick_listButton(column.fieldName, item.id)}
                />;

            default:
                return <span style={{ lineHeight: '32px' }}>{fieldContent}</span>;
        }
    }

    public render(): JSX.Element {
        const { items, /* selectionDetails */ } = this.state;

        const el = items ? <Fabric style={{ padding: '10px 40px' }}>
            {/* <div className={exampleChildClass}>{selectionDetails}</div> */}
            {/* <Announced message={selectionDetails} /> */}
            <TextField
                className={exampleChildClass}
                label='Filter by name:'
                onChange={this._onFilter}
                styles={textFieldStyles}
            />
            {/* <Announced message={`Number of items after filter applied: ${items.length}.`} /> */}
            {/* <MarqueeSelection selection={this._selection}> */}
            <DetailsList
                compact={true}
                items={items}
                columns={this._columns}
                setKey='set'
                layoutMode={DetailsListLayoutMode.justified}
                // selection={this._selection}
                // selectionPreservedOnEmptyClick={true}
                onItemInvoked={this._onItemInvoked.bind(this)}
                // ariaLabelForSelectionColumn='Toggle selection'
                // ariaLabelForSelectAllCheckbox='Toggle selection for all items'
                // checkButtonAriaLabel='Row checkbox'
                checkboxVisibility={2}
                onRenderItemColumn={this._onRenderItemColumn}
                styles={style_detailsList}
            />
            {/* </MarqueeSelection> */}
        </Fabric>
            : <></>;


        const isLoaded = !!items;

        const style_shimmer = { root: { margin: '20px 50px 0 0' } };

        return (
            <Shimmer
                isDataLoaded={isLoaded}
                ariaLabel='Loading assessment'
                styles={style_shimmer}
                customElementsGroup={this._getCustomShimmer()}
            >
                {el}
            </Shimmer>
        );
    }

    // private _getSelectionDetails(): string {
    //     const selectionCount = this._selection.getSelectedCount();
    //     switch (selectionCount) {
    //         case 0:
    //             return 'No items selected';
    //         case 1:
    //             return '1 item selected: ' + (this._selection.getSelection()[0] as IListItem).title;
    //         default:
    //             return `${selectionCount} items selected`;
    //     }
    // }

    private _onFilter = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
        this.setState({
            items: text ? this._allItems.filter(i => i.title.toLowerCase().indexOf(text) > -1) : this._allItems,
        });
    }

    public _onItemInvoked(item: IListItem): void {
        this.props.handler('view', item.id);
    }
}
