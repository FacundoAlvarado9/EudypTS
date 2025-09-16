export type Scale = {
    name : string;
    scale : Array<string>;
}

export type HeatmapConfig = {
    id : number;
    name : string;
    data : Array<number>;
    min : number;
    max : number;
    defaultMin : number;
    defaultMax : number;
    scaleIndex : number;
}

export type WarpingPair = {
    n : number;
    f_n : number;
    d_o_g : number;
}

export type VisEntry = {
    index: number;
    warping: number;
    distance: number;
    misalignment: number;
    degree_of_misalignment: number;
};