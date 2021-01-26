import * as React from 'react';
import { Shimmer/* , ShimmerElementsGroup, ShimmerElementType */ } from 'office-ui-fabric-react/lib/Shimmer';
import Loading from './Loading';

// const mcc = 'color:orange;background-color:black;';

export interface ResultsScoreProps {
    data: any;
    isLoaded: boolean;
}
// export interface ResultsScoreState {}

class ResultsScore extends React.Component<ResultsScoreProps, {}> {
    constructor(props: ResultsScoreProps) {
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

        const thisProj = data.pct_total <= 39 ? { text: 'Not Ready', color: 'red' }
            : data.pct_total <= 69 ? { text: 'Ready', color: 'yellow' }
                : { text: 'Very Ready', color: 'green' };

        const el = <div className='resultScoreWrap resultListItem'>
            <div className='tableHead'>Readiness for Adoption Score</div>
            <Shimmer
                isDataLoaded={isLoaded}
                ariaLabel="Loading assessment"
                styles={style_shimmer}
                customElementsGroup={this._getCustomShimmer()}
            >
                <table>
                    <thead>
                        <th>Range</th>
                        <th>Readiness Scale</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>0-39%</td>
                            <td>Not Ready</td>
                        </tr>
                        <tr>
                            <td>40-69%</td>
                            <td>Ready</td>
                        </tr>
                        <tr>
                            <td>70-100%</td>
                            <td>Very Ready</td>
                        </tr>
                        <tr className={'bg-' + thisProj.color}>
                            <td>This project:</td>
                            <td>{thisProj.text}</td>
                        </tr>
                    </tbody>
                </table>
            </Shimmer>
        </div>;

        return el;
    }
}

export default ResultsScore;