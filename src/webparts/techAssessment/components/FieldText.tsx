import * as React from 'react';
import { TextField, ITextFieldStyles } from 'office-ui-fabric-react/lib/TextField';

const textFieldStyles: Partial<ITextFieldStyles> = {
    subComponentStyles: {
        label: { root: { display: 'inline-block', marginRight: '10px' } },
    },
    fieldGroup: { display: 'inline-flex'/* , maxWidth: '100px' */ },
    wrapper: { display: 'block', marginBottom: '10px' },
};

export interface FieldTextProps {
    field: any;
    handler: any;
    multiline?: boolean;
    rows?: number;
    placeholder?: string;
    mode: string;
}

export interface FieldTextState {}

class FieldText extends React.Component<FieldTextProps, FieldTextState> {
    constructor(props: FieldTextProps) {
        super(props);
        this.state = {};
    }

    public _onChange(f, o) {
        this.props.handler(f.InternalName, o);
    }

    // private _onRenderLabel = (props/* : ITextFieldProps */)/* : JSX.Element */ => {
    //     return (
    //         <span style={{ color: colors.gray.c }}>{props.label}</span>
    //     );
    // }

    public render() {
        const { field, placeholder, mode } = this.props;
        const placeholder_toShow = placeholder || 'Please enter text here';
        return (
            <div>
                <TextField
                    id={field.InternalName}
                    label={field.Title}
                    placeholder={placeholder_toShow}
                    disabled={mode == 'display'}
                    defaultValue={field.value}
                    multiline={this.props.multiline ? this.props.multiline : false}
                    rows={this.props.multiline && this.props.rows ? this.props.rows : 1}
                    styles={textFieldStyles}
                    // subComponentStyles={{ label: { float: 'left', marginRight: 20 } }}
                    // onRenderLabel={this._onRenderLabel}
                    // onChange={(e, o) => this._onChange(e, o)}
                    onChange={(e, t) => this._onChange(field, t)}

                />

            </div>
        );
    }
}

export default FieldText;