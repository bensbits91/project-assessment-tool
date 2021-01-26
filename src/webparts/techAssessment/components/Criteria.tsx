import * as React from 'react';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { colors } from './definitions';

// const mcc = 'color:aqua;';

export interface CriteriaProps {
    criteria: any;
    handler: any;
    result_data: any;
    mode: string;
}

export interface CriteriaState {
    checked: boolean;
}

class Criteria extends React.Component<CriteriaProps, CriteriaState> {
    constructor(props: CriteriaProps) {
        super(props);
        this.state = {
            checked: this.props.criteria.checked
        };
    }

    public render() {
        const { criteria, result_data, mode } = this.props;
        const { checked } = this.state;

        const bgColor = checked ?
            result_data.pct_total <= 39 ? colors.status.red.bg
                : result_data.pct_total <= 69 ? colors.status.yellow.bg
                    : colors.status.green.bg
            : 'unset';

        const isDisabled = mode == 'display';

        const checkbox_opacity = isDisabled ? 0.4 : 1;

        const el_checkbox = <Checkbox
            checked={this.state.checked}
            disabled={isDisabled}
            onChange={(e, c) => {
                this.props.handler({
                    criteriaId: criteria.Id,
                    checked: c
                });
                this.setState({ checked: c });
            }}
            styles={{
                root: {
                    opacity: checkbox_opacity
                },
                label: {
                    selectors: {
                        '&:hover .ms-Checkbox-checkbox': {
                            backgroundColor: bgColor,
                            borderColor: bgColor,
                        }
                    }
                },
                checkbox: {
                    backgroundColor: bgColor,
                    borderColor: bgColor,

                },
                checkmark: {
                    color: 'black',
                }
            }}
        />;

        const el = <Stack horizontal className='criteriaWrap'>
            <div className='criteriaTitle'>{criteria.Title}</div>
            <div className='criteriaCheckbox'>{el_checkbox}</div>
            <div className='criteriaText'>{criteria.Criteria}</div>
        </Stack >;

        return (
            el
        );
    }
}

export default Criteria;