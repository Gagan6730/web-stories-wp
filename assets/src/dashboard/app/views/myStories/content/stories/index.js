/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import styled from 'styled-components';
import { FlagsProvider } from 'flagged';

/**
 * Internal dependencies
 */
import { Layout } from '../../../../../components';
import {
  STORY_SORT_OPTIONS,
  SORT_DIRECTION,
  VIEW_STYLE,
  STORY_STATUS,
} from '../../../../../constants';
import {
  formattedStoriesArray,
  formattedUsersObject,
  STORYBOOK_PAGE_SIZE,
} from '../../../../../storybookUtils';
import Content from '../';
import { usePagePreviewSize } from '../../../../../utils';
import StoriesView from '../storiesView';
import EmptyView from '../emptyView';

export default {
  title: 'Dashboard/Views/MyStories/Content',
  component: Content,
};

const filter = {
  status: 'all',
  value: STORY_STATUS.ALL,
  set: action('set filter'),
};
const sort = {
  value: STORY_SORT_OPTIONS.NAME,
  set: action('set sort'),
  direction: SORT_DIRECTION.ASC,
  setDirection: action('set sort direction'),
};
const search = {
  keyword: '',
  setKeyword: action('set search'),
};
const view = {
  style: VIEW_STYLE.GRID,
  toggleStyle: action('toggle view style'),
  pageSize: STORYBOOK_PAGE_SIZE,
};
const page = {
  value: 1,
  set: action('set page number'),
  requestNextPage: action('request next page clicked'),
};
const storyActions = {
  createTemplateFromStory: action('create template from story clicked'),
  duplicateStory: action('duplicate story clicked'),
  trashStory: action('trash story clicked'),
  updateStory: action('update story clicked'),
};

const defaultProps = {
  allPagesFetched: false,
  filter: filter,
  isLoading: false,
  page: page,
  search: search,
  sort: sort,
  stories: formattedStoriesArray,
  storyActions: storyActions,
  users: formattedUsersObject,
  view: view,
};

const StorybookLayoutContainer = styled.div`
  margin-top: 40px;
  height: 100vh;
`;
export const _default = () => {
  const { pageSize } = usePagePreviewSize({
    isGrid: true,
  });

  return (
    <FlagsProvider features={{ enableInProgressStoryActions: false }}>
      <Layout.Provider>
        <StorybookLayoutContainer>
          <Content {...defaultProps} view={{ ...view, pageSize }} />
        </StorybookLayoutContainer>
      </Layout.Provider>
    </FlagsProvider>
  );
};

export const NoStories = () => (
  <Layout.Provider>
    <StorybookLayoutContainer>
      <Content {...defaultProps} stories={[]} />
    </StorybookLayoutContainer>
  </Layout.Provider>
);

export const AllDataFetched = () => {
  const { pageSize } = usePagePreviewSize({
    isGrid: true,
  });
  return (
    <FlagsProvider features={{ enableInProgressStoryActions: false }}>
      <Layout.Provider>
        <StorybookLayoutContainer>
          <Content
            {...defaultProps}
            allPagesFetched={true}
            view={{ ...view, pageSize }}
          />
        </StorybookLayoutContainer>
      </Layout.Provider>
    </FlagsProvider>
  );
};

export const AllDataFetchedAsList = () => {
  const { pageSize } = usePagePreviewSize({
    thumbnailMode: true,
  });
  return (
    <FlagsProvider features={{ enableInProgressStoryActions: false }}>
      <Layout.Provider>
        <StorybookLayoutContainer>
          <Content
            {...defaultProps}
            allPagesFetched={true}
            view={{ ...view, style: VIEW_STYLE.LIST, pageSize }}
          />
        </StorybookLayoutContainer>
      </Layout.Provider>
    </FlagsProvider>
  );
};

export const _StoriesViewGrid = () => (
  <FlagsProvider features={{ enableInProgressStoryActions: false }}>
    <StoriesView
      filterValue={STORY_STATUS.ALL}
      sort={sort}
      storyActions={storyActions}
      stories={formattedStoriesArray}
      users={formattedUsersObject}
      view={view}
      dateFormat="F j, Y"
    />
  </FlagsProvider>
);

export const _StoriesViewList = () => (
  <FlagsProvider features={{ enableInProgressStoryActions: false }}>
    <StoriesView
      filterValue={STORY_STATUS.ALL}
      sort={sort}
      storyActions={storyActions}
      stories={formattedStoriesArray}
      users={formattedUsersObject}
      view={{ ...view, style: VIEW_STYLE.LIST }}
      dateFormat="F j, Y"
    />
  </FlagsProvider>
);

export const _EmptyView = () => (
  <EmptyView searchKeyword={text('searchKeyword', '')} />
);
