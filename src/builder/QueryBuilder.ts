type QueryParams = {
  searchTerm?: string;
  sort?: string;
  limit?: string;
  page?: string;
  fields?: string; // for select
  include?: any;   // for include
  [key: string]: unknown;
};

export class PrismaQueryBuilder<T> {
  private queryParams: QueryParams;
  private searchableFields: string[];
  private prismaQuery: any = {};

  constructor(query: QueryParams, searchableFields: string[] = []) {
    this.queryParams = query;
    this.searchableFields = searchableFields;

    // Safely add include if it's an object
    if (query.include && typeof query.include === 'object') {
      this.prismaQuery.include = query.include;
    }
  }

  buildWhere() {
    const {
      searchTerm,
      sort,
      limit,
      page,
      fields,
      include,
      ...filters
    } = this.queryParams;

    const where: any = {};

    // Handle search
    if (searchTerm?.trim() && this.searchableFields.length > 0) {
      where.OR = this.searchableFields.map((field) => ({
        [field]: {
          contains: searchTerm.trim(),
          mode: 'insensitive',
        },
      }));
    }

    // Apply filters
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        where[key] = value;
      }
    }

    this.prismaQuery.where = where;
    return this;
  }

  buildSort() {
    const sortStr = this.queryParams.sort || '-createdAt';

    const sortFields = sortStr.split(',').map((field) => {
      const order = field.startsWith('-') ? 'desc' : 'asc';
      const key = field.replace(/^-/, '');
      return { [key]: order };
    });

    this.prismaQuery.orderBy = sortFields;
    return this;
  }

  buildPagination() {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;
    const skip = (page - 1) * limit;

    this.prismaQuery.skip = skip;
    this.prismaQuery.take = limit;
    return this;
  }

  buildSelect() {
    const fields = this.queryParams.fields;
    if (fields) {
      const selected = fields.split(',').reduce((acc: any, field: string) => {
        acc[field.trim()] = true;
        return acc;
      }, {});
      this.prismaQuery.select = selected;
    }
    return this;
  }

  getQuery() {
    return this.prismaQuery;
  }

  getPaginationMeta = async (
    model: any,
  ): Promise<{
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  }> => {
    const total = await model.count({ where: this.prismaQuery.where });
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return { total, totalPage, page, limit };
  };
}
