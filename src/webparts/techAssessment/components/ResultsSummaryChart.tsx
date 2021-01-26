import * as React from 'react';
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from 'recharts';
import { colors } from './definitions';
import { Shimmer/* , ShimmerElementsGroup, ShimmerElementType */ } from 'office-ui-fabric-react/lib/Shimmer';
import Loading from './Loading';

// const mcc = 'color:magenta;background-color:black;';

export interface ResultsSummaryChartProps {
    data: any;
    isLoaded: boolean;
}
// export interface ResultsSummaryChartState {}

class ResultsSummaryChart extends React.Component<ResultsSummaryChartProps, {}> {
    constructor(props: ResultsSummaryChartProps) {
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

        const data_chart = [
            {
                name: 'Primary Readiness',
                Score: data.score_primary
            },
            {
                name: 'Ancillary Considerations',
                Score: data.score_ancillary
            },
        ];

        const yDomMax = Math.max(data.poss_primary, data.poss_ancillary);

        const bgColor = data.pct_total <= 39 ? colors.status.red.bg
            : data.pct_total <= 69 ? colors.status.yellow.bg
                : colors.status.green.bg;

        return (
            <div className='chartWrap resultListItem'>
                <div className='tableHead'>Project Readiness Score at a Glance</div>
                <Shimmer
                    isDataLoaded={isLoaded}
                    ariaLabel="Loading assessment"
                    styles={style_shimmer}
                    customElementsGroup={this._getCustomShimmer()}
                >
                    <BarChart
                        width={400}
                        height={300}
                        data={data_chart}
                        barSize={20}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, yDomMax]} />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey="Score"
                            // animationBegin={1000}
                            // animationDuration={2500}
                            fill={bgColor}
                        />
                    </BarChart>
                </Shimmer>
            </div>
        );
    }
}

export default ResultsSummaryChart;