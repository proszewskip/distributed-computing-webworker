import { IconButton, majorScale, Pane } from 'evergreen-ui';
import React, { MouseEventHandler, PureComponent, ReactNode } from 'react';

import { Desktop, Mobile } from 'components/responsive-helpers';

const desktopSidebarWidth = 220;
const mobileSidebarWidth = 220;

export interface LayoutProps {
  renderSidebar: () => ReactNode;
}

interface LayoutState {
  isSidebarShown: boolean;
}

/**
 * The main application layout.
 *
 * Allows for customizing the sidebar and main content.
 *
 * Handles collapsing the sidebar on mobile.
 */
export class Layout extends PureComponent<LayoutProps, LayoutState> {
  public state: LayoutState = {
    isSidebarShown: false,
  };

  public render() {
    const { isSidebarShown } = this.state;

    return (
      <>
        <Mobile>
          {isSidebarShown && this.renderMobileSidebar()}

          <Pane
            display="flex"
            flexDirection="column"
            width="100%"
            height="100%"
          >
            <IconButton
              icon="menu"
              onClick={this.openSidebar}
              margin={majorScale(1)}
              title={isSidebarShown ? 'Hide menu' : 'Open menu'}
            />

            {this.renderMain()}
          </Pane>
        </Mobile>

        <Desktop>
          <Pane display="flex" height="100%">
            <Pane width={desktopSidebarWidth} height="100%">
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
      <Pane
        onClick={this.stopPropagation}
        height="100%"
        width={mobileSidebarWidth}
      >
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
