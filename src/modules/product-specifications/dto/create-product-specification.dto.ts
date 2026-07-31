export class CreateProductSpecificationDto {
    productId: number;
    specifications: Array<{
        specKey: string;
        specValue: string;
    }>;
}