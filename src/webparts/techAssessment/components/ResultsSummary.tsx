import * as React from 'react';
import { Shimmer/* , ShimmerElementsGroup, ShimmerElementType */ } from 'office-ui-fabric-react/lib/Shimmer';
import Loading from './Loading';

// const mcc = 'color:aqua;background-color:black;';

export interface ResultsSummaryProps {
    data: any;
    isLoaded: boolean;
}
// export interface ResultsSummaryState {}

class ResultsSummary extends React.Component<ResultsSummaryProps, {}> {
    constructor(props: ResultsSummaryProps) {
        super(props);
        // this.state = {};
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

    public render() {
        const { data, isLoaded } = this.props;
        const style_shimmer = { root: { margin: '20px 50px 0 60px' } };
        const thisProj = data.pct_total <= 39 ? { /* text: 'Not Ready',  */color: 'red' }
            : data.pct_total <= 69 ? { /* text: 'Ready',  */color: 'yellow' }
                : { /* text: 'Very Ready',  */color: 'green' };

        const el = <div className='resultSummaryWrap resultListItem'>
            <div className='tableHead'>Project Readiness Summary</div>
            <Shimmer
                isDataLoaded={isLoaded}
                ariaLabel="Loading assessment"
                styles={style_shimmer}
                customElementsGroup={this._getCustomShimmer()}
            >
                <table>
                    <thead>
                        <th>Section</th>
                        <th>Score</th>
                        <th>% Earned</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Primary Readiness Attributes</td>
                            <td>{data.score_primary}</td>
                            <td>{data.pct_primary}%</td>
                        </tr>
                        <tr>
                            <td>Ancillary Considerations</td>
                            <td>{data.score_ancillary}</td>
                            <td>{data.pct_ancillary}%</td>
                        </tr>
                        <tr>
                            <td>Total</td>
                            <td>{data.score_total}</td>
                            <td className={'bg-' + thisProj.color}>{data.pct_total}%</td>
                        </tr>
                    </tbody>
                </table>
            </Shimmer>
        </div>;

        return el;
    }
}

export default ResultsSummary;