export interface Product {
    id: number;
    gvtId: number;
    name: string;
    productTagline: string;
    shortDescription: string;
    longDescription: string;
    logoLocation: string;
    productUrl: string;
    voucherTypeName: string;
    orderUrl: string;
    productTitle: string;
    variableDenomPriceMinAmount: string;
    variableDenomPriceMaxAmount: string;
    __typename: string;
}

export interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    data: T[];
    pagination: PaginationInfo;
}