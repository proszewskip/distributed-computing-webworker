namespace Server.Pagination
{
    public interface IPaginationInfo
    {
        int PageNumber { get; }
        int PageSize { get; }
    }
}
