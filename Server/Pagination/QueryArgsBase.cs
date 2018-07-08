namespace Server.Pagination
{
    public class QueryArgsBase : IPaginationInfo
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
