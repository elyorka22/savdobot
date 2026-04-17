import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { saleCreateSchema } from "@/lib/validations"
import { handleValidationError, createSuccessResponse, withCors, withRateLimit } from "@/lib/api-utils"

async function handler(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = saleCreateSchema.parse(body)

    const sale = await prisma.sale.create({
      data: {
        amount: validatedData.amount,
        description: validatedData.description,
      },
    })

    return createSuccessResponse({
      ...sale,
      date: sale.date.toISOString(),
    }, "Sale created successfully")
  } catch (error) {
    return handleValidationError(error)
  }
}

export const POST = withCors(withRateLimit(handler))

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        skip,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      prisma.sale.count(),
    ])

    return createSuccessResponse({
      sales: sales.map(sale => ({
        ...sale,
        date: sale.date.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return handleValidationError(error)
  }
}
