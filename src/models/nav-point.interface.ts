export interface NavPointInterface {
    nodeName: string;
    relations: Array<RelationInterface>,
    attachedShopNode: string;
}

export interface RelationInterface {
    targetNode: string;
    targetfloorId: string;
    type: string;
    accessibility: boolean;
    linkWeight: number;
}