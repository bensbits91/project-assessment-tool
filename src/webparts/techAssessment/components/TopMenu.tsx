import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { CommandBarButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { colors } from './definitions';

// const mcc = 'color:darkorange;';

export interface TopMenuProps {
    handler: any;
    mode: string;
}
// export interface TopMenuState {}

class TopMenu extends React.Component<TopMenuProps, {}> {
    constructor(props: TopMenuProps) {
        super(props);
        // this.state = {};
    }

    public render() {

        const { mode } = this.props;

        const items_list: ICommandBarItemProps[] = [
            {
                key: 'new',
                button_id: 'new',
                text: 'New',
                iconProps: { iconName: 'Add' },
            }
        ];

        const items_display: ICommandBarItemProps[] = [
            {
                key: 'home',
                button_id: 'home',
                text: 'Home',
                iconProps: { iconName: 'Home' },
            },
            {
                key: 'edit',
                button_id: 'edit',
                text: 'Edit',
                iconProps: { iconName: 'PageHeaderEdit' },
            },
            {
                key: 'signatures',
                button_id: 'signatures',
                text: 'Signatures',
                iconProps: { iconName: 'InsertSignatureLine' },
            },
        ];

        const items_edit: ICommandBarItemProps[] = [
            {
                key: 'save',
                button_id: 'save',
                text: 'Save',
                iconProps: { iconName: 'SaveAll' },
            },
            {
                key: 'signatures',
                button_id: 'signatures',
                text: 'Signatures',
                iconProps: { iconName: 'InsertSignatureLine' },
            },
            {
                key: 'cancel',
                button_id: 'cancel',
                text: 'Cancel',
                iconProps: { iconName: 'Cancel' },
            }
        ];

        const items_new: ICommandBarItemProps[] = [
            {
                key: 'save',
                button_id: 'save',
                text: 'Save',
                iconProps: { iconName: 'SaveAll' },
            },
            {
                key: 'cancel',
                button_id: 'cancel',
                text: 'Cancel',
                iconProps: { iconName: 'Cancel' },
            }
        ];

        const { handler } = this.props;
        const itemStyles = {
            // root: { backgroundColor: colors.black.b3 },
            root: { border: 'none' },
            // rootHovered: { backgroundColor: colors.black.b5 },
            icon: { color: colors.mint },
            iconHovered: { color: colors.navy },
            // label: { color: colors.black.b9 },
            // labelHovered: { color: colors.gray.c },
        };

        const CustomButton: React.FunctionComponent<IButtonProps> = (props: any) => {
            return (
                <CommandBarButton
                    {...props}
                    onClick={e => handler(e, props.button_id)}
                    styles={{
                        ...props.styles,
                        ...itemStyles
                    }}
                />
            );
        };

        // const styles_commandBar = dark ? { root: { backgroundColor: colors.black.b3 } } : {};

        return (
            <CommandBar
                items={mode == 'display' ? items_display : mode == 'edit' ? items_edit : mode == 'new' ? items_new : items_list}
                // overflowItems={top_menu_overflowItems}
                // overflowButtonProps={overflowProps}
                // farItems={top_menu_farItems}
                // ariaLabel='Use left and right arrow keys to navigate between commands'
                // styles={styles_commandBar}
                buttonAs={CustomButton}
            />
        );
    }
}

export default TopMenu;