import { Prisma } from '@prisma/client/extension'

export const softDeleteExtension = () =>
  Prisma.defineExtension({
    name: "prisma-extension-soft-delete",
    model: {
			$allModels: {
				async softDelete<T>(this: T, where: Prisma.Args<T, 'delete'>['where']) {
					const context = Prisma.getExtensionContext(this)
					
					const data = {
						deletedAt: new Date()
					}
					
					return (context as any).update({ where, data })
				},
				async restore<T>(this: T, where: Prisma.Args<T, 'update'>['where']) {
					const context = Prisma.getExtensionContext(this)
					
					const data = {
						deletedAt: null
					}
					
					return (context as any).update({ where, data })
				}
			}
    },
    query: {
			$allOperations({ args, query, operation}) {
        const affectedMethods = ['count', 'findFirst', 'findFirstOrThrow', 'findMany', 'findUnique', 'findUniqueOrThrow']

        if (!affectedMethods.includes(operation)) {
					return query(args)
        }

				// @ts-ignore: Object is possibly 'null'.
        if (args.where) {
					// @ts-ignore: Object is possibly 'null'.
					if (args.where.deletedAt === undefined) {
						// @ts-ignore: Object is possibly 'null'.
						args.where['deletedAt'] = null
					}
        } else {
					Object.assign(args, { where: { deletedAt: null } })
        }

        return query(args)
			}
    }
  })
