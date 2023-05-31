import { connect, ConnectedProps } from 'react-redux';
import { AppDispatch, RootState } from './store';

const mapStateToProps = (state: RootState) => ({
  lang: state.lang,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  dispatch,
});

export const defaultConnector = connect(mapStateToProps, mapDispatchToProps);

export type DefaultConnectorProps = ConnectedProps<typeof defaultConnector>;
