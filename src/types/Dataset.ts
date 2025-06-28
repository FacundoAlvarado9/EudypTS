export type DataPoint = Array<number>;

export type Header = (number | string);

export type Dataset = {
    headers : Array<Header>;
    data : Array<DataPoint>;
};