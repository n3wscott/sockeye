import * as PropTypes from 'prop-types';
import * as React from 'react';
interface ITheme {
    [key: string]: string;
}
interface IProps extends React.HTMLAttributes<HTMLElement> {
    json?: any;
    data?: any;
    replacer?: (key: string, value: any) => any | null;
    space?: number | string;
    themeClassName?: string;
    theme?: ITheme;
    silent?: boolean;
    onJSONPrettyError?: (e: Error) => void;
    mainStyle?: string;
    keyStyle?: string;
    stringStyle?: string;
    valueStyle?: string;
    booleanStyle?: string;
    errorStyle?: string;
}
declare class JSONPretty extends React.Component<IProps, {}> {
    static propTypes: {
        data: PropTypes.Requireable<any>;
        json: PropTypes.Requireable<any>;
        replacer: PropTypes.Requireable<(...args: any[]) => any>;
        silent: PropTypes.Requireable<boolean>;
        space: PropTypes.Requireable<string | number>;
        theme: PropTypes.Requireable<object>;
        themeClassName: PropTypes.Requireable<string>;
        onJSONPrettyError: PropTypes.Requireable<(...args: any[]) => any>;
    };
    static defaultProps: {
        data: string;
        json: string;
        silent: boolean;
        space: number;
        themeClassName: string;
    };
    render(): JSX.Element;
    private _pretty;
    private _replace;
}
export = JSONPretty;
