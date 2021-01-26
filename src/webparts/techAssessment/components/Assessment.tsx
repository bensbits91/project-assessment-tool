import * as React from 'react';
import { ScrollablePane } from 'office-ui-fabric-react/lib/ScrollablePane';
import FieldText from './FieldText';
import { Shimmer, ShimmerElementsGroup, ShimmerElementType } from 'office-ui-fabric-react/lib/Shimmer';
import Section from './Section';
import Results from './Results';

// const mcc = 'color:yellow;';

export interface AssessmentProps {
    mode: string;
    proj_name: string;
    sections: any;
    results: any;
    handler: any;
    handler_projName: any;
}

export interface AssessmentState {
    proj_name: string;
    sections: any;
}

class Assessment extends React.Component<AssessmentProps, AssessmentState> {
    constructor(props: AssessmentProps) {
        super(props);
        this.state = {
            proj_name: this.props.proj_name,
            sections: this.props.sections
        };
    }

    public componentDidMount() {
        if (Array.isArray(this.state.sections)) {
            this.calcInitScores(this.state.sections).then(sections_with_scores => {
                this.setState({ sections: sections_with_scores });
            });
        }
    }

    public trimDecimals(num) {
        return Math.round(num * 100) / 100;
    }

    public handler_textField(field, text) {
        this.props.handler_projName(text);
        this.setState({ proj_name: text });
    }

    private _getCustomShimmer = (): JSX.Element => {
        return (
            <div style={{ display: 'flex' }}>
                <ShimmerElementsGroup
                    flexWrap={true}
                    width="100%"
                    shimmerElements={[
                        { type: ShimmerElementType.line, width: '100%', height: 20, verticalAlign: 'bottom' },

                        { type: ShimmerElementType.gap, width: '100%', height: 10 },

                        { type: ShimmerElementType.line, width: '75%', height: 20 },
                        { type: ShimmerElementType.gap, width: '25%', height: 20 },

                        { type: ShimmerElementType.gap, width: '100%', height: 10 },

                        { type: ShimmerElementType.line, width: '50%', height: 20 },
                        { type: ShimmerElementType.gap, width: '50%', height: 20 },
                    ]}
                />
            </div>
        );
    }


    public calcInitScores = (sections) => new Promise(resolve => {
        sections.map(s => {
            s.score = 0;
            s.subsections.map(ss => {
                ss.score = ss.ScorePerCriteria * ss.criteria.filter(c => c.checked).length;
                s.score += ss.score;
            });
        });
        resolve(sections);
    })


    public handler_checkbox(data) {

        this.props.handler(data);

        let sections_copy = JSON.parse(JSON.stringify(this.state.sections));
        const mySection = sections_copy.filter(s => s.Id === data.sectionId)[0];
        const mySub = mySection.subsections.filter(ss => ss.Id === data.subId)[0];
        const myCriteria = mySub.criteria.filter(c => c.Id === data.criteriaId)[0];

        myCriteria.checked = data.checked;

        const sub_checked = mySub.criteria.filter(sc => sc.checked);
        const sub_checked_count = sub_checked.length;
        const sub_score = this.trimDecimals(mySub.ScorePerCriteria * sub_checked_count);

        mySub.score = sub_score;


        const sectionScore = mySection.subsections.reduce((a, b) => a + b.score || a, 0);

        mySection.score = sectionScore;

        this.setState({ sections: sections_copy });
    }


    public render() {
        const { mode, results } = this.props;
        const { proj_name, sections } = this.state;

        let el_sections, el_results;

        let result_data: any = results ? results : {
            proj_name: proj_name
        };

        const el_pageHead = <div className='pageHead'>Technology Readiness/Adoption Assessment Instrument</div>;

        const el_projName = <div className='projName'>
            <FieldText
                field={{
                    InternalName: 'projName',
                    Title: 'Project Name: ',
                    value: proj_name,
                }}
                handler={this.handler_textField.bind(this)}
                mode={mode}
            />
        </div>;

        const isLoaded = sections != 'loading';

        if (isLoaded) {
            el_sections = <div className='sectionList'>
                {sections.map(s => {
                    return <Section
                        section={s}
                        handler={this.handler_checkbox.bind(this)}
                        result_data={result_data}
                        mode={mode}
                    />;
                })}
            </div>;

            el_results = <div className='resultList'>
                <Results
                    data={result_data}
                />
            </div>;
        }

        const style_shimmer = { root: { margin: '20px 50px 0 0' } };

        return (
            <>
                <ScrollablePane className='formPane'>
                    {el_pageHead}

                    <Shimmer
                        isDataLoaded={isLoaded}
                        ariaLabel="Loading assessment"
                        styles={style_shimmer}
                        customElementsGroup={this._getCustomShimmer()}
                    >
                        {el_projName}
                        {el_sections}
                    </Shimmer>
                </ScrollablePane>
                <ScrollablePane className='resultPane'>
                    {el_results}
                </ScrollablePane>
            </>
        );
    }
}

export default Assessment;