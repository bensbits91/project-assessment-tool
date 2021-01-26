import * as React from 'react';
import Subsection from './Subsection';
import { Stack } from 'office-ui-fabric-react/lib/Stack';

// const mcc = 'color:teal;';

export interface SectionProps {
    section: any;
    handler: any;
    result_data: any;
    mode: string;
}
// export interface SectionState {}

class Section extends React.Component<SectionProps, {}> {
    constructor(props: SectionProps) {
        super(props);
        // this.state = {};
    }

    public handler_sub(data) {
        data.sectionId = this.props.section.Id;
        this.props.handler(data);
    }

    public trimDecimals(num) {
        return Math.round(num * 100) / 100;
    }


    public render() {
        const { section, result_data, mode } = this.props;

        const el_head = <div className='sectionHead'>
            <Stack horizontal>
                <div className='sectionTitle'>{section.Title}</div>
                <div className='sectionScoreWrap'>
                    <span>Section score: </span>
                    <span>{this.trimDecimals(section.score || 0)}</span>
                    <span> / </span>
                    <span>{section.possScore || 0}</span>
                </div>
            </Stack>
        </div>;

        const el_subs = <div className='subList'>
            {section.subsections.map(s => {
                return <Subsection
                    sub={s}
                    handler={this.handler_sub.bind(this)}
                    result_data={result_data}
                    mode={mode}
                />;
            })}
        </div>;

        return (
            <div className='sectionWrap'>
                {el_head}
                {el_subs}
            </div>
        );
    }
}

export default Section;