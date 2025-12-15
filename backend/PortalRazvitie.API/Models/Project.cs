namespace PortalRazvitie.API.Models;

public class Project
{
    public int Id { get; set; }
    public int StoreId { get; set; }
    public string ProjectType { get; set; } = string.Empty; // "Открытие" или "Реконструкция"
    public string Status { get; set; } = "Создан";
    public string GisCode { get; set; } = string.Empty;
    
    // Информация об объекте
    public string Address { get; set; } = string.Empty;
    public double? TotalArea { get; set; }
    public double? TradeArea { get; set; }
    public string Region { get; set; } = string.Empty;
    public string CFO { get; set; } = string.Empty; // ЦФО
    
    // Ответственные (пока как строки, потом можно заменить на FK к Users)
    public string MP { get; set; } = string.Empty;
    public string NOR { get; set; } = string.Empty;
    public string StMRiZ { get; set; } = string.Empty;
    public string RNR { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation property
    public Store? Store { get; set; }
}
