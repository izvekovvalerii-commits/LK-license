namespace PortalRazvitie.API.Models;

public class Store
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public double TotalArea { get; set; }
    public double TradeArea { get; set; }
    public string Status { get; set; } = "Active";
    public DateTime OpeningDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
