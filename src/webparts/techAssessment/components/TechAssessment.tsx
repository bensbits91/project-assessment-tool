import * as React from 'react';
import { ITechAssessmentProps } from './ITechAssessmentProps';
import App from './App';
import './global.scss';
import './temp.css';

export default class TechAssessment extends React.Component<ITechAssessmentProps, {}> {

  public render(): React.ReactElement<ITechAssessmentProps> {
    return (
      <App />
    );
  }
}
