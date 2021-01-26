import * as React from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { colors } from './definitions';
import styles from './SigPanel.module.scss';

// const mcc = 'color:hotpink;background-color:black;';

const sigDoneIconClass = mergeStyles({
    fontSize: 30,
    height: 30,
    width: 30,
    margin: '0 25px',
    color: colors.status.green.txt
});

const signIcon: IIconProps = { iconName: 'InsertSignatureLine' };

export interface SigPanelProps {
    showPanel: boolean;
    handler: any;
    sigs: any;
    user: any;
}
// export interface SigPanelState {}

class SigPanel extends React.Component<SigPanelProps, {}> {
    constructor(props: SigPanelProps) {
        super(props);
        // this.state = {};
    }

    public onClick_sigButton(s) {
        if (confirm('You are about to sign as the ' + s.role)) {
            this.props.handler(s.role);
        }
    }

    public render() {

        const { showPanel, sigs, handler, user } = this.props;

        const el_sigs = <div className={styles.sigPanelContentWrap}>
            {sigs.map(s => {
                return (
                    <div className={styles.sigWrap}>
                        <Stack horizontal className={styles.sigStack}>
                            <div className={styles.sigRole}>
                                {s.role}
                            </div>
                            {!s.signedBy &&
                                <div className='sigButton'>
                                    <PrimaryButton
                                        iconProps={signIcon}
                                        text={'Sign as ' + user.name}
                                        onClick={() => this.onClick_sigButton(s)}
                                        styles={{ root: { backgroundColor: '#333' } }}
                                    />
                                </div>
                            }
                            {s.signedBy &&
                                <div className={styles.sigDoneWrap}>
                                    <Icon iconName='CheckMark' className={sigDoneIconClass} />
                                    Signed by {s.signedBy} on {s.signedTime}
                                </div>
                            }
                        </Stack>
                    </div>
                );
            })}
        </div>;

        return (
            <Panel
                isOpen={showPanel}
                headerText='Signatures'
                closeButtonAriaLabel='Close'
                isLightDismiss={true}
                onDismiss={() => {
                    handler('close');
                }}
                type={PanelType.custom}
                customWidth='800px'
                styles={{
                    // root: { backgroundColor: bg_color },
                    // closeButton: { color: color_1 },
                    // main: {
                    //     backgroundColor: bg_color,
                    // },
                    content: {
                        paddingRight: '0!important',
                        paddingLeft: '0!important'
                    },
                    // headerText: {
                    //     color: color_1
                    // }
                }}
            >
                {el_sigs}
            </Panel>
        );
    }
}

export default SigPanel;