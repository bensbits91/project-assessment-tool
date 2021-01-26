import * as React from 'react';
import ResultsSummary from './ResultsSummary';
import ResultsSummaryChart from './ResultsSummaryChart';
import ResultsPercentChart from './ResultsPercentChart';
import ResultsScore from './ResultsScore';

// const mcc = 'color:aqua;background-color:black;';

export interface ResultsProps {
    data: any;
}

// export interface ResultsState {}

class Results extends React.Component<ResultsProps, {}> {
    constructor(props: ResultsProps) {
        super(props);
        // this.state = {};
    }

    public render() {
        const { data } = this.props;
        const isLoaded = data.hasOwnProperty('poss_primary');
        const el_head = <div className='resultHead'>Project Readiness: <span className='resultProjName'>{data.proj_name}</span></div>;

        return (
            <>
                {el_head}
                <ResultsSummary data={data} isLoaded={isLoaded} />
                <ResultsScore data={data} isLoaded={isLoaded} />
                <ResultsSummaryChart data={data} isLoaded={isLoaded} />
                <ResultsPercentChart data={data} isLoaded={isLoaded} />
            </>
        );
    }
}

export default Results;