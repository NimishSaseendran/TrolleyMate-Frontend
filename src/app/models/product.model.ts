export interface Product {
    pkProductId: string;
    strName: string;
    intSellingPrice: number;
    intActualPrice: number;
    strCategory: string;
    strBrand?: string;
    strUnit?: string;
    strImage?: string;
    strDescription: string;
    strWeight?: string;
    intDiscountPercentage?: number;
    arrTags?: string[];
    blnIsAvailable?: boolean;
    intStockQuantity: number;
    dateAddedDate: string;
    dateExpiryDate?: string;
    intLimitPerUser?: number;
    intRatings?: number;
    arrReviews?: string[];
    strRfid?: string;
}
