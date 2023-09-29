"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteExtension = void 0;
const extension_1 = require("@prisma/client/extension");
const softDeleteExtension = () => extension_1.Prisma.defineExtension({
    name: "prisma-extension-soft-delete",
    model: {
        $allModels: {
            softDelete(where) {
                return __awaiter(this, void 0, void 0, function* () {
                    const context = extension_1.Prisma.getExtensionContext(this);
                    const data = {
                        deletedAt: new Date()
                    };
                    return context.update({ where, data });
                });
            },
            restore(where) {
                return __awaiter(this, void 0, void 0, function* () {
                    const context = extension_1.Prisma.getExtensionContext(this);
                    const data = {
                        deletedAt: null
                    };
                    return context.update({ where, data });
                });
            }
        }
    },
    query: {
        $allOperations({ args, query, operation }) {
            const affectedMethods = ['count', 'findFirst', 'findFirstOrThrow', 'findMany', 'findUnique', 'findUniqueOrThrow'];
            if (!affectedMethods.includes(operation)) {
                return query(args);
            }
            // @ts-ignore: Object is possibly 'null'.
            if (args.where) {
                // @ts-ignore: Object is possibly 'null'.
                if (args.where.deletedAt === undefined) {
                    // @ts-ignore: Object is possibly 'null'.
                    args.where['deletedAt'] = null;
                }
            }
            else {
                Object.assign(args, { where: { deletedAt: null } });
            }
            return query(args);
        }
    }
});
exports.softDeleteExtension = softDeleteExtension;
