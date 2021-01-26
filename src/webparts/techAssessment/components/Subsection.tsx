import * as React from 'react';
import Criteria from './Criteria';
import { Stack } from 'office-ui-fabric-react/lib/Stack';

// const mcc = 'color:magenta;';

export interface SubsectionProps {
    sub: any;
    handler: any;
    result_data: any;
    mode: string;
}
// export interface SubsectionState {}

class Subsection extends React.Component<SubsectionProps, {}> {
    constructor(props: SubsectionProps) {
        super(props);
        // this.state = {};
    }

    public handler_criteria(data) {
        data.subId = this.props.sub.Id;
        this.props.handler(data);
    }

    public render() {

        const { sub, result_data, mode } = this.props;

        const el_head =
            <Stack horizontal className='subInner'>
                <div className='subTitle'>{sub.Title}</div>
                <div className='sectionScoreWrap'>
                    <span>Subsection score: </span>
                    <span>{sub.score || 0}</span>
                    <span> / </span>
                    <span>{sub.possScore || 0}</span>
                </div>
            </Stack>;

        const el_criteria = <div className='criteriaList'>
            {sub.criteria.map(c => {
                return <Criteria
                    criteria={c}
                    handler={this.handler_criteria.bind(this)}
                    result_data={result_data}
                    mode={mode}
                />;
            })}
        </div>;

        return (
            <div className='subWrap'>
                {el_head}
                {el_criteria}
            </div>
        );
    }
}

export default Subsection;