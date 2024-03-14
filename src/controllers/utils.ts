export function generateMetaPage(currentPage: number, limit: number, total: number) {
    const totalPage = Math.ceil(total / limit);

    return {
        page: Number(limit),
        size: Number(total),
        current: Number(currentPage),
    };
}