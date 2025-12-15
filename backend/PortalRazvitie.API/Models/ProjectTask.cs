namespace PortalRazvitie.API.Models;

public class ProjectTask
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string TaskType { get; set; } = string.Empty; // "Планирование аудита", "Согласование контура", "Расчет бюджета"
    public string Responsible { get; set; } = string.Empty;
    public DateTime NormativeDeadline { get; set; }
    public DateTime? ActualDate { get; set; }
    public string Status { get; set; } = "Назначена"; // "Назначена", "В работе", "Завершена", "Срыва сроков"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation
    public Project? Project { get; set; }
}
