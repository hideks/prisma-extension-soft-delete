import { Prisma } from '@prisma/client/extension';
export declare const softDeleteExtension: () => (client: any) => import("@prisma/client/extension").PrismaClientExtends<import("@prisma/client/runtime/library").InternalArgs<{}, {
    $allModels: {
        softDelete<T>(this: T, where: Prisma.Args<T, "delete">["where"]): Promise<any>;
        restore<T_1>(this: T_1, where: Prisma.Args<T_1, "update">["where"]): Promise<any>;
    };
}, {}, {}>>;
