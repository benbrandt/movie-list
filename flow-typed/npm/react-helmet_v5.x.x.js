// flow-typed signature: fe2ea7000fec5eb66c0762e55100865a
// flow-typed version: c44c93d4e9/react-helmet_v5.x.x/flow_>=v0.53.x

import type { Node, Element } from 'react';

declare module 'react-helmet' {
    declare type Props = {
      base?: Object,
      bodyAttributes?: Object,
      children?: Node,
      defaultTitle?: string,
      defer?: boolean,
      encodeSpecialCharacters?: boolean,
      htmlAttributes?: Object,
      link?: Array<Object>,
      meta?: Array<Object>,
      noscript?: Array<Object>,
      onChangeClientState?: (
        newState?: Object,
        addedTags?: Object,
        removeTags?: Object
      ) => any,
      script?: Array<Object>,
      style?: Array<Object>,
      title?: string,
      titleAttributes?: Object,
      titleTemplate?: string,
    }

    declare interface TagMethods {
      toString(): string;
      toComponent(): [Element<*>] | Element<*> | Array<Object>;
    }

    declare interface StateOnServer {
      base: TagMethods;
      bodyAttributes: TagMethods,
      htmlAttributes: TagMethods;
      link: TagMethods;
      meta: TagMethods;
      noscript: TagMethods;
      script: TagMethods;
      style: TagMethods;
      title: TagMethods;
    }

    declare class Helmet extends React$Component<Props> {
      static rewind(): StateOnServer;
      static canUseDom(canUseDOM: boolean): void;
    }

    declare export default typeof Helmet
    declare export var Helmet: typeof Helmet
}

