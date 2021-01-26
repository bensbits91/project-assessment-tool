import * as React from 'react';
import { Shimmer, ShimmerElementsGroup, ShimmerElementType } from 'office-ui-fabric-react/lib/Shimmer';



export interface LoadingProps {

}

export interface LoadingState {

}

class Loading extends React.Component<LoadingProps, LoadingState> {
    constructor(props: LoadingProps) {
        super(props);
        this.state = {};
    }

    public render() {
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
}

export default Loading;