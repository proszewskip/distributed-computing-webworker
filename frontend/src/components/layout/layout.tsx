import { IconButton, majorScale, Pane } from 'evergreen-ui';
import React, { PureComponent, ReactNode, MouseEventHandler } from 'react';

import { Desktop, Mobile } from 'components/responsive-helpers';

export interface LayoutProps {
  renderSidebar: () => ReactNode;
}

interface LayoutState {
  isSidebarShown: boolean;
}

export class Layout extends PureComponent<LayoutProps, LayoutState> {
  public state: LayoutState = {
    isSidebarShown: false,
  };

  public render() {
    return (
      <>
        <Mobile>
          {this.state.isSidebarShown && this.renderMobileSidebar()}

          <Pane
            display="flex"
            flexDirection="column"
            width="100%"
            height="100%"
          >
            <IconButton
              icon="menu"
              onClick={this.openSidebar}
              margin={majorScale(2)}
            />

            {this.renderMain()}
          </Pane>
        </Mobile>

        <Desktop>
          <Pane display="flex" height="100%">
            <Pane width={200} height="100%">
              {this.props.renderSidebar()}
            </Pane>

            {this.renderMain()}
          </Pane>
        </Desktop>
      </>
    );
  }

  private renderMobileSidebar = (): ReactNode => (
    <Pane
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      zIndex={100}
      onClick={this.closeSidebar}
      background="overlay"
    >
      <Pane onClick={this.stopPropagation} height="100%" width={200}>
        {this.props.renderSidebar()}
      </Pane>
    </Pane>
  );

  private renderMain = (): ReactNode => (
    <Pane flex={1} overflow="auto">
      {this.props.children}
    </Pane>
  );

  private openSidebar = () => {
    this.setState({
      isSidebarShown: true,
    });
  };

  private closeSidebar = () => {
    this.setState({
      isSidebarShown: false,
    });
  };

  private stopPropagation: MouseEventHandler = (event) =>
    event.stopPropagation();
}
